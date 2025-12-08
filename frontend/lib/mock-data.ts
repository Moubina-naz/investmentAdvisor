import type { DashboardData } from "./types"

// Mock data - Replace with API calls when backend is ready
export const mockDashboardData: DashboardData = {
  user: {
    id: "1",
    name: "Aditi",
    readinessScore: 62,
    scoreMessage: "You're building solid ground. A little more consistency will boost your confidence.",
  },
  marketMood: {
    status: "Calm & Slightly Positive",
    statusColor: "positive",
    description:
      "Aaj market mildly stable hai. IT stocks thoda upar gaye — earnings strong thi. Banking steady hai after RBI's rate pause. FMCG thoda down due to rising input costs.",
  },
  sectorHighlights: [
    {
      name: "IT Services",
      change: 1.2,
      reason: "Strong quarterly earnings",
      weatherIcon: "☀️",
      weatherLabel: "Sunny",
    },
    {
      name: "Banking",
      change: 0.8,
      reason: "Mixed results but stable",
      weatherIcon: "⛅",
      weatherLabel: "Partly Cloudy",
    },
    {
      name: "FMCG",
      change: -0.2,
      reason: "Raw material cost pressure",
      weatherIcon: "🌧️",
      weatherLabel: "Light Rain",
    },
  ],
  stockMovers: [
    { symbol: "INFY", change: 1.7, reason: "Profit beat" },
    { symbol: "HDFCBANK", change: 0.9, reason: "Positive mgmt outlook" },
    { symbol: "ITC", change: -0.5, reason: "Sector pressure" },
  ],
  investorAdvice: [
    { type: "SIPs", advice: "Continue normally" },
    { type: "Lump-sum", advice: "Avoid large lump-sum this week" },
    { type: "Long-term investors", advice: "Stable climate" },
    { type: "High-vol traders", advice: "Stay cautious" },
  ],
  educationalCards: [
    {
      id: "1",
      title: "Today's Secret Pattern: Post-Earnings Drift",
      description: "Sometimes a stock keeps rising slowly for days after good news. We'll show you when.",
      ctaText: "Explore More Patterns",
      ctaLink: "/learn/patterns",
    },
    {
      id: "2",
      title: "What is Volatility?",
      description: "",
      ctaText: "Read in 2 minutes",
      ctaLink: "/learn/volatility",
    },
    {
      id: "3",
      title: "2-Minute Money Therapy",
      description: "A quick calming session to reduce financial stress and build a steady mindset.",
      ctaText: "Listen Now",
      ctaLink: "/learn/therapy",
    },
  ],
  brokerPlatforms: [
    { name: "Groww", url: "https://groww.in" },
    { name: "Zerodha", url: "https://zerodha.com" },
    { name: "INDmoney", url: "https://indmoney.com" },
  ],
}

// API helper functions - Replace these with actual API calls
export async function fetchDashboardData(): Promise<DashboardData> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockDashboardData
}

export async function updateReadinessScore(userId: string): Promise<number> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300))
  return Math.floor(Math.random() * 40) + 60 // Random score between 60-100
}
