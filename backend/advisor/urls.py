"""
URL routes for WealthWiz advisor API.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    # Auth
    RegisterView, MeView,
    # Profile
    ProfileView, FinancialProfileView, RiskProfileView, GoalViewSet,
    # Readiness
    ReadinessView, ReadinessHistoryView,
    # Market
    MarketRawView, MarketSummaryView, MarketExplainedView,
    MarketRiskView, SectorsView, MoversView,
    # Advice
    DailyAdviceView, PatternInsightView, EducationView, BeginnerExplainView,
    # Notifications
    NotificationPreviewView,
)

# Router for ViewSets
router = DefaultRouter()
router.register(r'goals', GoalViewSet, basename='goals')

urlpatterns = [
    # ============================================
    # Auth endpoints
    # ============================================
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', MeView.as_view(), name='me'),
    
    # ============================================
    # Profile endpoints
    # ============================================
    path('profile/', ProfileView.as_view(), name='profile'),
    path('financial/', FinancialProfileView.as_view(), name='financial'),
    path('risk/', RiskProfileView.as_view(), name='risk'),
    
    # ============================================
    # Readiness endpoints
    # ============================================
    path('readiness/', ReadinessView.as_view(), name='readiness'),
    path('readiness/history/', ReadinessHistoryView.as_view(), name='readiness-history'),
    
    # ============================================
    # Market endpoints
    # ============================================
    path('market/raw/', MarketRawView.as_view(), name='market-raw'),
    path('market/summary/', MarketSummaryView.as_view(), name='market-summary'),
    path('market/explained/', MarketExplainedView.as_view(), name='market-explained'),
    path('market/risk/', MarketRiskView.as_view(), name='market-risk'),
    path('sectors/', SectorsView.as_view(), name='sectors'),
    path('movers/', MoversView.as_view(), name='movers'),
    
    # ============================================
    # AI Advice endpoints
    # ============================================
    path('advice/today/', DailyAdviceView.as_view(), name='advice-today'),
    path('insights/pattern/', PatternInsightView.as_view(), name='pattern-insight'),
    path('education/today/', EducationView.as_view(), name='education'),
    path('explain/', BeginnerExplainView.as_view(), name='explain'),
    
    # ============================================
    # Notifications
    # ============================================
    path('notifications/preview/', NotificationPreviewView.as_view(), name='notification-preview'),
    
    # Router URLs (goals CRUD)
    path('', include(router.urls)),
]
