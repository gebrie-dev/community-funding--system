from django.contrib import admin, messages
from django.utils import timezone
from django.conf import settings
from decimal import Decimal
import logging
import requests
from .models import Campaign, Transaction, WithdrawalRequest

logger = logging.getLogger(__name__)

@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'category', 'status', 'goal_display', 'total_birr', 'total_usd', 'balance_in_birr_display', 'percentage_funded', 'created_by', 'starting_date', 'ending_date', 'created_at')
    list_filter = ('category', 'status', 'starting_date', 'ending_date', 'created_by', 'created_at')
    search_fields = ('title', 'description', 'location', 'created_by__email')
    ordering = ('-created_at',)
    readonly_fields = ('total_usd', 'total_birr', 'created_at', 'updated_at')
    date_hierarchy = 'created_at'
    fieldsets = (
        (None, {
            'fields': ('title', 'category', 'description', 'goal', 'status')
        }),
        ('Details', {
            'fields': ('total_usd', 'total_birr', 'starting_date', 'ending_date', 'location', 'created_by')
        }),
        ('Media', {
            'fields': ('image', 'document')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('created_by')

    def goal_display(self, obj):
        return f"{obj.goal:.2f} Birr"
    goal_display.short_description = 'Goal'

    def percentage_funded(self, obj):
        return f"{obj.get_percentage_funded():.2f}%"
    percentage_funded.short_description = 'Percentage Funded'

    def balance_in_birr_display(self, obj):
        return f"{obj.get_balance_in_birr():.2f} Birr"
    balance_in_birr_display.short_description = 'Balance in Birr'

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'transaction_id', 'campaign', 'amount', 'payment_method', 'donor_email', 'donor_phone', 'completed', 'created_at')
    list_filter = ('payment_method', 'completed', 'created_at', 'campaign')
    search_fields = ('transaction_id', 'donor_email', 'donor_phone', 'campaign__title')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)
    fieldsets = (
        (None, {
            'fields': ('campaign', 'amount', 'payment_method', 'transaction_id', 'completed')
        }),
        ('Donor Info', {
            'fields': ('donor_email', 'donor_phone')
        }),
        ('Timestamp', {
            'fields': ('created_at',)
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('campaign')




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

def initiate_paypal_payout(amount, recipient_email, withdrawal_id):
    """Initiate a PayPal payout for withdrawal."""
    amount_val = amount.quantize(Decimal('0.01'))
    access_token = get_paypal_access_token()
    if not access_token:
        logger.error("Failed to obtain PayPal access token for payout")
        return {'success': False, 'message': 'Failed to authenticate with PayPal'}

    url = "https://api-m.sandbox.paypal.com/v1/payments/payouts"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}"
    }
    payload = {
        "sender_batch_header": {
            "sender_batch_id": f"PAYOUT-{withdrawal_id}-{int(timezone.now().timestamp())}",
            "email_subject": "Crowdfunding Withdrawal"
        },
        "items": [
            {
                "recipient_type": "EMAIL",
                "amount": {
                    "value": f"{amount_val:.2f}",
                    "currency": "USD"
                },
                "receiver": recipient_email,
                "note": f"Withdrawal {withdrawal_id} from Crowdfunding Platform",
                "sender_item_id": f"WITHDRAW-{withdrawal_id}"
            }
        ]
    }
    try:
        logger.debug(f"Sending PayPal payout request: {payload}")
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        logger.debug(f"PayPal payout response: {data}")
        if data.get('batch_header', {}).get('batch_status') in ['PENDING', 'PROCESSING', 'SUCCESS']:
            return {
                'success': True,
                'message': f"PayPal payout of {amount_val} USD to {recipient_email} initiated",
                'payout_batch_id': data['batch_header']['payout_batch_id']
            }
        logger.error(f"PayPal payout failed: {data}")
        return {'success': False, 'message': 'PayPal payout failed'}
    except requests.RequestException as e:
        logger.error(f"PayPal payout failed: {str(e)}")
        if e.response is not None:
            logger.error(f"PayPal error response: {e.response.text}")
        return {'success': False, 'message': f'Failed to process PayPal payout: {str(e)}'}

def initiate_chapa_transfer(amount, recipient_phone, withdrawal_id):
    """Initiate a Chapa transfer for withdrawal."""
    amount_val = amount.quantize(Decimal('0.01'))
    url = "https://api.chapa.co/v1/transfers"
    headers = {
        "Authorization": f"Bearer {settings.CHAPA_TEST_SECRET_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "amount": f"{amount_val:.2f}",
        "currency": "ETB",
        "phone_number": recipient_phone,
        "tx_ref": f"TRANSFER-{withdrawal_id}-{int(timezone.now().timestamp())}",
        "description": f"Withdrawal {withdrawal_id} from Crowdfunding Platform"
    }
    try:
        logger.debug(f"Sending Chapa transfer request: {payload}")
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        logger.debug(f"Chapa transfer response: {data}")
        if data.get('status') == 'success':
            return {
                'success': True,
                'message': f"Chapa transfer of {amount_val} ETB to {recipient_phone} initiated",
                'transfer_id': data['data'].get('tx_ref')
            }
        logger.error(f"Chapa transfer failed: {data.get('message', 'Unknown error')}")
        return {'success': False, 'message': data.get('message', 'Transfer failed')}
    except requests.RequestException as e:
        logger.error(f"Chapa transfer failed: {str(e)}")
        if e.response is not None:
            logger.error(f"Chapa error response: {e.response.text}")
        return {'success': False, 'message': f'Failed to process Chapa transfer: {str(e)}'}


@admin.register(WithdrawalRequest)
class WithdrawalRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'campaign', 'requested_amount', 'payment_method', 'recipient_email', 'recipient_phone', 'convert_to', 'status', 'created_at', 'processed_at')
    list_filter = ('payment_method', 'status', 'convert_to', 'created_at', 'campaign')
    search_fields = ('campaign__title', 'recipient_email', 'recipient_phone')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'processed_at')
    date_hierarchy = 'created_at'
    actions = ['approve_withdrawal', 'reject_withdrawal']
    fieldsets = (
        (None, {
            'fields': ('campaign', 'requested_amount', 'payment_method', 'convert_to', 'status')
        }),
        ('Recipient Info', {
            'fields': ('recipient_email', 'recipient_phone')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'processed_at')
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('campaign')

    def get_exchange_rate(self, from_currency, to_currency):
        from .utils.exchange_rate import get_exchange_rate
        api_key = getattr(settings, 'EXCHANGE_RATE_API_KEY', None)
        return get_exchange_rate(from_currency, to_currency, api_key=api_key)

    def approve_withdrawal(self, request, queryset):
        for withdrawal in queryset:
            if withdrawal.status != 'pending':
                self.message_user(request, f"Withdrawal {withdrawal.id} is already {withdrawal.status}.", level=messages.WARNING)
                continue
            campaign = withdrawal.campaign
            requested_amount = withdrawal.requested_amount
            convert_to = withdrawal.convert_to
            payment_method = withdrawal.payment_method

            # Get exchange rate
            rate = self.get_exchange_rate('USD', 'ETB' if convert_to == 'birr' else 'ETB')
            if rate == 0:
                rate = 132.1 if convert_to == 'birr' else 0.007571
                logger.info(f"Using fallback exchange rate {('USD', 'ETB') if convert_to == 'birr' else ('ETB', 'USD')}: {rate}")

            # Calculate total available balance in the requested currency
            if convert_to == 'birr':
                total_available = campaign.total_birr + (campaign.total_usd * Decimal(str(rate)))
            else:  # convert_to == 'usd'
                total_available = campaign.total_usd + (campaign.total_birr / Decimal(str(rate)))
            total_available = total_available.quantize(Decimal('0.01'))

            # Check if sufficient funds are available
            if requested_amount > total_available:
                self.message_user(request, f"Insufficient funds for withdrawal {withdrawal.id}! Requested {requested_amount} {convert_to.upper()}, available {total_available} {convert_to.upper()}.", level=messages.ERROR)
                continue

            # Deduct the requested amount
            deduct_usd = Decimal('0.00')
            deduct_birr = Decimal('0.00')
            if convert_to == 'usd':
                deduct_usd = min(requested_amount, campaign.total_usd)
                remaining_usd = requested_amount - deduct_usd
                if remaining_usd > 0:
                    deduct_birr = (remaining_usd * Decimal(str(rate))).quantize(Decimal('0.01'))
                    if deduct_birr > campaign.total_birr:
                        self.message_user(request, f"Insufficient Birr funds for withdrawal {withdrawal.id}!", level=messages.ERROR)
                        continue
            else:  # convert_to == 'birr'
                deduct_birr = min(requested_amount, campaign.total_birr)
                remaining_birr = requested_amount - deduct_birr
                if remaining_birr > 0:
                    deduct_usd = (remaining_birr / Decimal(str(rate))).quantize(Decimal('0.01'))
                    if deduct_usd > campaign.total_usd:
                        self.message_user(request, f"Insufficient USD funds for withdrawal {withdrawal.id}!", level=messages.ERROR)
                        continue

            # Update campaign balances
            campaign.total_usd -= deduct_usd
            campaign.total_birr -= deduct_birr
            campaign.save()

            # Process payment
            if payment_method == 'paypal' and convert_to == 'usd':
                if not withdrawal.recipient_email:
                    self.message_user(request, f"Withdrawal {withdrawal.id} failed: PayPal requires recipient email.", level=messages.ERROR)
                    continue
                result = initiate_paypal_payout(requested_amount, withdrawal.recipient_email, withdrawal.id)
            elif payment_method == 'chapa' and convert_to == 'birr':
                if not withdrawal.recipient_phone:
                    self.message_user(request, f"Withdrawal {withdrawal.id} failed: Chapa requires recipient phone.", level=messages.ERROR)
                    continue
                result = initiate_chapa_transfer(requested_amount, withdrawal.recipient_phone, withdrawal.id)
            else:
                self.message_user(request, f"Withdrawal {withdrawal.id} failed: Invalid payment method or currency.", level=messages.ERROR)
                continue

            # Update withdrawal status
            if result['success']:
                withdrawal.status = 'approved'
                withdrawal.processed_at = timezone.now()
                withdrawal.save()
                self.message_user(request, f"Withdrawal {withdrawal.id} approved: {result['message']}", messages.SUCCESS)
                logger.info(f"Withdrawal {withdrawal.id} approved: {result['message']}")
            else:
                self.message_user(request, f"Withdrawal {withdrawal.id} failed: {result['message']}", messages.ERROR)
                logger.error(f"Withdrawal {withdrawal.id} failed: {result['message']}")

    approve_withdrawal.short_description = "Approve selected withdrawals"

    def reject_withdrawal(self, request, queryset):
        for withdrawal in queryset:
            if withdrawal.status != 'pending':
                self.message_user(request, f"Withdrawal {withdrawal.id} is already {withdrawal.status}.", level=messages.WARNING)
                continue
            withdrawal.status = 'rejected'
            withdrawal.processed_at = timezone.now()
            withdrawal.save()
        self.message_user(request, "Selected withdrawals rejected.", messages.SUCCESS)

    reject_withdrawal.short_description = "Reject selected withdrawals"