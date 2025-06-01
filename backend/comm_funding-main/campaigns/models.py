from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, FileExtensionValidator
from django.utils import timezone
from django.conf import settings
from decimal import Decimal
from datetime import date
import logging
from .utils.exchange_rate import get_exchange_rate

logger = logging.getLogger(__name__)

class Campaign(models.Model):
    CATEGORY_CHOICES = (
        ('EDUCATION', 'Education'),
        ('SOCIAL_IMPACT', 'Social Impact'),
        ('EMERGENCY', 'Emergency'),
        ('MEDICAL', 'Medical'),
    )
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    )

    title = models.CharField(max_length=200)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='SOCIAL_IMPACT')
    description = models.TextField(blank=True)
    goal = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.01)], default=Decimal('0.00'))
    total_usd = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    total_birr = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    starting_date = models.DateField(null=True, blank=True)
    ending_date = models.DateField(null=True, blank=True)
    location = models.CharField(max_length=200, blank=True)
    image = models.ImageField(upload_to='images/', null=True, blank=True)
    document = models.FileField(
        upload_to='documents/',
        validators=[FileExtensionValidator(allowed_extensions=['pdf'])],
        null=True,
        blank=True
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.status}"

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.starting_date and self.starting_date < date.today():
            raise ValidationError("Starting date cannot be in the past.")
        if self.starting_date and self.ending_date and self.ending_date <= self.starting_date:
            raise ValidationError("Ending date must be after starting date.")

    def get_balance_in_birr(self):
        """Calculate the total balance in ETB (Birr) including USD conversion."""
        api_key = getattr(settings, 'EXCHANGE_RATE_API_KEY', None)
        rate = get_exchange_rate('USD', 'ETB', api_key=api_key)
        if rate == 0:
            rate = 132.1
            logger.warning(f"Using fallback exchange rate USD to ETB: {rate} in get_balance_in_birr")
        else:
            logger.debug(f"Using exchange rate USD to ETB: {rate} in get_balance_in_birr")
        balance = self.total_birr + (self.total_usd * Decimal(str(rate)))
        return balance.quantize(Decimal('0.01'))

    def get_percentage_funded(self):
        """Calculate the percentage of the goal funded based on balance in Birr."""
        if self.goal <= 0:
            return 0.0
        balance = self.get_balance_in_birr()
        percentage = (balance / self.goal) * 100
        logger.debug(f"Campaign {self.id}: balance_in_birr={balance}, goal={self.goal}, percentage={percentage}")
        return float(percentage.quantize(Decimal('0.01')))

class Transaction(models.Model):
    PAYMENT_METHOD_CHOICES = (
        ('paypal', 'PayPal'),
        ('chapa', 'Chapa'),
    )

    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.01)])
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    transaction_id = models.CharField(max_length=100, unique=True)
    donor_email = models.EmailField(blank=True, null=True)
    donor_phone = models.CharField(max_length=20, blank=True, null=True)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Transaction {self.transaction_id} for {self.campaign.title} - {self.amount}"

class WithdrawalRequest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    CURRENCY_CHOICES = (
        ('birr', 'ETB'),
        ('usd', 'USD'),
    )

    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='withdrawal_requests')
    requested_amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.01)])
    payment_method = models.CharField(max_length=20, choices=Transaction.PAYMENT_METHOD_CHOICES)
    recipient_email = models.EmailField(blank=True, null=True)
    recipient_phone = models.CharField(max_length=20, blank=True, null=True)
    convert_to = models.CharField(max_length=10, choices=CURRENCY_CHOICES, default='birr')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    processed_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"Withdrawal {self.id} for {self.campaign.title} - {self.requested_amount} {self.convert_to.upper()}"