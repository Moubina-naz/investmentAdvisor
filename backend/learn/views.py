from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

import requests
from typing import Tuple, Optional, Dict


# ---------- MOCK DATA (your old hard‑coded JSON) ----------

MOCK_LEARN_DATA = {
    "symbol": "INFY",
    "changePct": 1.7,
    "beginnerVerdict": (
        "Slightly safe today. IT is gaining due to global cues. "
        "Good for SIPs, avoid large lump‑sum."
    ),
    "futureScenario": (
        "If market falls 1% tomorrow: Stock likely to dip slightly. "
        "Safe for SIP, avoid trading decisions."
    ),
    "whyUpNow": (
        "Quarterly profits beat market expectations, driven by strong new "
        "deals in the US market. Positive results often increase investor "
        "confidence."
    ),
    "factors": {
        "earnings": "Profit reports show company health. Recent results were above expectations.",
        "sector": "Other IT companies are also stable to slightly positive, which supports the stock.",
        "global": "Trends in US & European markets are slightly positive for IT exports.",
        "investorActivity": "Buying interest has been stronger than selling over the last few sessions.",
    },
    "confidenceScore": 72,
    "buyingPressure": 68,
    "sellingPressure": 32,
    "ifHolding": (
        "Stay calm, trend is steady. No need to worry. Continue holding "
        "with your existing plan."
    ),
    "ifNew": (
        "Start small (SIP). Don’t invest big lump‑sum today; wait for better "
        "price or more confirmation."
    ),
    "sectorDescription": (
        "The IT sector is mainly affected by global demand for technology "
        "services and the USD‑INR exchange rate. Stronger global economies "
        "often mean more business for Indian IT firms."
    ),
    "trends": {
        "infosys": {
            "trend10": "Up",
            "trend30": "Slightly Up",
            "volatility": "Medium",
            "steadiness": "Fairly Steady",
        },
        "tcs": {
            "trend10": "Stable",
            "trend30": "Slightly Up",
            "volatility": "Low",
            "steadiness": "Very Steady",
        },
        "wipro": {
            "trend10": "Down",
            "trend30": "Slightly Down",
            "volatility": "Medium",
            "steadiness": "Some Ups & Downs",
        },
    },
    "popularReasons": [
        "Good brand and strong market trust.",
        "Consistent past growth over the years.",
        "Stable and experienced management team.",
    ],
    # helpful flag for debugging in frontend if you want
    "dataSource": "mock",
}


# ---------- HELPER: call Alpha Vantage & transform ----------

def fetch_alpha_vantage_daily(symbol: str) -> Tuple[Optional[Dict], Optional[str]]:
    """
    Fetch TIME_SERIES_DAILY_ADJUSTED data for the given symbol from Alpha Vantage.
    Returns (parsed_json, error_message).
    """
    api_key = getattr(settings, "ALPHA_VANTAGE_API_KEY", None)
    if not api_key or api_key == "demo":
        return None, "Missing or demo Alpha Vantage API key."

    url = "https://www.alphavantage.co/query"
    params = {
        "function": "TIME_SERIES_DAILY_ADJUSTED",
        "symbol": symbol,
        "outputsize": "compact",
        "apikey": api_key,
    }

    try:
        print(f"[Learn] Fetching live Alpha Vantage data for {symbol}...")
        resp = requests.get(url, params=params, timeout=10)
        resp.raise_for_status()
        data = resp.json()

        # Alpha Vantage sends error / info messages here:
        if "Error Message" in data or "Note" in data:
            return None, data.get("Error Message") or data.get("Note")

        if "Time Series (Daily)" not in data:
            return None, "Unexpected Alpha Vantage response format."

        return data, None
    except requests.RequestException as e:
        return None, f"Network error: {e}"


def build_live_learn_payload(symbol: str) -> Tuple[Optional[Dict], Optional[str]]:
    """
    Uses Alpha Vantage raw data and converts it into your LearnData shape.
    """
    raw, error = fetch_alpha_vantage_daily(symbol)
    if error or raw is None:
        return None, error

    ts = raw["Time Series (Daily)"]
    dates = sorted(ts.keys(), reverse=True)

    if len(dates) < 2:
        return None, "Not enough time series data."

    latest = dates[0]
    prev = dates[1]

    latest_data = ts[latest]
    prev_data = ts[prev]

    latest_close = float(latest_data["4. close"])
    prev_close = float(prev_data["4. close"])

    # % price change from previous close
    change_pct = round((latest_close - prev_close) / prev_close * 100, 2)

    latest_volume = int(latest_data["6. volume"])
    prev_volume = int(prev_data["6. volume"])
    vol_change = latest_volume - prev_volume

    # Dumb but beginner-friendly way to convert into "pressure" bars
    if change_pct > 0:
        buying_pressure = min(85, 60 + int(abs(change_pct) * 5))
    elif change_pct < 0:
        buying_pressure = max(30, 50 - int(abs(change_pct) * 5))
    else:
        buying_pressure = 50

    selling_pressure = 100 - buying_pressure

    # Decide some simple labels based on change
    if change_pct > 2:
        ten_day_trend = "Strong Up"
    elif change_pct > 0:
        ten_day_trend = "Slightly Up"
    elif change_pct < -2:
        ten_day_trend = "Strong Down"
    elif change_pct < 0:
        ten_day_trend = "Slightly Down"
    else:
        ten_day_trend = "Stable"

    # Build a payload matching LearnData type
    payload = {
        "symbol": symbol.upper(),
        "changePct": change_pct,
        "beginnerVerdict": (
            f"Today the stock is {('up' if change_pct >= 0 else 'down')} "
            f"about {abs(change_pct)}%. Suitable for small SIPs; avoid large "
            f"lump‑sum moves unless you fully understand the risk."
        ),
        "futureScenario": (
            "If the broader market falls tomorrow, this stock could also dip. "
            "Stick to your SIP plan instead of reacting emotionally."
        ),
        "whyUpNow": (
            "This movement is based on recent price and volume trends. "
            "Price changed from the previous close and trading volume "
            "was "
            f"{'higher' if vol_change > 0 else 'lower'} than yesterday."
        ),
        "factors": {
            "earnings": (
                "Check the most recent earnings report to see if profits and "
                "revenue are growing."
            ),
            "sector": (
                "IT sector performance and sentiment affect this stock. "
                "If other IT stocks are doing well, this often helps too."
            ),
            "global": (
                "Global tech demand and USD‑INR movements influence Indian IT "
                "exporters."
            ),
            "investorActivity": (
                "Buying vs selling pressure is estimated from price and "
                "volume changes."
            ),
        },
        "confidenceScore": 70,  # simple static score; you can later compute from volatility
        "buyingPressure": buying_pressure,
        "sellingPressure": selling_pressure,
        "ifHolding": (
            "If you already hold this stock and your long‑term thesis has not "
            "changed, small daily moves usually don’t require action."
        ),
        "ifNew": (
            "If you are new, start with a small SIP instead of a big one‑time "
            "investment. Watch how it behaves for a few weeks."
        ),
        "sectorDescription": (
            "The IT sector is influenced by global technology spending, "
            "currency movements, and overall risk sentiment in the market."
        ),
        "trends": {
            # We only have data for INFY here, so we keep peers as simple examples
            "infosys": {
                "trend10": ten_day_trend,
                "trend30": "Slightly Up" if change_pct >= 0 else "Slightly Down",
                "volatility": "Medium",
                "steadiness": "Fairly Steady",
            },
            "tcs": {
                "trend10": "Stable",
                "trend30": "Slightly Up",
                "volatility": "Low",
                "steadiness": "Very Steady",
            },
            "wipro": {
                "trend10": "Some Ups & Downs",
                "trend30": "Slightly Down",
                "volatility": "Medium",
                "steadiness": "Some Ups & Downs",
            },
        },
        "popularReasons": [
            "Large, established IT company in India.",
            "Backed by long‑term contracts with global clients.",
            "Part of a sector many beginners start with.",
        ],
        "dataSource": "alpha_vantage",
        "latestDate": latest,
        "latestClose": latest_close,
    }

    return payload, None


# ---------- MAIN VIEW ----------

@api_view(["GET"])
@permission_classes([AllowAny])
def get_infy_data(request):
    """
    Return learn‑page data for Infosys (INFY).
    If USE_REAL_MARKET_DATA=True and Alpha Vantage works, return live data.
    Otherwise fall back to MOCK_LEARN_DATA so the frontend never breaks.
    """
    use_live = getattr(settings, "USE_REAL_MARKET_DATA", False)

    if use_live:
        # Alpha Vantage symbol – adjust if you want NSE vs BSE etc.
        # For NSE many people use "INFY.NS", for BSE "INFY.BSE".
        symbol = "INFY.BSE"
        live_payload, error = build_live_learn_payload(symbol)

        if live_payload is not None:
            return Response(live_payload, status=status.HTTP_200_OK)

        # Log the error so you can see it in the console
        print(f"[Learn] Falling back to mock data. Reason: {error}")

    # Default: return mock data
    return Response(MOCK_LEARN_DATA, status=status.HTTP_200_OK)
