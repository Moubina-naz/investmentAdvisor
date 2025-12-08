"""
Django Admin configuration for WealthWiz models.
"""
from django.contrib import admin
from .models import (
    Profile, FinancialProfile, RiskProfile,
    Goal, ReadinessSnapshot, AIInteractionLog, NotificationPreference
)


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'full_name', 'city', 'country', 'created_at']
    search_fields = ['user__email', 'full_name', 'city']
    list_filter = ['country', 'created_at']


@admin.register(FinancialProfile)
class FinancialProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'monthly_income', 'monthly_expenses', 'current_savings', 'has_debt', 'currency']
    search_fields = ['user__email']
    list_filter = ['currency', 'has_debt']


@admin.register(RiskProfile)
class RiskProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'risk_level', 'investment_horizon_years', 'created_at']
    search_fields = ['user__email']
    list_filter = ['risk_level']


@admin.register(Goal)
class GoalAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'target_amount', 'current_amount', 'priority', 'is_completed']
    search_fields = ['name', 'user__email']
    list_filter = ['priority', 'is_completed']


@admin.register(ReadinessSnapshot)
class ReadinessSnapshotAdmin(admin.ModelAdmin):
    list_display = ['user', 'score', 'status', 'market_risk_level', 'created_at']
    search_fields = ['user__email']
    list_filter = ['status', 'market_risk_level', 'created_at']


@admin.register(AIInteractionLog)
class AIInteractionLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'interaction_type', 'provider', 'latency_ms', 'created_at']
    search_fields = ['user__email', 'prompt']
    list_filter = ['interaction_type', 'provider', 'created_at']


@admin.register(NotificationPreference)
class NotificationPreferenceAdmin(admin.ModelAdmin):
    list_display = ['user', 'email_enabled', 'whatsapp_enabled', 'daily_summary_enabled']
    search_fields = ['user__email']
    list_filter = ['email_enabled', 'whatsapp_enabled']
