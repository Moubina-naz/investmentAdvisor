"""
API Views for WealthWiz advisor app.
"""
from rest_framework import status, generics, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User

from .models import (
    Profile, FinancialProfile, RiskProfile,
    Goal, ReadinessSnapshot
)
from .serializers import (
    RegisterSerializer, UserSerializer, ProfileSerializer,
    FinancialProfileSerializer, RiskProfileSerializer,
    GoalSerializer, ReadinessSnapshotSerializer, FullProfileSerializer,
    ReadinessResponseSerializer, MarketSummarySerializer,
    MarketExplanationSerializer, DailyAdviceSerializer
)
from .services import (
    MarketDataService, ReadinessEngine, AdviceEngine
)


# ============================================
# Auth Views
# ============================================

class RegisterView(generics.CreateAPIView):
    """User registration endpoint."""
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class MeView(APIView):
    """Get current user's full profile."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        profile = Profile.objects.filter(user=user).first()
        financial = FinancialProfile.objects.filter(user=user).first()
        risk = RiskProfile.objects.filter(user=user).first()
        goals = Goal.objects.filter(user=user)
        latest_readiness = ReadinessSnapshot.objects.filter(user=user).first()
        
        data = {
            'user': UserSerializer(user).data,
            'profile': ProfileSerializer(profile).data if profile else None,
            'financial': FinancialProfileSerializer(financial).data if financial else None,
            'risk': RiskProfileSerializer(risk).data if risk else None,
            'goals': GoalSerializer(goals, many=True).data,
            'latest_readiness': ReadinessSnapshotSerializer(latest_readiness).data if latest_readiness else None,
        }
        
        return Response(data)


# ============================================
# Profile Views
# ============================================

class ProfileView(APIView):
    """User profile management."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        return Response(ProfileSerializer(profile).data)
    
    def put(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class FinancialProfileView(APIView):
    """Financial profile management."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        profile, _ = FinancialProfile.objects.get_or_create(user=request.user)
        return Response(FinancialProfileSerializer(profile).data)
    
    def put(self, request):
        profile, _ = FinancialProfile.objects.get_or_create(user=request.user)
        serializer = FinancialProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class RiskProfileView(APIView):
    """Risk profile management."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        profile, _ = RiskProfile.objects.get_or_create(user=request.user)
        return Response(RiskProfileSerializer(profile).data)
    
    def put(self, request):
        profile, _ = RiskProfile.objects.get_or_create(user=request.user)
        serializer = RiskProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class GoalViewSet(viewsets.ModelViewSet):
    """CRUD for financial goals."""
    permission_classes = [IsAuthenticated]
    serializer_class = GoalSerializer
    
    def get_queryset(self):
        return Goal.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ============================================
# Readiness Views
# ============================================

class ReadinessView(APIView):
    """Calculate and return investment readiness score."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Get user profiles
        financial, _ = FinancialProfile.objects.get_or_create(user=user)
        risk, _ = RiskProfile.objects.get_or_create(user=user)
        
        # Get market risk
        market_service = MarketDataService()
        market_risk = market_service.get_market_risk_level()
        
        # Calculate readiness
        engine = ReadinessEngine()
        result = engine.calculate_score(
            financial_profile=financial,
            risk_profile=risk,
            market_risk_level=market_risk['risk_level']
        )
        
        # Save snapshot
        ReadinessSnapshot.objects.create(
            user=user,
            score=result['score'],
            status=result['status'],
            notes=result['status_message'],
            market_risk_level=market_risk['risk_level'],
            breakdown=result['breakdown']
        )
        
        return Response(result)


class ReadinessHistoryView(APIView):
    """Get readiness score history."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        snapshots = ReadinessSnapshot.objects.filter(user=request.user)[:30]
        return Response(ReadinessSnapshotSerializer(snapshots, many=True).data)


# ============================================
# Market Views
# ============================================

class MarketRawView(APIView):
    """Raw market data for debugging."""
    permission_classes = [AllowAny]
    
    def get(self, request):
        service = MarketDataService()
        symbol = request.query_params.get('symbol', 'NIFTY50')
        
        return Response({
            'index': service.get_index_data(symbol),
            'sectors': service.get_sector_performance(),
            'movers': service.get_top_movers(),
        })


class MarketSummaryView(APIView):
    """Market summary with mood analysis."""
    permission_classes = [AllowAny]
    
    def get(self, request):
        service = MarketDataService()
        summary = service.get_market_summary()
        return Response(summary)


class MarketExplainedView(APIView):
    """AI-generated market explanation."""
    permission_classes = [AllowAny]
    
    def get(self, request):
        engine = AdviceEngine()
        explanation = engine.get_market_explanation()
        return Response(explanation)


class MarketRiskView(APIView):
    """Current market risk level."""
    permission_classes = [AllowAny]
    
    def get(self, request):
        service = MarketDataService()
        return Response(service.get_market_risk_level())


class SectorsView(APIView):
    """Sector performance with insights."""
    permission_classes = [AllowAny]
    
    def get(self, request):
        engine = AdviceEngine()
        return Response(engine.get_sector_insights())


class MoversView(APIView):
    """Top stock movers with reasons."""
    permission_classes = [AllowAny]
    
    def get(self, request):
        service = MarketDataService()
        count = int(request.query_params.get('count', 5))
        return Response(service.get_top_movers(count))


# ============================================
# AI Advice Views
# ============================================

class DailyAdviceView(APIView):
    """Personalized daily investment advice."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Get user profiles
        financial, _ = FinancialProfile.objects.get_or_create(user=user)
        risk, _ = RiskProfile.objects.get_or_create(user=user)
        
        # Get market risk
        market_service = MarketDataService()
        market_risk = market_service.get_market_risk_level()
        
        # Calculate readiness
        readiness_engine = ReadinessEngine()
        readiness = readiness_engine.calculate_score(
            financial_profile=financial,
            risk_profile=risk,
            market_risk_level=market_risk['risk_level']
        )
        
        # Generate advice
        advice_engine = AdviceEngine()
        advice = advice_engine.get_personalized_advice(
            readiness_data=readiness,
            risk_profile=risk,
            market_risk=market_risk['risk_level']
        )
        
        return Response({
            'readiness_score': readiness['score'],
            'market_risk': market_risk['risk_level'],
            'advice': advice,
        })


class PatternInsightView(APIView):
    """Today's market pattern insight."""
    permission_classes = [AllowAny]
    
    def get(self, request):
        engine = AdviceEngine()
        return Response(engine.get_pattern_insight())


class EducationView(APIView):
    """Educational micro-content."""
    permission_classes = [AllowAny]
    
    def get(self, request):
        topic = request.query_params.get('topic', 'volatility')
        engine = AdviceEngine()
        return Response(engine.get_education_card(topic))


class BeginnerExplainView(APIView):
    """Explain anything for a beginner."""
    permission_classes = [AllowAny]
    
    def get(self, request):
        context = request.query_params.get('q', 'What does this mean for me?')
        engine = AdviceEngine()
        return Response(engine.get_beginner_explanation(context))


# ============================================
# Notification Preview (Future)
# ============================================

class NotificationPreviewView(APIView):
    """Preview what notifications would be sent."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Get current readiness
        latest = ReadinessSnapshot.objects.filter(user=user).first()
        
        notifications = []
        
        if latest:
            if latest.score < 40:
                notifications.append({
                    'type': 'readiness_alert',
                    'title': 'Readiness Score Low',
                    'message': f'Your readiness score is {latest.score}/100. Focus on building your emergency fund.',
                })
        
        # Market alert preview
        market_service = MarketDataService()
        risk = market_service.get_market_risk_level()
        
        if risk['risk_level'] == 'HIGH':
            notifications.append({
                'type': 'market_alert',
                'title': 'High Market Volatility',
                'message': 'Markets are volatile today. Consider avoiding large investments.',
            })
        
        return Response({
            'notifications': notifications,
            'note': 'These are preview notifications. Actual delivery not yet implemented.'
        })
