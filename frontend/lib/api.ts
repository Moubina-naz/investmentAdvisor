/**
 * WealthWiz API Client
 * Connects frontend to Django backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

// Token management
let accessToken: string | null = null
let refreshToken: string | null = null

// Initialize tokens from localStorage (browser only)
if (typeof window !== "undefined") {
  accessToken = localStorage.getItem("wealthwiz_access_token")
  refreshToken = localStorage.getItem("wealthwiz_refresh_token")
}

export function setTokens(access: string, refresh: string) {
  accessToken = access
  refreshToken = refresh
  if (typeof window !== "undefined") {
    localStorage.setItem("wealthwiz_access_token", access)
    localStorage.setItem("wealthwiz_refresh_token", refresh)
  }
}

export function clearTokens() {
  accessToken = null
  refreshToken = null
  if (typeof window !== "undefined") {
    localStorage.removeItem("wealthwiz_access_token")
    localStorage.removeItem("wealthwiz_refresh_token")
  }
}

export function getAccessToken() {
  return accessToken
}

export function isAuthenticated() {
  return !!accessToken
}

// API request helper
// API request helper
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // Build normalized headers (avoids TS errors)
  const normalizedHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Merge user-provided headers safely
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        normalizedHeaders[key] = value;
      });
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => {
        normalizedHeaders[key] = value;
      });
    } else {
      Object.assign(normalizedHeaders, options.headers as Record<string, string>);
    }
  }

  // Add Authorization header if token exists
  if (accessToken) {
    normalizedHeaders["Authorization"] = `Bearer ${accessToken}`;
  }

  // First API call
  const response = await fetch(url, {
    ...options,
    headers: normalizedHeaders,
  });

  // =============================
  // TOKEN REFRESH LOGIC (401)
  // =============================
  if (response.status === 401 && refreshToken) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      // Update header with new token
      normalizedHeaders["Authorization"] = `Bearer ${accessToken}`;

      const retryResponse = await fetch(url, {
        ...options,
        headers: normalizedHeaders,
      });

      if (!retryResponse.ok) {
        throw new Error(`API Error: ${retryResponse.status}`);
      }

      return retryResponse.json();
    } else {
      clearTokens();
      throw new Error("Session expired. Please login again.");
    }
  }

  // If still not OK after refresh logic
  if (!response.ok) {
    let errorData: any = {};

    try {
      errorData = await response.json();
    } catch (e) {
      // Ignore
    }

    throw new Error(
      errorData.detail ||
        errorData.message ||
        `API Error: ${response.status}`
    );
  }

  // Successful request → return JSON
  return response.json();
}


async function refreshAccessToken(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    })

    if (response.ok) {
      const data = await response.json()
      accessToken = data.access
      if (typeof window !== "undefined") {
        localStorage.setItem("wealthwiz_access_token", data.access)
      }
      return true
    }
    return false
  } catch {
    return false
  }
}

// ============================================
// Auth API
// ============================================

export interface RegisterData {
  email: string
  password: string
  password_confirm: string
  full_name?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  user: {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
  }
  tokens: {
    access: string
    refresh: string
  }
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>("/register/", {
    method: "POST",
    body: JSON.stringify(data),
  })
  setTokens(response.tokens.access, response.tokens.refresh)
  return response
}

export async function login(data: LoginData): Promise<{ access: string; refresh: string }> {
  const response = await apiRequest<{ access: string; refresh: string }>("/token/", {
    method: "POST",
    body: JSON.stringify({ username: data.email, password: data.password }),
  })
  setTokens(response.access, response.refresh)
  return response
}

export function logout() {
  clearTokens()
}

export async function getMe() {
  return apiRequest("/me/")
}

// ============================================
// Profile API
// ============================================

export async function getProfile() {
  return apiRequest("/profile/")
}

export async function updateProfile(data: Record<string, unknown>) {
  return apiRequest("/profile/", {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function getFinancialProfile() {
  return apiRequest("/profile/financial/")
}

export async function updateFinancialProfile(data: Record<string, unknown>) {
  return apiRequest("/profile/financial/", {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function getRiskProfile() {
  return apiRequest("/profile/risk/")
}

export async function updateRiskProfile(data: Record<string, unknown>) {
  return apiRequest("/profile/risk/", {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

// ============================================
// Readiness API
// ============================================

export interface ReadinessResponse {
  score: number
  status: string
  status_message: string
  breakdown: {
    emergency_fund: number
    savings_rate: number
    debt_ratio: number
    risk_alignment: number
    market_adjustment: number
  }
  suggestions: string[]
  ready_to_invest: boolean
}

export async function getReadiness(): Promise<ReadinessResponse> {
  return apiRequest<ReadinessResponse>("/readiness/")
}

export async function getReadinessHistory() {
  return apiRequest("/readiness/history/")
}

// ============================================
// Market API (Public - No Auth Required)
// ============================================

export interface MarketMoodResponse {
  headline: string
  summary: string
  tone: "positive" | "negative" | "neutral"
  index_change: number
  provider: string
}

export interface SectorResponse {
  name: string
  change: number
  reason: string
  weather_icon: string
  weather_label: string
}

export interface StockMoverResponse {
  symbol: string
  change: number
  reason: string
}

export interface MarketSummaryResponse {
  index: {
    symbol: string
    value: number
    change: number
    change_percent: number
  }
  sectors: SectorResponse[]
  movers: {
    gainers: StockMoverResponse[]
    losers: StockMoverResponse[]
  }
  mood: string
  mood_emoji: string
  timestamp: string
}

export async function getMarketSummary(): Promise<MarketSummaryResponse> {
  return apiRequest<MarketSummaryResponse>("/market/today/")
}

export async function getMarketExplained(): Promise<MarketMoodResponse> {
  return apiRequest<MarketMoodResponse>("/market/explained/")
}

export async function getMarketRisk() {
  return apiRequest("/market/risk/")
}

export async function getSectors(): Promise<SectorResponse[]> {
  return apiRequest<SectorResponse[]>("/market/sectors/")
}

export async function getMovers(count = 5) {
  return apiRequest(`/market/movers/?count=${count}`)
}

// ============================================
// Advice API
// ============================================

export interface InvestorAdviceItem {
  type: string
  advice: string
}

export interface DailyAdviceResponse {
  readiness_score: number
  market_risk: string
  advice: {
    sips: string
    lumpsum: string
    long_term: string
    traders: string
    provider: string
  }
}

export async function getDailyAdvice(): Promise<DailyAdviceResponse> {
  return apiRequest<DailyAdviceResponse>("/advice/today/")
}

export async function getPatternInsight() {
  return apiRequest("/advice/pattern/")
}

export interface EducationCardResponse {
  id: string
  title: string
  description: string
  cta_text: string
  cta_link: string
  topic: string
}

export async function getEducationCards(): Promise<EducationCardResponse[]> {
  return apiRequest<EducationCardResponse[]>("/education/today/")
}

export async function getBeginnerExplanation(query: string) {
  return apiRequest(`/advice/beginner/?q=${encodeURIComponent(query)}`)
}

// ============================================
// Dashboard Combined Fetch (for efficiency)
// ============================================

export interface DashboardApiData {
  user: {
    name: string
    readinessScore: number
    scoreMessage: string
  }
  marketMood: {
    status: string
    statusColor: "positive" | "negative" | "neutral"
    description: string
  }
  sectorHighlights: Array<{
    name: string
    change: number
    reason: string
    weatherIcon: string
    weatherLabel: string
  }>
  stockMovers: Array<{
    symbol: string
    change: number
    reason: string
  }>
  investorAdvice: Array<{
    type: string
    advice: string
  }>
  educationalCards: Array<{
    id: string
    title: string
    description: string
    ctaText: string
    ctaLink: string
  }>
  brokerPlatforms: Array<{
    name: string
    url: string
  }>
}

export async function fetchDashboardData(): Promise<DashboardApiData> {
  // Fetch all data in parallel
  const [marketSummary, marketExplained, sectors, dailyAdvice, education] = await Promise.all([
    getMarketSummary().catch(() => null),
    getMarketExplained().catch(() => null),
    getSectors().catch(() => []),
    getDailyAdvice().catch(() => null),
    getEducationCards().catch(() => []),
  ])

  // Try to get readiness if authenticated
  let readiness: ReadinessResponse | null = null
  let userName = "User"

  if (isAuthenticated()) {
    try {
      readiness = await getReadiness()
      const me = (await getMe()) as { profile?: { full_name?: string } }
      userName = me.profile?.full_name || "User"
    } catch {
      // User not authenticated or profile incomplete
    }
  }

  // Transform API responses to match frontend types
  return {
    user: {
      name: userName,
      readinessScore: readiness?.score ?? 62,
      scoreMessage: readiness?.status_message ?? "Complete your profile to get your personalized readiness score.",
    },
    marketMood: {
      status: marketExplained?.headline ?? "Market data loading...",
      statusColor: (marketExplained?.tone ?? "neutral") as "positive" | "negative" | "neutral",
      description: marketExplained?.summary ?? "Connect to backend to see live market analysis.",
    },
    sectorHighlights: sectors.map((s) => ({
      name: s.name,
      change: s.change,
      reason: s.reason,
      weatherIcon: s.weather_icon,
      weatherLabel: s.weather_label,
    })),
    stockMovers: [...(marketSummary?.movers?.gainers ?? []), ...(marketSummary?.movers?.losers ?? [])]
      .slice(0, 5)
      .map((m) => ({
        symbol: m.symbol,
        change: m.change,
        reason: m.reason,
      })),
    investorAdvice: dailyAdvice
      ? [
          { type: "SIPs", advice: dailyAdvice.advice.sips },
          { type: "Lump-sum", advice: dailyAdvice.advice.lumpsum },
          { type: "Long-term investors", advice: dailyAdvice.advice.long_term },
          { type: "High-vol traders", advice: dailyAdvice.advice.traders },
        ]
      : [],
    educationalCards: education.map((e, idx) => ({
      id: e.id || String(idx + 1),
      title: e.title,
      description: e.description,
      ctaText: e.cta_text,
      ctaLink: e.cta_link,
    })),
    brokerPlatforms: [
      { name: "Groww", url: "https://groww.in" },
      { name: "Zerodha", url: "https://zerodha.com" },
      { name: "INDmoney", url: "https://indmoney.com" },
    ],
  }
}
