"""
Readiness Engine - Calculates user's investment readiness score.
Uses rule-based scoring with configurable weights.
"""
from typing import Dict, Optional, Tuple
from decimal import Decimal
from django.conf import settings


class ReadinessEngine:
    """
    Calculates the Investment Readiness Pulse Score (0-100).
    
    Score Components:
    - Emergency Fund Coverage: 40%
    - Savings Rate: 20%
    - Debt-to-Income Ratio: 20%
    - Market Risk Adjustment: 10%
    - Risk Profile Alignment: 10%
    """
    
    # Default weights (can be overridden in settings)
    DEFAULT_WEIGHTS = {
        'emergency_fund': 0.40,
        'savings_rate': 0.20,
        'debt_to_income': 0.20,
        'market_risk': 0.10,
        'risk_alignment': 0.10,
    }
    
    # Thresholds for scoring
    EMERGENCY_FUND_IDEAL_MONTHS = 6
    SAVINGS_RATE_IDEAL = 30  # 30% ideal savings rate
    DEBT_TO_INCOME_SAFE = 30  # Below 30% is safe
    
    def __init__(self, weights: Optional[Dict] = None):
        self.weights = weights or getattr(settings, 'READINESS_WEIGHTS', self.DEFAULT_WEIGHTS)
    
    def calculate_score(
        self,
        financial_profile,
        risk_profile,
        market_risk_level: str = 'MEDIUM'
    ) -> Dict:
        """
        Calculate comprehensive readiness score.
        
        Returns:
            Dict with score, status, breakdown, and suggestions.
        """
        breakdown = {}
        suggestions = []
        
        # 1. Emergency Fund Score (40%)
        ef_score, ef_suggestion = self._calculate_emergency_fund_score(financial_profile)
        breakdown['emergency_fund'] = {
            'score': ef_score,
            'weight': self.weights['emergency_fund'],
            'weighted_score': ef_score * self.weights['emergency_fund'],
            'months_coverage': financial_profile.emergency_fund_months
        }
        if ef_suggestion:
            suggestions.append(ef_suggestion)
        
        # 2. Savings Rate Score (20%)
        sr_score, sr_suggestion = self._calculate_savings_rate_score(financial_profile)
        breakdown['savings_rate'] = {
            'score': sr_score,
            'weight': self.weights['savings_rate'],
            'weighted_score': sr_score * self.weights['savings_rate'],
            'rate': financial_profile.savings_rate
        }
        if sr_suggestion:
            suggestions.append(sr_suggestion)
        
        # 3. Debt-to-Income Score (20%)
        di_score, di_suggestion = self._calculate_debt_score(financial_profile)
        breakdown['debt_to_income'] = {
            'score': di_score,
            'weight': self.weights['debt_to_income'],
            'weighted_score': di_score * self.weights['debt_to_income'],
            'ratio': financial_profile.debt_to_income_ratio
        }
        if di_suggestion:
            suggestions.append(di_suggestion)
        
        # 4. Market Risk Adjustment (10%)
        mr_score, mr_suggestion = self._calculate_market_risk_score(market_risk_level)
        breakdown['market_risk'] = {
            'score': mr_score,
            'weight': self.weights['market_risk'],
            'weighted_score': mr_score * self.weights['market_risk'],
            'level': market_risk_level
        }
        if mr_suggestion:
            suggestions.append(mr_suggestion)
        
        # 5. Risk Profile Alignment (10%)
        ra_score, ra_suggestion = self._calculate_risk_alignment_score(
            financial_profile, risk_profile
        )
        breakdown['risk_alignment'] = {
            'score': ra_score,
            'weight': self.weights['risk_alignment'],
            'weighted_score': ra_score * self.weights['risk_alignment'],
            'risk_level': risk_profile.risk_level if risk_profile else 'MODERATE'
        }
        if ra_suggestion:
            suggestions.append(ra_suggestion)
        
        # Calculate total score
        total_score = sum(comp['weighted_score'] for comp in breakdown.values())
        total_score = round(min(100, max(0, total_score)))
        
        # Determine status
        status = self._get_status(total_score)
        status_message = self._get_status_message(total_score, status)
        
        return {
            'score': total_score,
            'status': status,
            'status_message': status_message,
            'breakdown': breakdown,
            'suggestions': suggestions[:3],  # Top 3 suggestions
            'ready_to_invest': total_score >= 60
        }
    
    def _calculate_emergency_fund_score(self, financial_profile) -> Tuple[float, Optional[str]]:
        """Score based on emergency fund coverage (0-100)."""
        months = financial_profile.emergency_fund_months
        
        if months >= self.EMERGENCY_FUND_IDEAL_MONTHS:
            return 100, None
        elif months >= 3:
            score = 60 + (months - 3) * 13.33  # 60-100 for 3-6 months
            return round(score), "Build your emergency fund to 6 months of expenses."
        elif months >= 1:
            score = 30 + (months - 1) * 15  # 30-60 for 1-3 months
            return round(score), "Focus on building at least 3 months of emergency savings."
        else:
            score = months * 30  # 0-30 for 0-1 month
            suggestion = "Start building an emergency fund - aim for 1 month of expenses first."
            return round(score), suggestion
    
    def _calculate_savings_rate_score(self, financial_profile) -> Tuple[float, Optional[str]]:
        """Score based on savings rate (0-100)."""
        rate = financial_profile.savings_rate
        
        if rate >= self.SAVINGS_RATE_IDEAL:
            return 100, None
        elif rate >= 20:
            score = 70 + (rate - 20) * 3  # 70-100 for 20-30%
            return round(score), None
        elif rate >= 10:
            score = 40 + (rate - 10) * 3  # 40-70 for 10-20%
            return round(score), "Try to increase your savings rate to at least 20%."
        elif rate > 0:
            score = rate * 4  # 0-40 for 0-10%
            return round(score), "Focus on reducing expenses to save more each month."
        else:
            return 0, "Your expenses exceed income. Create a budget to start saving."
    
    def _calculate_debt_score(self, financial_profile) -> Tuple[float, Optional[str]]:
        """Score based on debt-to-income ratio (0-100)."""
        if not financial_profile.has_debt or not financial_profile.debt_amount:
            return 100, None
        
        ratio = financial_profile.debt_to_income_ratio
        
        if ratio <= 10:
            return 100, None
        elif ratio <= self.DEBT_TO_INCOME_SAFE:
            score = 100 - (ratio - 10) * 2.5  # 100-50 for 10-30%
            return round(score), None
        elif ratio <= 50:
            score = 50 - (ratio - 30) * 2  # 50-10 for 30-50%
            return round(score), "Consider prioritizing debt repayment before heavy investing."
        else:
            return max(0, 10 - (ratio - 50) * 0.2), "High debt ratio. Focus on debt reduction first."
    
    def _calculate_market_risk_score(self, risk_level: str) -> Tuple[float, Optional[str]]:
        """Score based on current market risk level (0-100)."""
        risk_scores = {
            'LOW': (100, None),
            'MEDIUM': (70, "Market conditions are moderate. Consider SIP over lump-sum."),
            'HIGH': (30, "High market volatility. Avoid large lump-sum investments."),
        }
        return risk_scores.get(risk_level, (70, None))
    
    def _calculate_risk_alignment_score(
        self,
        financial_profile,
        risk_profile
    ) -> Tuple[float, Optional[str]]:
        """Score based on risk profile alignment with financial situation."""
        if not risk_profile:
            return 50, "Complete your risk assessment for personalized guidance."
        
        risk_level = risk_profile.risk_level
        ef_months = financial_profile.emergency_fund_months
        savings_rate = financial_profile.savings_rate
        
        # Conservative profile
        if risk_level == 'CONSERVATIVE':
            if ef_months >= 6 and savings_rate >= 15:
                return 100, None
            elif ef_months >= 3:
                return 80, None
            return 60, "Build more safety net before conservative investing."
        
        # Moderate profile
        elif risk_level == 'MODERATE':
            if ef_months >= 3 and savings_rate >= 10:
                return 100, None
            elif ef_months >= 1:
                return 70, "Strengthen your emergency fund for moderate risk investing."
            return 50, "Build emergency savings before moderate risk investing."
        
        # Aggressive profile
        else:  # AGGRESSIVE
            if ef_months >= 6 and savings_rate >= 20:
                return 100, None
            elif ef_months >= 3 and savings_rate >= 15:
                return 80, "Aggressive investing needs stronger financial foundation."
            elif ef_months >= 1:
                return 50, "Build more safety cushion for aggressive investing."
            return 30, "High-risk investing requires solid financial foundation first."
    
    def _get_status(self, score: int) -> str:
        """Get status label from score."""
        if score >= 80:
            return 'READY'
        elif score >= 60:
            return 'ALMOST_READY'
        elif score >= 40:
            return 'GETTING_THERE'
        return 'NOT_READY'
    
    def _get_status_message(self, score: int, status: str) -> str:
        """Get human-friendly status message."""
        messages = {
            'READY': "You're in great shape! Your financial foundation is solid.",
            'ALMOST_READY': "You're building solid ground. A little more consistency will boost your confidence.",
            'GETTING_THERE': "You're on the right path. Focus on building your savings and reducing debt.",
            'NOT_READY': "Let's work on strengthening your financial foundation first.",
        }
        return messages.get(status, "Keep building your financial foundation.")
