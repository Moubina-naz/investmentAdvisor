"""
Advice Engine - Generates AI-powered financial advice and insights.
"""
from typing import Dict, Optional, List
from .llm_client import get_llm_client
from .market_data import MarketDataService


class AdviceEngine:
    """
    Generates personalized financial advice using AI.
    """
    
    # Prompt templates
    PROMPTS = {
        'market_explanation': """
Explain today's Indian stock market movement in simple language for a beginner investor.
Keep it under 120 words. Avoid jargon. Use simple Hindi-English mix if appropriate.
Mention 2-3 key drivers.

Market Data:
- NIFTY 50 Change: {index_change}%
- Top Gaining Sector: {top_sector} ({top_sector_change}%)
- Top Losing Sector: {bottom_sector} ({bottom_sector_change}%)
- Market Mood: {mood}

Respond in a friendly, educational tone.
""",
        
        'personalized_advice': """
Based on this investor's readiness and market conditions, provide simple investment guidance.
Keep it practical and beginner-friendly.

Investor Profile:
- Readiness Score: {score}/100 ({status})
- Risk Profile: {risk_level}
- Emergency Fund: {ef_months} months coverage
- Market Risk: {market_risk}

Provide specific guidance for:
1. SIPs (Systematic Investment Plans)
2. Lump-sum investments
3. Long-term investors
4. Short-term traders

Keep each point to 1 short sentence. Be direct and actionable.
""",
        
        'sector_insight': """
Summarize why these sectors moved today in beginner-friendly language.
Keep it under 100 words total.

Sector Performance:
{sector_data}

Use simple explanations a first-time investor would understand.
""",
        
        'education': """
Explain "{topic}" in 4-5 bullet points for a complete beginner investor in India.
Avoid technical jargon. Use simple examples where helpful.
Keep the total response under 100 words.
""",
        
        'pattern_insight': """
Describe a market pattern or insight for today based on this data:
- Overall Market Trend: {trend}
- Volatility Level: {volatility}
- Top Mover: {top_mover} ({top_mover_change}%)

Keep it educational and under 80 words. Explain what it means for a beginner investor.
""",
    }
    
    def __init__(self):
        self.llm = get_llm_client()
        self.market_service = MarketDataService()
    
    def get_market_explanation(self) -> Dict:
        """Generate AI explanation of today's market."""
        summary = self.market_service.get_market_summary()
        sectors = summary.get('sectors', [])
        
        top_sector = sectors[0] if sectors else {'name': 'N/A', 'change_percent': 0}
        bottom_sector = sectors[-1] if sectors else {'name': 'N/A', 'change_percent': 0}
        
        prompt = self.PROMPTS['market_explanation'].format(
            index_change=summary['index'].get('change_percent', 0),
            top_sector=top_sector['name'],
            top_sector_change=top_sector['change_percent'],
            bottom_sector=bottom_sector['name'],
            bottom_sector_change=bottom_sector['change_percent'],
            mood=summary.get('mood', 'Neutral')
        )
        
        response = self.llm.generate(prompt)
        
        # Determine headline based on mood
        mood = summary.get('mood', 'Neutral')
        if 'Positive' in mood or 'Bullish' in mood:
            tone = 'POSITIVE'
        elif 'Negative' in mood or 'Bearish' in mood:
            tone = 'NEGATIVE'
        else:
            tone = 'NEUTRAL'
        
        return {
            'headline': f"Market Mood Today: {mood}",
            'summary': response.get('text', 'Unable to generate market summary.'),
            'tone': tone,
            'index_change': summary['index'].get('change_percent', 0),
            'provider': response.get('provider', 'unknown'),
        }
    
    def get_personalized_advice(
        self,
        readiness_data: Dict,
        risk_profile,
        market_risk: str = 'MEDIUM'
    ) -> Dict:
        """Generate personalized daily advice based on user's profile."""
        
        prompt = self.PROMPTS['personalized_advice'].format(
            score=readiness_data.get('score', 50),
            status=readiness_data.get('status', 'GETTING_THERE'),
            risk_level=risk_profile.risk_level if risk_profile else 'MODERATE',
            ef_months=round(readiness_data.get('breakdown', {}).get('emergency_fund', {}).get('months_coverage', 0), 1),
            market_risk=market_risk
        )
        
        response = self.llm.generate(prompt)
        text = response.get('text', '')
        
        # Parse the response into structured advice
        advice = self._parse_advice_response(text)
        advice['provider'] = response.get('provider', 'unknown')
        advice['raw_response'] = text
        
        return advice
    
    def _parse_advice_response(self, text: str) -> Dict:
        """Parse LLM response into structured advice."""
        # Default structure
        advice = {
            'sips': 'Continue your SIPs as planned.',
            'lumpsum': 'Consider market conditions before large investments.',
            'long_term': 'Stay focused on your long-term goals.',
            'traders': 'Exercise caution in current market conditions.',
        }
        
        # Try to extract advice from response
        lines = text.lower().split('\n')
        for line in lines:
            if 'sip' in line:
                advice['sips'] = self._clean_advice_line(line)
            elif 'lump' in line:
                advice['lumpsum'] = self._clean_advice_line(line)
            elif 'long-term' in line or 'long term' in line:
                advice['long_term'] = self._clean_advice_line(line)
            elif 'trader' in line or 'short-term' in line or 'short term' in line:
                advice['traders'] = self._clean_advice_line(line)
        
        return advice
    
    def _clean_advice_line(self, line: str) -> str:
        """Clean and format advice line."""
        # Remove common prefixes
        prefixes = ['1.', '2.', '3.', '4.', '-', '•', '*', 'sips:', 'lump-sum:', 'long-term:', 'traders:']
        result = line.strip()
        for prefix in prefixes:
            if result.lower().startswith(prefix):
                result = result[len(prefix):].strip()
        return result.capitalize() if result else line.strip().capitalize()
    
    def get_sector_insights(self) -> Dict:
        """Generate AI insights for sector performance."""
        sectors = self.market_service.get_sector_performance()
        
        sector_data = '\n'.join([
            f"- {s['name']}: {s['change_percent']:+.1f}%"
            for s in sectors[:5]
        ])
        
        prompt = self.PROMPTS['sector_insight'].format(sector_data=sector_data)
        response = self.llm.generate(prompt)
        
        return {
            'sectors': sectors,
            'insight': response.get('text', 'Unable to generate sector insights.'),
            'provider': response.get('provider', 'unknown'),
        }
    
    def get_education_card(self, topic: str = 'volatility') -> Dict:
        """Generate educational content for a topic."""
        prompt = self.PROMPTS['education'].format(topic=topic)
        response = self.llm.generate(prompt)
        
        return {
            'topic': topic.title(),
            'content': response.get('text', f'Unable to explain {topic}.'),
            'provider': response.get('provider', 'unknown'),
        }
    
    def get_pattern_insight(self) -> Dict:
        """Generate today's market pattern insight."""
        summary = self.market_service.get_market_summary()
        movers = summary.get('movers', {})
        gainers = movers.get('gainers', [])
        
        top_mover = gainers[0] if gainers else {'name': 'N/A', 'change_percent': 0}
        
        index_change = abs(summary['index'].get('change_percent', 0))
        if index_change > 1.5:
            volatility = 'High'
        elif index_change > 0.5:
            volatility = 'Moderate'
        else:
            volatility = 'Low'
        
        trend = 'Upward' if summary['index'].get('change_percent', 0) > 0 else 'Downward'
        
        prompt = self.PROMPTS['pattern_insight'].format(
            trend=trend,
            volatility=volatility,
            top_mover=top_mover.get('name', 'N/A'),
            top_mover_change=top_mover.get('change_percent', 0)
        )
        
        response = self.llm.generate(prompt)
        
        return {
            'title': "Today's Pattern Insight",
            'content': response.get('text', 'Unable to generate pattern insight.'),
            'volatility': volatility,
            'trend': trend,
            'provider': response.get('provider', 'unknown'),
        }
    
    def get_beginner_explanation(self, context: str) -> Dict:
        """Generate beginner-friendly explanation for any context."""
        prompt = f"""
Explain this for a beginner investor in India in simple terms (under 60 words):
"{context}"
"""
        response = self.llm.generate(prompt)
        
        return {
            'context': context,
            'explanation': response.get('text', 'Unable to generate explanation.'),
            'provider': response.get('provider', 'unknown'),
        }
