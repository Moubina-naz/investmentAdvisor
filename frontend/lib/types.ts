// Types for WealthWiz application
export interface User {
  id: string
  name: string
  readinessScore: number
  scoreMessage: string
}

export interface MarketMood {
  status: string
  statusColor: "positive" | "negative" | "neutral"
  description: string
}

export interface SectorHighlight {
  name: string
  change: number
  reason: string
  weatherIcon: string
  weatherLabel: string
}

export interface StockMover {
  symbol: string
  change: number
  reason: string
}

export interface InvestorAdvice {
  type: string
  advice: string
}

export interface EducationalCard {
  id: string
  title: string
  description: string
  ctaText: string
  ctaLink: string
}

export interface BrokerPlatform {
  name: string
  url: string
}

export interface DashboardData {
  user: User
  marketMood: MarketMood
  sectorHighlights: SectorHighlight[]
  stockMovers: StockMover[]
  investorAdvice: InvestorAdvice[]
  educationalCards: EducationalCard[]
  brokerPlatforms: BrokerPlatform[]
}
