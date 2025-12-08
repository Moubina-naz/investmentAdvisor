"""
LLM Client - Abstraction for AI providers (Gemini/OpenAI).
Supports pluggable providers with fallback.
"""
import time
from abc import ABC, abstractmethod
from typing import Dict, Optional
from django.conf import settings


class LLMClient(ABC):
    """Abstract base class for LLM providers."""
    
    @abstractmethod
    def generate(self, prompt: str, max_tokens: int = 500) -> Dict:
        """Generate response from the LLM."""
        pass
    
    @abstractmethod
    def get_provider_name(self) -> str:
        """Get the provider name."""
        pass


class GeminiClient(LLMClient):
    """Google Gemini API client."""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.model = 'gemini-1.5-flash'
        self._client = None
    
    def _get_client(self):
        if self._client is None:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                self._client = genai.GenerativeModel(self.model)
            except ImportError:
                raise ImportError("google-generativeai package not installed")
        return self._client
    
    def generate(self, prompt: str, max_tokens: int = 500) -> Dict:
        """Generate response using Gemini."""
        start_time = time.time()
        
        try:
            client = self._get_client()
            response = client.generate_content(
                prompt,
                generation_config={
                    'max_output_tokens': max_tokens,
                    'temperature': 0.7,
                }
            )
            
            latency = int((time.time() - start_time) * 1000)
            
            return {
                'success': True,
                'text': response.text,
                'provider': 'gemini',
                'model': self.model,
                'latency_ms': latency,
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'provider': 'gemini',
            }
    
    def get_provider_name(self) -> str:
        return 'gemini'


class OpenAIClient(LLMClient):
    """OpenAI API client."""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.model = 'gpt-4o-mini'
        self._client = None
    
    def _get_client(self):
        if self._client is None:
            try:
                from openai import OpenAI
                self._client = OpenAI(api_key=self.api_key)
            except ImportError:
                raise ImportError("openai package not installed")
        return self._client
    
    def generate(self, prompt: str, max_tokens: int = 500) -> Dict:
        """Generate response using OpenAI."""
        start_time = time.time()
        
        try:
            client = self._get_client()
            response = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a helpful financial advisor for Indian investors."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=max_tokens,
                temperature=0.7,
            )
            
            latency = int((time.time() - start_time) * 1000)
            
            return {
                'success': True,
                'text': response.choices[0].message.content,
                'provider': 'openai',
                'model': self.model,
                'latency_ms': latency,
                'tokens_used': response.usage.total_tokens if response.usage else None,
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'provider': 'openai',
            }
    
    def get_provider_name(self) -> str:
        return 'openai'


class MockLLMClient(LLMClient):
    """Mock LLM client for testing without API keys."""
    
    def generate(self, prompt: str, max_tokens: int = 500) -> Dict:
        """Generate mock response based on prompt type."""
        
        # Detect prompt type and return appropriate mock response
        prompt_lower = prompt.lower()
        
        if 'market' in prompt_lower and ('explain' in prompt_lower or 'today' in prompt_lower):
            text = (
                "Aaj market mildly stable hai. IT stocks thoda upar gaye — earnings strong thi. "
                "Banking steady hai after RBI's rate pause. FMCG thoda down due to rising input costs. "
                "Overall, a calm day for investors."
            )
        elif 'advice' in prompt_lower or 'invest' in prompt_lower:
            text = (
                "Based on your profile, here's my guidance:\n"
                "• SIPs: Continue your SIPs as planned\n"
                "• Lump-sum: Avoid large lump-sum entries this week\n"
                "• Long-term investors: Stable climate, stick to your strategy\n"
                "• High-vol traders: Stay cautious in current conditions"
            )
        elif 'sector' in prompt_lower:
            text = (
                "IT Services: Strong quarterly earnings driving positive sentiment.\n"
                "Banking: Mixed results but stable after RBI policy update.\n"
                "FMCG: Raw material cost pressure causing headwinds."
            )
        elif 'volatility' in prompt_lower or 'education' in prompt_lower or 'explain' in prompt_lower:
            text = (
                "Understanding Volatility:\n"
                "• Volatility measures how much prices move up and down\n"
                "• High volatility = bigger swings, more risk\n"
                "• Low volatility = steadier prices, less risk\n"
                "• Long-term investors can often ignore short-term volatility\n"
                "• SIPs actually benefit from volatility through rupee cost averaging"
            )
        elif 'pattern' in prompt_lower or 'insight' in prompt_lower:
            text = (
                "Today's Pattern: Post-Earnings Drift\n"
                "Sometimes, a stock keeps rising slowly for days after good news. "
                "We'll show you when this happens and how to identify it."
            )
        else:
            text = (
                "I'm here to help you understand the market and make informed decisions. "
                "What would you like to know about investing?"
            )
        
        return {
            'success': True,
            'text': text,
            'provider': 'mock',
            'model': 'mock-v1',
            'latency_ms': 50,
        }
    
    def get_provider_name(self) -> str:
        return 'mock'


def get_llm_client() -> LLMClient:
    """Factory function to get the configured LLM client."""
    provider = getattr(settings, 'LLM_PROVIDER', 'gemini')
    
    if provider == 'gemini':
        api_key = getattr(settings, 'GEMINI_API_KEY', '')
        if api_key:
            return GeminiClient(api_key)
    elif provider == 'openai':
        api_key = getattr(settings, 'OPENAI_API_KEY', '')
        if api_key:
            return OpenAIClient(api_key)
    
    # Fallback to mock client
    return MockLLMClient()
