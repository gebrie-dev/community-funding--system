from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Campaign, Transaction, WithdrawalRequest
from .serializers import CampaignSerializer, CampaignListSerializer
from .tasks import send_campaign_status_email
from system_validator.utils import validate_pdf
import re
from django.http import HttpResponseRedirect
import logging
import requests
import time
from decimal import Decimal
from django.conf import settings

logger = logging.getLogger(__name__)

def validate_amount(amount):
    """Validate that the amount is a positive number."""
    try:
        amount = float(amount)
        if amount <= 0:
            raise ValueError
        return Decimal(str(amount)).quantize(Decimal('0.01')), None
    except (ValueError, TypeError):
        return None, "Amount must be a positive number greater than 0."

def get_paypal_access_token():
    """Obtain PayPal access token."""
    url = "https://api-m.sandbox.paypal.com/v1/oauth2/token"
    headers = {
        "Accept": "application/json",
        "Accept-Language": "en_US"
    }
    data = {
        "grant_type": "client_credentials"
    }
    auth = (settings.PAYPAL_CLIENT_ID, settings.PAYPAL_CLIENT_SECRET)
    try:
        response = requests.post(url, headers=headers, data=data, auth=auth)
        response.raise_for_status()
        return response.json().get('access_token')
    except requests.RequestException as e:
        logger.error(f"PayPal token request failed: {str(e)}")
        return None

def initiate_paypal_payment(amount, campaign_id, user_email):
    """Initiate a PayPal payment."""
    amount_val, amount_error = validate_amount(amount)
    if amount_error:
        logger.error(f"PayPal validation error: {amount_error}")
        return {'success': False, 'message': amount_error}

    if not settings.DEBUG and not settings.SITE_URL.startswith('https://'):
        logger.error(f"Invalid SITE_URL: {settings.SITE_URL}. Must use HTTPS.")
        return {'success': False, 'message': 'Server configuration error: SITE_URL must use HTTPS.'}

    access_token = get_paypal_access_token()
    if not access_token:
        logger.error("Failed to obtain PayPal access token")
        return {'success': False, 'message': 'Failed to authenticate with PayPal'}

    url = "https://api-m.sandbox.paypal.com/v2/checkout/orders"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}"
    }
    order_id = f"PAYPAL-{int(time.time())}-{campaign_id}"
    payload = {
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "amount": {
                    "currency_code": "USD",
                    "value": f"{amount_val:.2f}"
                },
                "description": f"Donation to Campaign {campaign_id}"
            }
        ],
        "payer": {
            "email_address": user_email
        },
        "application_context": {
            "return_url": f"{settings.SITE_URL}/api/campaigns/paypal/callback/?campaign_id={campaign_id}",
            "cancel_url": f"{settings.SITE_URL}/api/campaigns/paypal/callback/?cancel=true",
            "brand_name": "Crowdfunding Platform",
            "landing_page": "LOGIN",
            "user_action": "PAY_NOW"
        }
    }
    try:
        logger.debug(f"Sending PayPal request with payload: {payload}")
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        logger.debug(f"PayPal API response: {data}")
        if data.get('status') == 'CREATED':
            checkout_url = next((link['href'] for link in data['links'] if link['rel'] == 'approve'), None)
            if checkout_url:
                return {
                    'success': True,
                    'checkout_url': checkout_url,
                    'transaction_id': order_id
                }
        logger.error(f"PayPal order creation failed: {data.get('details', 'Unknown error')}")
        return {'success': False, 'message': 'PayPal order creation failed'}
    except requests.RequestException as e:
        logger.error(f"PayPal payment initialization failed: {str(e)}")
        if e.response is not None:
            logger.error(f"PayPal error response: {e.response.text}")
        return {'success': False, 'message': f'Failed to connect to PayPal: {str(e)}'}

def verify_paypal_payment(order_id):
    """Verify and capture a PayPal payment."""
    access_token = get_paypal_access_token()
    if not access_token:
        logger.error("Failed to obtain PayPal access token for verification")
        return {'success': False, 'message': 'Failed to authenticate with PayPal'}

    url = f"https://api-m.sandbox.paypal.com/v2/checkout/orders/{order_id}/capture"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}"
    }
    try:
        response = requests.post(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        logger.debug(f"PayPal capture response: {data}")
        if data.get('status') == 'COMPLETED':
            amount = Decimal(data['purchase_units'][0]['payments']['captures'][0]['amount']['value'])
            return {'success': True, 'amount': amount, 'message': 'Payment captured successfully'}
        logger.error(f"PayPal capture failed: {data.get('details', 'Payment not completed')}")
        return {'success': False, 'message': 'Payment capture failed'}
    except requests.RequestException as e:
        logger.error(f"PayPal payment verification failed: {str(e)}")
        if e.response is not None:
            logger.error(f"PayPal error response: {e.response.text}")
        return {'success': False, 'message': f'Failed to verify payment: {str(e)}'}

def initiate_chapa_payment(amount, campaign_id, user_email, user_phone=None):
    """Initiate a Chapa payment."""
    amount_val, amount_error = validate_amount(amount)
    if amount_error:
        logger.error(f"Chapa validation error: {amount_error}")
        return {'success': False, 'message': amount_error}

    amount_str = f"{amount_val:.2f}"

    if not settings.DEBUG and not settings.SITE_URL.startswith('https://'):
        logger.error(f"Invalid SITE_URL: {settings.SITE_URL}. Must use HTTPS.")
        return {'success': False, 'message': 'Server configuration error: SITE_URL must use HTTPS.'}

    url = "https://api.chapa.co/v1/transaction/initialize"
    headers = {
        "Authorization": f"Bearer {settings.CHAPA_TEST_SECRET_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "amount": amount_str,
        "currency": "ETB",
        "email": user_email,
        "first_name": "Donor",
        "last_name": "User",
        "phone_number": user_phone or "",
        "tx_ref": f"CHAPA-{int(time.time())}-{campaign_id}",
        "callback_url": f"{settings.SITE_URL}/api/campaigns/chapa/callback/",
        "return_url": f"{settings.SITE_URL}/api/campaigns/chapa/callback/?campaign_id={campaign_id}"
    }
    try:
        logger.debug(f"Sending Chapa request with payload: {payload}")
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        logger.debug(f"Chapa API response: {data}")
        if data.get('status') == 'success' and data.get('data') and data['data'].get('checkout_url'):
            return {
                'success': True,
                'checkout_url': data['data']['checkout_url'],
                'transaction_id': data['data'].get('tx_ref', payload['tx_ref'])
            }
        logger.error(f"Chapa API returned failure: {data.get('message', 'Unknown error')}")
        return {'success': False, 'message': data.get('message', 'Payment initialization failed')}
    except requests.RequestException as e:
        logger.error(f"Chapa payment initialization failed: {str(e)}")
        if e.response is not None:
            logger.error(f"Chapa error response: {e.response.text}")
        return {'success': False, 'message': f'Failed to connect to Chapa: {str(e)}'}

def verify_chapa_payment(transaction_id):
    """Verify a Chapa payment."""
    url = f"https://api.chapa.co/v1/transaction/verify/{transaction_id}"
    headers = {
        "Authorization": f"Bearer {settings.CHAPA_TEST_SECRET_KEY}",
        "Content-Type": "application/json"
    }
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        logger.debug(f"Chapa verification response: {data}")
        if data.get('status') == 'success' and data['data'].get('status') == 'success':
            amount = Decimal(data['data'].get('amount', '0.00'))
            return {'success': True, 'amount': amount, 'message': 'Payment verified'}
        logger.error(f"Chapa verification failed: {data.get('message', 'Payment not successful')}")
        return {'success': False, 'message': data.get('message', 'Payment not successful')}
    except requests.RequestException as e:
        logger.error(f"Chapa payment verification failed: {str(e)}")
        return {'success': False, 'message': f'Failed to verify payment: {str(e)}'}

class CampaignCreateAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print("POST-FILES: ", request.FILES)
        print("POST-DATA: ", request.data)
        """Create a new campaign with validation for medical campaigns."""
        serializer = CampaignSerializer(data=request.data)
        if not serializer.is_valid():
            logger.error(f"Serializer errors: {serializer.errors}")
            return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        category = serializer.validated_data.get('category', '').upper()
        pdf_file = request.FILES.get('document')

        if category == 'MEDICAL':
            if not pdf_file:
                logger.warning("Medical campaign submitted without PDF")
                return Response({
                    "error": "PDF document required for Medical campaigns"
                }, status=status.HTTP_400_BAD_REQUEST)

            logger.debug(f"Validating PDF: {pdf_file.name}")
            validation_result = validate_pdf(pdf_file)

            if validation_result['result'] == 'ACCEPTED':
                logger.info("Medical campaign approved")
                serializer.save(created_by=request.user, status='APPROVED')
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                logger.warning(f"Medical campaign rejected: {validation_result['reason']}")
                serializer.save(created_by=request.user, status='REJECTED')
                return Response({
                    "data": serializer.data,
                    "validation_reason": validation_result['reason']
                }, status=status.HTTP_201_CREATED)

        logger.debug("Saving non-Medical campaign")
        serializer.save(created_by=request.user, status='PENDING')
        # send_campaign_status_email.delay(serializer.instance.id)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class CampaignListAPI(APIView):
    permission_classes = []

    def get(self, request):
        """List all approved campaigns."""
        campaigns = Campaign.objects.filter(status='APPROVED')
        serializer = CampaignListSerializer(campaigns, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CampaignDetailAPI(APIView):
    permission_classes = []

    def get(self, request, pk):
        """Get details of a specific campaign."""
        try:
            campaign = Campaign.objects.get(pk=pk)
            serializer = CampaignSerializer(campaign)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Campaign.DoesNotExist:
            logger.error(f"Campaign {pk} not found")
            return Response({"error": "Campaign not found"}, status=status.HTTP_404_NOT_FOUND)

class AdminCampaignReviewAPI(APIView):
    permission_classes = []

    def get(self, request):
        """List pending campaigns for admin review."""
        campaigns = Campaign.objects.all().order_by('-created_at')
        serializer = CampaignListSerializer(campaigns, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, campaign_id):
        """Update campaign status (APPROVED or REJECTED)."""
        try:
            campaign = Campaign.objects.get(id=campaign_id)
            new_status = request.data.get('status')
            if new_status in ['APPROVED', 'REJECTED']:
                campaign.status = new_status
                campaign.save()
                if campaign.category != 'MEDICAL':
                    send_campaign_status_email.delay(campaign.id)
                return Response({
                    "message": f"Campaign {new_status.lower()} successfully"
                }, status=status.HTTP_200_OK)
            return Response({
                "error": "Invalid status"
            }, status=status.HTTP_400_BAD_REQUEST)
        except Campaign.DoesNotExist:
            return Response({
                "error": "Campaign not found"
            }, status=status.HTTP_404_NOT_FOUND)
class CampaignUpdateAPI(generics.UpdateAPIView):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
    permission_classes = [IsAdminUser]

    def perform_update(self, serializer):
        """Update campaign and send email for non-medical campaigns."""
        instance = serializer.save()
        if instance.category != 'MEDICAL' and instance.status in ['APPROVED', 'REJECTED']:
            send_campaign_status_email.delay(instance.id)

class DonateAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Handle donations via Chapa or PayPal."""
        logger.debug(f"DonateAPI.post called with data: {request.data}")
        data = request.data
        campaign_id = data.get('campaign_id', '').strip()
        amount = data.get('amount', '').strip()
        payment_method = data.get('payment_method', 'chapa').strip().lower()
        donor_email = data.get('donor_email', request.user.email).strip()
        donor_phone = data.get('donor_phone', '').strip()

        if not campaign_id or not amount or not donor_email:
            logger.error("Missing required fields: campaign_id, amount, or donor_email")
            return Response({
                "error": "Please provide campaign ID, amount, and donor email."
            }, status=status.HTTP_400_BAD_REQUEST)

        if payment_method not in ['chapa', 'paypal']:
            logger.error(f"Invalid payment method: {payment_method}")
            return Response({
                "error": "Invalid payment method. Use 'chapa' or 'paypal'."
            }, status=status.HTTP_400_BAD_REQUEST)

        amount_val, amount_error = validate_amount(amount)
        if amount_error:
            logger.error(f"Invalid amount: {amount_error}")
            return Response({
                "error": amount_error
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            campaign = Campaign.objects.get(id=int(campaign_id))
        except (Campaign.DoesNotExist, ValueError):
            logger.error(f"Campaign {campaign_id} not found")
            return Response({
                "error": "Campaign not found"
            }, status=status.HTTP_404_NOT_FOUND)

        if payment_method == 'chapa':
            result = initiate_chapa_payment(amount_val, campaign_id, donor_email, donor_phone)
        else:  # paypal
            result = initiate_paypal_payment(amount_val, campaign_id, donor_email)

        logger.debug(f"Payment initiation result: {result}")
        if result['success']:
            transaction = Transaction.objects.create(
                campaign=campaign,
                amount=amount_val,
                payment_method=payment_method,
                transaction_id=result['transaction_id'],
                donor_email=donor_email,
                donor_phone=donor_phone if payment_method == 'chapa' else ''
            )
            logger.debug(f"Created {payment_method} transaction: {transaction.transaction_id} for campaign {campaign_id}")
            return Response({
                "message": f"{payment_method.capitalize()} payment initiated successfully",
                "checkout_url": result['checkout_url'],
                "transaction_id": result['transaction_id']
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                "error": result['message']
            }, status=status.HTTP_400_BAD_REQUEST)

class ChapaCallbackAPI(APIView):
    permission_classes = []

    def post(self, request):
        """Handle Chapa payment callback (POST from Chapa)."""
        logger.debug(f"ChapaCallbackAPI.post called with data: {request.data}")
        transaction_id = request.data.get('tx_ref')
        if not transaction_id:
            logger.error("No transaction ID provided in Chapa callback")
            return Response({
                "error": "Missing transaction ID"
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            transaction = Transaction.objects.get(transaction_id=transaction_id)
        except Transaction.DoesNotExist:
            logger.error(f"Transaction {transaction_id} not found")
            return Response({
                "error": "Transaction not found"
            }, status=status.HTTP_404_NOT_FOUND)

        if transaction.completed:
            logger.debug(f"Transaction {transaction_id} already completed")
            return Response({
                "message": "Payment already processed"
            }, status=status.HTTP_200_OK)

        result = verify_chapa_payment(transaction_id)
        if result['success']:
            transaction.completed = True
            transaction.campaign.total_birr += result['amount']
            transaction.campaign.save()
            transaction.save()
            logger.info(f"Chapa payment {transaction_id} completed, updated campaign {transaction.campaign.id} balance: {transaction.campaign.total_birr} ETB")
            return  HttpResponseRedirect(redirect_to='/')
        else:
            logger.error(f"Chapa verification failed: {result['message']}")
            return Response({
                "error": f"Payment verification failed: {result['message']}"
            }, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
    
        logger.debug(f"Chapa callback GET request data: {request.GET}")
        transaction_id = request.GET.get('tx_ref')
        if not transaction_id:
            campaign_id = request.GET.get('campaign_id')
            if campaign_id:
                try:
                    recent_transaction = Transaction.objects.filter(
                        campaign_id=campaign_id,
                        payment_method='chapa',
                        completed=False
                    ).order_by('-created_at').first()
                    if recent_transaction:
                        transaction_id = recent_transaction.transaction_id
                        logger.debug(f"Fallback: Found recent Chapa transaction {transaction_id} for campaign {campaign_id}")
                except Exception as e:
                    logger.error(f"Error finding recent transaction: {str(e)}")

        if not transaction_id:
            logger.error("No transaction ID provided in Chapa callback GET")
            return Response({
                "error": "Missing transaction ID"
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            transaction = Transaction.objects.get(transaction_id=transaction_id)
        except Transaction.DoesNotExist:
            logger.error(f"Transaction {transaction_id} not found")
            return Response({
                "error": "Transaction not found"
            }, status=status.HTTP_404_NOT_FOUND)

        if transaction.completed:
            logger.debug(f"Transaction {transaction_id} already completed")
            return HttpResponseRedirect(redirect_to='/')  # Redirect to homepage if already completed

        result = verify_chapa_payment(transaction_id)
        if result['success']:
            transaction.completed = True
            transaction.campaign.total_birr += result['amount']
            transaction.campaign.save()
            transaction.save()
            logger.info(f"Chapa payment {transaction_id} completed, updated campaign {transaction.campaign.id} balance: {transaction.campaign.total_birr} ETB")
            logger.info(f"Chapa payment {transaction_id} completed, updated campaign {transaction.campaign.id} balance: {transaction.campaign.total_birr} ETB")
            return HttpResponseRedirect(redirect_to='http://localhost:5173/')
        else:
            logger.error(f"Chapa verification failed in GET: {result['message']}")
            return Response({
                "error": f"Payment verification failed: {result['message']}"
            }, status=status.HTTP_400_BAD_REQUEST)
class PayPalCallbackAPI(APIView):
    permission_classes = []

    def post(self, request):
        """Handle PayPal payment callback (POST from PayPal)."""
        logger.debug(f"PayPalCallbackAPI.post called with data: {request.data}")
        transaction_id = request.data.get('transaction_id')
        if not transaction_id:
            logger.error("No transaction ID provided in PayPal callback")
            return Response({
                "error": "Missing transaction ID"
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            transaction = Transaction.objects.get(transaction_id=transaction_id)
        except Transaction.DoesNotExist:
            logger.error(f"Transaction {transaction_id} not found")
            return Response({
                "error": "Transaction not found"
            }, status=status.HTTP_404_NOT_FOUND)

        if transaction.completed:
            logger.debug(f"Transaction {transaction_id} already completed")
            return Response({
                "message": "Payment already processed"
            }, status=status.HTTP_200_OK)

        result = verify_paypal_payment(transaction_id)
        if result['success']:
            transaction.completed = True
            transaction.campaign.total_usd += result['amount']
            transaction.campaign.save()
            transaction.save()
            logger.info(f"PayPal payment {transaction_id} completed, updated campaign {transaction.campaign.id} balance: {transaction.campaign.total_usd} USD")
            return Response({
                "message": f"Successful donation of {result['amount']} USD via PayPal"
            }, status=status.HTTP_200_OK)
        else:
            logger.error(f"PayPal verification failed: {result['message']}")
            return Response({
                "error": f"Payment verification failed: {result['message']}"
            }, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        """Handle redirect back from PayPal (GET after user approval or cancellation)."""
        logger.debug(f"PayPalCallbackAPI.get called with query params: {request.GET}")
        transaction_id = request.GET.get('token') or request.GET.get('paymentId')
        cancel = request.GET.get('cancel', 'false').lower() == 'true'
        payer_id = request.GET.get('PayerID')

        if cancel:
            logger.info("PayPal payment cancelled by user")
            return Response({"success": "Payment cancelled"}, status=status.HTTP_200_OK)

        if not transaction_id:
            campaign_id = request.GET.get('campaign_id')
            if campaign_id:
                try:
                    recent_transaction = Transaction.objects.filter(
                        campaign_id=campaign_id,
                        payment_method='paypal',
                        completed=False
                    ).order_by('-created_at').first()
                    if recent_transaction:
                        transaction_id = recent_transaction.transaction_id
                        logger.debug(f"Fallback: Found recent PayPal transaction {transaction_id} for campaign {campaign_id}")
                except Exception as e:
                    logger.error(f"Error finding recent transaction: {str(e)}")

        if not transaction_id:
            logger.error("No transaction ID provided in PayPal callback GET")
            return Response({"error": "Missing transaction ID"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            transaction = Transaction.objects.get(transaction_id=transaction_id)
        except Transaction.DoesNotExist:
            logger.error(f"Transaction {transaction_id} not found")
            return Response({"error": "Transaction not found"}, status=status.HTTP_404_NOT_FOUND)

        if transaction.completed:
            logger.debug(f"Transaction {transaction_id} already completed")
            return Response({"success": "Payment already processed"}, status=status.HTTP_200_OK)

        result = verify_paypal_payment(transaction_id)
        if result['success']:
            transaction.completed = True
            transaction.campaign.total_usd += result['amount']
            transaction.campaign.save()
            transaction.save()
            logger.info(f"PayPal payment {transaction_id} completed, updated campaign {transaction.campaign.id} balance: {transaction.campaign.total_usd} USD")
            return Response({
                "message": f"Successful donation of {result['amount']} USD via PayPal"
            }, status=status.HTTP_200_OK)
        else:
            logger.error(f"PayPal verification failed in GET: {result['message']}")
            return Response({
                "error": f"Payment verification failed: {result['message']}"
            }, status=status.HTTP_400_BAD_REQUEST)

class WithdrawAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get_exchange_rate(self, from_currency, to_currency):
        """Fetch exchange rate with retries."""
        api_key = getattr(settings, 'EXCHANGE_RATE_API_KEY', None)
        try:
            rate = get_exchange_rate(from_currency, to_currency, api_key=api_key)
            logger.debug(f"Exchange rate {from_currency} to {to_currency}: {rate}")
            return rate
        except NameError as e:
            logger.error(f"Exchange rate function not found: {str(e)}")
            return 0

    def post(self, request):
        """Handle withdrawal requests via Chapa or PayPal."""
        logger.debug(f"WithdrawAPI.post called with data: {request.data}")
        data = request.data
        campaign_id = data.get('campaign_id', '').strip()
        recipient_phone = data.get('recipient_phone', '').strip()
        recipient_email = data.get('recipient_email', '').strip()
        amount = data.get('amount', '').strip()
        convert_to = data.get('convert_to', 'birr').strip().lower()
        payment_method = data.get('payment_method', 'chapa').strip().lower()

        # Validate required fields
        if not campaign_id or not amount:
            logger.error("Missing required fields: campaign_id or amount")
            return Response({
                "error": "Please provide campaign ID and amount."
            }, status=status.HTTP_400_BAD_REQUEST)

        if payment_method == 'chapa' and not recipient_phone:
            logger.error("Missing recipient_phone for Chapa withdrawal")
            return Response({
                "error": "Recipient phone is required for Chapa withdrawals."
            }, status=status.HTTP_400_BAD_REQUEST)

        if payment_method == 'paypal' and not recipient_email:
            logger.error("Missing recipient_email for PayPal withdrawal")
            return Response({
                "error": "Recipient email is required for PayPal withdrawals."
            }, status=status.HTTP_400_BAD_REQUEST)

        # Validate email format for PayPal
        if payment_method == 'paypal':
            email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if not re.match(email_regex, recipient_email):
                logger.error(f"Invalid PayPal recipient email: {recipient_email}")
                return Response({
                    "error": "Invalid PayPal recipient email format."
                }, status=status.HTTP_400_BAD_REQUEST)

        # Validate payment method and currency compatibility
        if payment_method == 'paypal' and convert_to != 'usd':
            logger.error("PayPal withdrawals must be in USD")
            return Response({
                "error": "PayPal withdrawals must be in USD."
            }, status=status.HTTP_400_BAD_REQUEST)
        if payment_method == 'chapa' and convert_to != 'birr':
            logger.error("Chapa withdrawals must be in ETB")
            return Response({
                "error": "Chapa withdrawals must be in ETB."
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            campaign = Campaign.objects.get(id=int(campaign_id))
            if campaign.created_by != request.user:
                logger.error(f"User {request.user} is not the creator of campaign {campaign_id}")
                return Response({
                    "error": "You can only withdraw from campaigns you created."
                }, status=status.HTTP_403_FORBIDDEN)
        except (Campaign.DoesNotExist, ValueError):
            logger.error(f"Campaign {campaign_id} not found or invalid ID")
            return Response({
                "error": "Campaign not found or invalid ID"
            }, status=status.HTTP_404_NOT_FOUND)

        amount_val, amount_error = validate_amount(amount)
        if amount_error:
            logger.error(f"Invalid amount: {amount_error}")
            return Response({
                "error": amount_error
            }, status=status.HTTP_400_BAD_REQUEST)

        # Calculate total available balance
        rate = self.get_exchange_rate('USD', 'ETB')
        if rate == 0:
            rate = 132.1
            logger.info(f"Using fallback exchange rate USD to ETB: {rate}")

        if convert_to == 'birr':
            amount_in_birr = amount_val
        else:
            amount_in_birr = amount_val * Decimal(str(rate))

        total_available = campaign.total_birr + (campaign.total_usd * Decimal(str(rate)))
        if total_available < amount_in_birr:
            logger.error(f"Insufficient funds: requested {amount_in_birr} ETB, available {total_available} ETB")
            return Response({
                "error": f"Not enough funds! Requested {amount_in_birr:.2f} ETB, but only {total_available:.2f} ETB available."
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            withdrawal = WithdrawalRequest.objects.create(
                campaign=campaign,
                requested_amount=amount_val,
                payment_method=payment_method,
                recipient_phone=recipient_phone if payment_method == 'chapa' else None,
                recipient_email=recipient_email if payment_method == 'paypal' else None,
                convert_to=convert_to,
                status='pending'
            )
            logger.debug(f"Withdrawal request created: ID {withdrawal.id}, {amount_val} {convert_to.upper()}, method: {payment_method}")
            return Response({
                "message": f"Withdrawal request (ID: {withdrawal.id}) created successfully and is pending admin approval.",
                "withdrawal_id": withdrawal.id
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Failed to create withdrawal request: {str(e)}")
            return Response({
                "error": f"Failed to create withdrawal request: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)