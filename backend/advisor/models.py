"""
Database models for WealthWiz advisor app.
"""
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class Profile(models.Model):
    """Extended user profile information."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=255, blank=True)
    age = models.PositiveIntegerField(null=True, blank=True)
    city = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, default='India')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile: {self.user.username}"


class FinancialProfile(models.Model):
    """User's financial information for readiness calculation."""
    CURRENCY_CHOICES = [
        ('INR', 'Indian Rupee'),
        ('USD', 'US Dollar'),
        ('EUR', 'Euro'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='financial_profile')
    monthly_income = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    monthly_expenses = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    current_savings = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    emergency_fund = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    has_debt = models.BooleanField(default=False)
    debt_amount = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='INR')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Financial Profile: {self.user.username}"

    @property
    def monthly_surplus(self):
        """Calculate monthly surplus (income - expenses)."""
        return self.monthly_income - self.monthly_expenses

    @property
    def savings_rate(self):
        """Calculate savings rate as percentage."""
        if self.monthly_income > 0:
            return (self.monthly_surplus / self.monthly_income) * 100
        return 0

    @property
    def emergency_fund_months(self):
        """Calculate how many months of expenses the emergency fund covers."""
        if self.monthly_expenses > 0:
            return float(self.emergency_fund / self.monthly_expenses)
        return 0

    @property
    def debt_to_income_ratio(self):
        """Calculate debt-to-income ratio."""
        if self.monthly_income > 0 and self.debt_amount:
            return float(self.debt_amount / (self.monthly_income * 12)) * 100
        return 0


class RiskProfile(models.Model):
    """User's risk tolerance assessment."""
    RISK_LEVELS = [
        ('CONSERVATIVE', 'Conservative'),
        ('MODERATE', 'Moderate'),
        ('AGGRESSIVE', 'Aggressive'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='risk_profile')
    risk_level = models.CharField(max_length=20, choices=RISK_LEVELS, default='MODERATE')
    answers = models.JSONField(default=dict, blank=True)
    investment_horizon_years = models.PositiveIntegerField(default=5)
    can_tolerate_30_percent_drop = models.BooleanField(default=False)
    prefers_stable_returns = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Risk Profile: {self.user.username} - {self.risk_level}"


class Goal(models.Model):
    """User's financial goals."""
    PRIORITY_CHOICES = [(i, str(i)) for i in range(1, 6)]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='goals')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    target_amount = models.DecimalField(max_digits=14, decimal_places=2)
    current_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    target_years = models.PositiveIntegerField(default=5)
    priority = models.PositiveIntegerField(choices=PRIORITY_CHOICES, default=3)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['priority', '-created_at']

    def __str__(self):
        return f"Goal: {self.name} - {self.user.username}"

    @property
    def progress_percentage(self):
        """Calculate progress towards goal."""
        if self.target_amount > 0:
            return min(100, (float(self.current_amount) / float(self.target_amount)) * 100)
        return 0


class ReadinessSnapshot(models.Model):
    """Historical snapshots of user's readiness score."""
    STATUS_CHOICES = [
        ('NOT_READY', 'Not Ready'),
        ('GETTING_THERE', 'Getting There'),
        ('ALMOST_READY', 'Almost Ready'),
        ('READY', 'Ready'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='readiness_snapshots')
    score = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    notes = models.TextField(blank=True)
    market_risk_level = models.CharField(max_length=20, default='MEDIUM')
    breakdown = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Readiness: {self.user.username} - {self.score}/100"


class AIInteractionLog(models.Model):
    """Log of AI interactions for debugging and analytics."""
    INTERACTION_TYPES = [
        ('MARKET_EXPLANATION', 'Market Explanation'),
        ('DAILY_ADVICE', 'Daily Advice'),
        ('SECTOR_INSIGHT', 'Sector Insight'),
        ('EDUCATION', 'Education'),
        ('CHAT', 'Chat'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_logs', null=True, blank=True)
    interaction_type = models.CharField(max_length=30, choices=INTERACTION_TYPES)
    prompt = models.TextField()
    response = models.TextField()
    provider = models.CharField(max_length=20)  # 'gemini' or 'openai'
    tokens_used = models.IntegerField(null=True, blank=True)
    latency_ms = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"AI Log: {self.interaction_type} - {self.created_at}"


class NotificationPreference(models.Model):
    """User notification preferences (for future use)."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='notification_prefs')
    email_enabled = models.BooleanField(default=True)
    whatsapp_enabled = models.BooleanField(default=False)
    daily_summary_enabled = models.BooleanField(default=True)
    readiness_change_alert = models.BooleanField(default=True)
    market_alert_threshold = models.FloatField(default=2.0)  # Alert if market moves > X%
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Notifications: {self.user.username}"
