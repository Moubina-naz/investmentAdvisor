"""
Serializers for WealthWiz API.
"""
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import (
    Profile, FinancialProfile, RiskProfile, 
    Goal, ReadinessSnapshot, NotificationPreference
)


class UserSerializer(serializers.ModelSerializer):
    """Basic user serializer."""
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class RegisterSerializer(serializers.ModelSerializer):
    """User registration serializer."""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    full_name = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ['email', 'password', 'password_confirm', 'full_name']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords don't match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        full_name = validated_data.pop('full_name', '')
        
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        
        # Create related profiles
        Profile.objects.create(user=user, full_name=full_name)
        FinancialProfile.objects.create(user=user)
        RiskProfile.objects.create(user=user)
        NotificationPreference.objects.create(user=user)
        
        return user


class ProfileSerializer(serializers.ModelSerializer):
    """User profile serializer."""
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = Profile
        fields = ['id', 'email', 'full_name', 'age', 'city', 'country', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class FinancialProfileSerializer(serializers.ModelSerializer):
    """Financial profile serializer with computed fields."""
    monthly_surplus = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    savings_rate = serializers.FloatField(read_only=True)
    emergency_fund_months = serializers.FloatField(read_only=True)
    debt_to_income_ratio = serializers.FloatField(read_only=True)
    
    class Meta:
        model = FinancialProfile
        fields = [
            'id', 'monthly_income', 'monthly_expenses', 'current_savings',
            'emergency_fund', 'has_debt', 'debt_amount', 'currency',
            'monthly_surplus', 'savings_rate', 'emergency_fund_months',
            'debt_to_income_ratio', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class RiskProfileSerializer(serializers.ModelSerializer):
    """Risk profile serializer."""
    
    class Meta:
        model = RiskProfile
        fields = [
            'id', 'risk_level', 'answers', 'investment_horizon_years',
            'can_tolerate_30_percent_drop', 'prefers_stable_returns',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class GoalSerializer(serializers.ModelSerializer):
    """Financial goal serializer."""
    progress_percentage = serializers.FloatField(read_only=True)
    
    class Meta:
        model = Goal
        fields = [
            'id', 'name', 'description', 'target_amount', 'current_amount',
            'target_years', 'priority', 'is_completed', 'progress_percentage',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ReadinessSnapshotSerializer(serializers.ModelSerializer):
    """Readiness snapshot serializer."""
    
    class Meta:
        model = ReadinessSnapshot
        fields = [
            'id', 'score', 'status', 'notes', 'market_risk_level',
            'breakdown', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class FullProfileSerializer(serializers.Serializer):
    """Combined serializer for full user profile."""
    user = UserSerializer()
    profile = ProfileSerializer()
    financial = FinancialProfileSerializer()
    risk = RiskProfileSerializer()
    goals = GoalSerializer(many=True)
    latest_readiness = ReadinessSnapshotSerializer(allow_null=True)


class ReadinessResponseSerializer(serializers.Serializer):
    """Serializer for readiness score response."""
    score = serializers.IntegerField()
    status = serializers.CharField()
    status_message = serializers.CharField()
    breakdown = serializers.DictField()
    suggestions = serializers.ListField(child=serializers.CharField())
    ready_to_invest = serializers.BooleanField()


class MarketSummarySerializer(serializers.Serializer):
    """Serializer for market summary response."""
    index = serializers.DictField()
    sectors = serializers.ListField()
    movers = serializers.DictField()
    mood = serializers.CharField()
    mood_emoji = serializers.CharField()
    timestamp = serializers.CharField()


class MarketExplanationSerializer(serializers.Serializer):
    """Serializer for AI market explanation."""
    headline = serializers.CharField()
    summary = serializers.CharField()
    tone = serializers.CharField()
    index_change = serializers.FloatField()
    provider = serializers.CharField()


class DailyAdviceSerializer(serializers.Serializer):
    """Serializer for daily personalized advice."""
    sips = serializers.CharField()
    lumpsum = serializers.CharField()
    long_term = serializers.CharField()
    traders = serializers.CharField()
    provider = serializers.CharField()
