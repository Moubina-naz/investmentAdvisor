import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { MarketMood as MarketMoodType } from "@/lib/types"
import { cn } from "@/lib/utils"

interface MarketMoodProps {
  data: MarketMoodType
}

export function MarketMood({ data }: MarketMoodProps) {
  const statusColorClass = {
    positive: "text-emerald-600",
    negative: "text-red-500",
    neutral: "text-amber-500",
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Market Mood Today: <span className={cn(statusColorClass[data.statusColor])}>{data.status}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">{data.description}</p>
      </CardContent>
    </Card>
  )
}
