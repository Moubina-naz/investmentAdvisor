# WealthWiz Backend

Django REST API backend for the WealthWiz investment readiness advisor.

## Features

- **User Authentication**: JWT-based auth with registration and login
- **Financial Profile Management**: Track income, expenses, savings, debt
- **Risk Profile Assessment**: Store risk tolerance and investment preferences
- **Readiness Score Engine**: Calculate investment readiness (0-100) based on:
  - Emergency fund coverage (40%)
  - Savings rate (20%)
  - Debt-to-income ratio (20%)
  - Market risk adjustment (10%)
  - Risk profile alignment (10%)
- **Market Data Service**: Real (Alpha Vantage) or mock Indian market data
- **AI-Powered Insights**: Gemini/OpenAI integration for market explanations and advice

## Quick Start

### 1. Install Dependencies

\`\`\`bash
cd scripts/wealthwiz_backend
pip install -r requirements.txt
\`\`\`

### 2. Configure Environment

\`\`\`bash
cp .env.example .env
# Edit .env with your settings
\`\`\`

### 3. Run Migrations

\`\`\`bash
python manage.py migrate
\`\`\`

### 4. Create Superuser (Optional)

\`\`\`bash
python manage.py createsuperuser
\`\`\`

### 5. Run Development Server

\`\`\`bash
python manage.py runserver
\`\`\`

The API will be available at `http://localhost:8000/api/`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login (returns JWT tokens)
- `POST /api/auth/refresh/` - Refresh access token
- `GET /api/auth/me/` - Get current user profile

### Profile Management
- `GET/PUT /api/profile/` - User profile
- `GET/PUT /api/financial/` - Financial profile
- `GET/PUT /api/risk/` - Risk profile
- `GET/POST/PUT/DELETE /api/goals/` - Financial goals (CRUD)

### Readiness
- `GET /api/readiness/` - Calculate readiness score
- `GET /api/readiness/history/` - Score history

### Market Data
- `GET /api/market/raw/` - Raw market data
- `GET /api/market/summary/` - Market summary with mood
- `GET /api/market/explained/` - AI market explanation
- `GET /api/market/risk/` - Current market risk level
- `GET /api/sectors/` - Sector performance
- `GET /api/movers/` - Top gainers/losers

### AI Advice
- `GET /api/advice/today/` - Personalized daily advice
- `GET /api/insights/pattern/` - Today's market pattern
- `GET /api/education/today/?topic=volatility` - Educational content
- `GET /api/explain/?q=...` - Explain anything for beginners

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SECRET_KEY` | Django secret key | (dev key) |
| `DEBUG` | Debug mode | True |
| `USE_REAL_MARKET_DATA` | Use Alpha Vantage API | False |
| `ALPHA_VANTAGE_API_KEY` | Alpha Vantage API key | demo |
| `LLM_PROVIDER` | AI provider (gemini/openai) | gemini |
| `GEMINI_API_KEY` | Google Gemini API key | - |
| `OPENAI_API_KEY` | OpenAI API key | - |

### Readiness Score Weights

Configured in `settings.py`:

\`\`\`python
READINESS_WEIGHTS = {
    'emergency_fund': 0.40,
    'savings_rate': 0.20,
    'debt_to_income': 0.20,
    'market_risk': 0.10,
    'risk_alignment': 0.10,
}
\`\`\`

## Deployment

For production:

1. Set `DEBUG=False`
2. Configure PostgreSQL database
3. Set a strong `SECRET_KEY`
4. Configure `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS`
5. Run with gunicorn: `gunicorn wealthwiz_backend.wsgi:application`
