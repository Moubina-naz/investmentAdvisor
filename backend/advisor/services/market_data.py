"""
Market Data Service - Abstraction for market data providers.
Supports Alpha Vantage with fallback to mock data.
"""
import requests
import random
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from django.conf import settings


class MarketDataProvider:
    """Base class for market data providers."""
    
    def get_index_data(self, symbol: str) -> Dict:
        raise NotImplementedError
    
    def get_stock_quote(self, symbol: str) -> Dict:
        raise NotImplementedError
    
    def get_sector_performance(self) -> List[Dict]:
        raise NotImplementedError


class AlphaVantageProvider(MarketDataProvider):
    """Alpha Vantage API provider for real market data."""
    
    BASE_URL = "https://www.alphavantage.co/query"
    
    def __init__(self, api_key: str):
        self.api_key = api_key
    
    def get_stock_quote(self, symbol: str) -> Dict:
        """Get real-time quote for a stock."""
        try:
            params = {
                'function': 'GLOBAL_QUOTE',
                'symbol': symbol,
                'apikey': self.api_key
            }
            response = requests.get(self.BASE_URL, params=params, timeout=10)
            data = response.json()
            
            if 'Global Quote' in data and data['Global Quote']:
                quote = data['Global Quote']
                return {
                    'symbol': symbol,
                    'price': float(quote.get('05. price', 0)),
                    'change': float(quote.get('09. change', 0)),
                    'change_percent': float(quote.get('10. change percent', '0%').replace('%', '')),
                    'previous_close': float(quote.get('08. previous close', 0)),
                    'volume': int(quote.get('06. volume', 0)),
                    'timestamp': datetime.now().isoformat(),
                    'source': 'alpha_vantage'
                }
            return None
        except Exception as e:
            print(f"Alpha Vantage error for {symbol}: {e}")
            return None
    
    def get_index_data(self, symbol: str) -> Dict:
        """Get index data (uses same endpoint as stock quote)."""
        return self.get_stock_quote(symbol)
    
    def get_sector_performance(self) -> List[Dict]:
        """Get sector performance data."""
        try:
            params = {
                'function': 'SECTOR',
                'apikey': self.api_key
            }
            response = requests.get(self.BASE_URL, params=params, timeout=10)
            data = response.json()
            
            if 'Rank A: Real-Time Performance' in data:
                performance = data['Rank A: Real-Time Performance']
                sectors = []
                for sector_name, change_str in performance.items():
                    sectors.append({
                        'name': sector_name,
                        'change_percent': float(change_str.replace('%', '')),
                        'source': 'alpha_vantage'
                    })
                return sectors
            return []
        except Exception as e:
            print(f"Alpha Vantage sector error: {e}")
            return []


class MockMarketDataProvider(MarketDataProvider):
    """Mock provider for demo/testing with realistic Indian market data."""
    
    # Indian market stocks and sectors
    INDIAN_STOCKS = {
        'INFY.NS': {'name': 'Infosys', 'sector': 'IT Services', 'base_price': 1650},
        'HDFCBANK.NS': {'name': 'HDFC Bank', 'sector': 'Banking', 'base_price': 1580},
        'ITC.NS': {'name': 'ITC', 'sector': 'FMCG', 'base_price': 450},
        'TCS.NS': {'name': 'TCS', 'sector': 'IT Services', 'base_price': 3800},
        'RELIANCE.NS': {'name': 'Reliance', 'sector': 'Energy', 'base_price': 2500},
        'ICICIBANK.NS': {'name': 'ICICI Bank', 'sector': 'Banking', 'base_price': 1050},
        'HINDUNILVR.NS': {'name': 'Hindustan Unilever', 'sector': 'FMCG', 'base_price': 2350},
        'WIPRO.NS': {'name': 'Wipro', 'sector': 'IT Services', 'base_price': 480},
        'SBIN.NS': {'name': 'SBI', 'sector': 'Banking', 'base_price': 620},
        'BHARTIARTL.NS': {'name': 'Bharti Airtel', 'sector': 'Telecom', 'base_price': 1200},
    }
    
    INDIAN_SECTORS = {
        'IT Services': {'base_change': 1.2, 'volatility': 1.5},
        'Banking': {'base_change': 0.8, 'volatility': 1.2},
        'FMCG': {'base_change': -0.2, 'volatility': 0.8},
        'Energy': {'base_change': 0.5, 'volatility': 1.8},
        'Telecom': {'base_change': 0.3, 'volatility': 1.0},
        'Pharma': {'base_change': 0.6, 'volatility': 1.3},
        'Auto': {'base_change': 0.4, 'volatility': 1.4},
        'Metal': {'base_change': -0.5, 'volatility': 2.0},
    }
    
    REASONS = {
        'positive': [
            'Strong quarterly earnings',
            'Positive management outlook',
            'Profit beat expectations',
            'New contract wins',
            'Sector tailwinds',
            'Favorable regulatory news',
            'Analyst upgrades',
        ],
        'negative': [
            'Sector pressure',
            'Rising input costs',
            'Margin concerns',
            'Global headwinds',
            'Profit booking',
            'Currency fluctuation impact',
            'Below-estimate results',
        ],
        'neutral': [
            'Range-bound trading',
            'Consolidation phase',
            'Mixed signals',
            'Awaiting key results',
        ]
    }
    
    def __init__(self):
        # Generate consistent daily seed based on date
        self.daily_seed = int(datetime.now().strftime('%Y%m%d'))
        random.seed(self.daily_seed)
        self._generate_daily_data()
    
    def _generate_daily_data(self):
        """Generate mock data that stays consistent for the day."""
        self.stock_changes = {}
        for symbol, info in self.INDIAN_STOCKS.items():
            sector = info['sector']
            sector_base = self.INDIAN_SECTORS.get(sector, {}).get('base_change', 0)
            volatility = self.INDIAN_SECTORS.get(sector, {}).get('volatility', 1)
            
            # Stock change = sector base + random individual component
            change = sector_base + random.uniform(-volatility, volatility)
            self.stock_changes[symbol] = round(change, 2)
        
        self.sector_changes = {}
        for sector, info in self.INDIAN_SECTORS.items():
            change = info['base_change'] + random.uniform(-0.5, 0.5)
            self.sector_changes[sector] = round(change, 2)
        
        # Reset seed for other operations
        random.seed()
    
    def get_stock_quote(self, symbol: str) -> Dict:
        """Get mock stock quote."""
        random.seed(self.daily_seed)
        
        if symbol not in self.INDIAN_STOCKS:
            # Generic mock for unknown symbols
            change = round(random.uniform(-3, 3), 2)
            return {
                'symbol': symbol,
                'price': round(random.uniform(100, 5000), 2),
                'change': change,
                'change_percent': change,
                'previous_close': round(random.uniform(100, 5000), 2),
                'volume': random.randint(100000, 10000000),
                'timestamp': datetime.now().isoformat(),
                'source': 'mock'
            }
        
        info = self.INDIAN_STOCKS[symbol]
        change_percent = self.stock_changes.get(symbol, 0)
        base_price = info['base_price']
        change = round(base_price * change_percent / 100, 2)
        current_price = round(base_price + change, 2)
        
        # Determine reason based on change
        if change_percent > 0.5:
            reason = random.choice(self.REASONS['positive'])
        elif change_percent < -0.5:
            reason = random.choice(self.REASONS['negative'])
        else:
            reason = random.choice(self.REASONS['neutral'])
        
        random.seed()
        
        return {
            'symbol': symbol,
            'name': info['name'],
            'sector': info['sector'],
            'price': current_price,
            'change': change,
            'change_percent': change_percent,
            'previous_close': base_price,
            'volume': random.randint(1000000, 50000000),
            'timestamp': datetime.now().isoformat(),
            'reason': reason,
            'source': 'mock'
        }
    
    def get_index_data(self, symbol: str = 'NIFTY50') -> Dict:
        """Get mock index data."""
        random.seed(self.daily_seed)
        
        # NIFTY 50 mock
        base_value = 22500
        change_percent = round(sum(self.sector_changes.values()) / len(self.sector_changes), 2)
        change = round(base_value * change_percent / 100, 2)
        
        random.seed()
        
        return {
            'symbol': symbol,
            'name': 'NIFTY 50',
            'value': round(base_value + change, 2),
            'change': change,
            'change_percent': change_percent,
            'previous_close': base_value,
            'timestamp': datetime.now().isoformat(),
            'source': 'mock'
        }
    
    def get_sector_performance(self) -> List[Dict]:
        """Get mock sector performance."""
        sectors = []
        
        weather_map = {
            'high_positive': ('Sunny', 'Strong momentum'),
            'positive': ('Partly Cloudy', 'Positive outlook'),
            'neutral': ('Cloudy', 'Stable conditions'),
            'negative': ('Light Rain', 'Under pressure'),
            'high_negative': ('Stormy', 'Significant headwinds'),
        }
        
        for sector, change in self.sector_changes.items():
            if change > 1:
                weather = weather_map['high_positive']
            elif change > 0.3:
                weather = weather_map['positive']
            elif change > -0.3:
                weather = weather_map['neutral']
            elif change > -1:
                weather = weather_map['negative']
            else:
                weather = weather_map['high_negative']
            
            sectors.append({
                'name': sector,
                'change_percent': change,
                'weather': weather[0],
                'outlook': weather[1],
                'source': 'mock'
            })
        
        return sorted(sectors, key=lambda x: x['change_percent'], reverse=True)
    
    def get_top_movers(self, count: int = 5) -> Dict[str, List[Dict]]:
        """Get top gainers and losers."""
        stocks = []
        for symbol in self.INDIAN_STOCKS:
            quote = self.get_stock_quote(symbol)
            stocks.append(quote)
        
        sorted_stocks = sorted(stocks, key=lambda x: x['change_percent'], reverse=True)
        
        return {
            'gainers': sorted_stocks[:count],
            'losers': sorted_stocks[-count:][::-1]
        }


class MarketDataService:
    """
    Main service class for market data.
    Uses real data or mock based on settings.
    """
    
    def __init__(self):
        self.use_real_data = getattr(settings, 'USE_REAL_MARKET_DATA', False)
        self.api_key = getattr(settings, 'ALPHA_VANTAGE_API_KEY', 'demo')
        
        if self.use_real_data:
            self.provider = AlphaVantageProvider(self.api_key)
            self.fallback_provider = MockMarketDataProvider()
        else:
            self.provider = MockMarketDataProvider()
            self.fallback_provider = None
    
    def get_stock_quote(self, symbol: str) -> Dict:
        """Get stock quote with fallback."""
        result = self.provider.get_stock_quote(symbol)
        
        if result is None and self.fallback_provider:
            result = self.fallback_provider.get_stock_quote(symbol)
            if result:
                result['fallback'] = True
        
        return result or {'error': f'Unable to fetch data for {symbol}'}
    
    def get_index_data(self, symbol: str = 'NIFTY50') -> Dict:
        """Get index data with fallback."""
        result = self.provider.get_index_data(symbol)
        
        if result is None and self.fallback_provider:
            result = self.fallback_provider.get_index_data(symbol)
            if result:
                result['fallback'] = True
        
        return result or {'error': f'Unable to fetch index data for {symbol}'}
    
    def get_sector_performance(self) -> List[Dict]:
        """Get sector performance data."""
        result = self.provider.get_sector_performance()
        
        if not result and self.fallback_provider:
            result = self.fallback_provider.get_sector_performance()
        
        return result
    
    def get_top_movers(self, count: int = 5) -> Dict[str, List[Dict]]:
        """Get top gainers and losers."""
        if isinstance(self.provider, MockMarketDataProvider):
            return self.provider.get_top_movers(count)
        
        # For real provider, manually compute from stock list
        if self.fallback_provider:
            return self.fallback_provider.get_top_movers(count)
        
        return {'gainers': [], 'losers': []}
    
    def get_market_summary(self) -> Dict:
        """Get comprehensive market summary."""
        index = self.get_index_data()
        sectors = self.get_sector_performance()
        movers = self.get_top_movers(3)
        
        # Determine market mood based on index change
        change = index.get('change_percent', 0)
        if change > 1:
            mood = 'Bullish & Positive'
            mood_emoji = 'sunny'
        elif change > 0.3:
            mood = 'Calm & Slightly Positive'
            mood_emoji = 'partly_sunny'
        elif change > -0.3:
            mood = 'Stable & Neutral'
            mood_emoji = 'cloudy'
        elif change > -1:
            mood = 'Cautious & Slightly Negative'
            mood_emoji = 'rain'
        else:
            mood = 'Bearish & Negative'
            mood_emoji = 'storm'
        
        return {
            'index': index,
            'sectors': sectors,
            'movers': movers,
            'mood': mood,
            'mood_emoji': mood_emoji,
            'timestamp': datetime.now().isoformat()
        }
    
    def get_market_risk_level(self) -> Dict:
        """Calculate overall market risk level."""
        index = self.get_index_data()
        change = abs(index.get('change_percent', 0))
        
        if change > 2:
            risk_level = 'HIGH'
            reason = 'High market volatility detected'
        elif change > 1:
            risk_level = 'MEDIUM'
            reason = 'Moderate market movement'
        else:
            risk_level = 'LOW'
            reason = 'Stable market conditions'
        
        return {
            'risk_level': risk_level,
            'reason': reason,
            'index_change': index.get('change_percent', 0),
            'timestamp': datetime.now().isoformat()
        }
