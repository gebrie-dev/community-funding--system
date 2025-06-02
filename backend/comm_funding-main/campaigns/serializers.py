from rest_framework import serializers
from .models import Campaign
from account.models import CustomUser
from decimal import Decimal

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'email']

from rest_framework import serializers
from .models import Campaign

class CampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = [
            'id', 'title', 'description', 'goal', 'total_usd', 'total_birr',
            'starting_date', 'ending_date', 'category', 'location', 'image',
            'document', 'status', 'created_by', 'created_at'
        ]
        read_only_fields = ['id', 'total_usd', 'total_birr', 'status', 'created_by', 'created_at']
        extra_kwargs = {
            'document': {'required': False},
            'image': {'required': False},  # Frontend enforces requirement
        }

    def validate(self, data):
        if data['starting_date'] >= data['ending_date']:
            raise serializers.ValidationError("Ending date must be after starting date.")
        if data['goal'] <= 0:
            raise serializers.ValidationError("Goal amount must be greater than 0.")
        if data['category'] not in dict(Campaign.CATEGORY_CHOICES):
            raise serializers.ValidationError("Invalid category.")
        return data

class CampaignListSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    goal_amount = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=Decimal('0.01'), source='goal')
    total_usd = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_birr = serializers.DecimalField(max_digits=10, decimal_places=2)
    balance_in_birr = serializers.SerializerMethodField()
    percentage_funded = serializers.SerializerMethodField()

    class Meta:
        model = Campaign
        fields = [
            'id', 'title', 'category', 'description', 'goal_amount',
            'total_usd', 'total_birr', 'balance_in_birr', 'percentage_funded',
            'starting_date', 'ending_date', 'location', 'image', 'document',
            'status', 'created_at', 'created_by'
        ]

    def get_balance_in_birr(self, obj):
        return obj.get_balance_in_birr()

    def get_percentage_funded(self, obj):
        return obj.get_percentage_funded()