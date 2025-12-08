import type { DashboardData } from "@/lib/types"
import { MarketMood } from "./market-mood"
import { SectorHighlights } from "./sector-highlights"
import { StockMovers } from "./stock-movers"
import { InvestorAdviceCard } from "./investor-advice"

interface MarketSectionProps {
  data: DashboardData
  onBeginnerClick?: () => void
}

export function MarketSection({ data, onBeginnerClick }: MarketSectionProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="mb-6 text-lg font-semibold text-foreground">Today's Market in Your Language</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <MarketMood data={data.marketMood} />
        <SectorHighlights data={data.sectorHighlights} />
        <StockMovers data={data.stockMovers} />
        <InvestorAdviceCard data={data.investorAdvice} onBeginnerClick={onBeginnerClick} />
      </div>
    </div>
  )
}
