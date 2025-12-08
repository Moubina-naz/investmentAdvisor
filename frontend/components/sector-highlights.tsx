import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SectorHighlight } from "@/lib/types"
import { cn } from "@/lib/utils"

interface SectorHighlightsProps {
  data: SectorHighlight[]
}

export function SectorHighlights({ data }: SectorHighlightsProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Sector Highlights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.map((sector) => (
          <div key={sector.name} className="text-sm">
            <span className="font-medium">{sector.name}</span>{" "}
            <span className={cn("font-semibold", sector.change >= 0 ? "text-emerald-600" : "text-red-500")}>
              {sector.change >= 0 ? "+" : ""}
              {sector.change}%
            </span>{" "}
            <span className="text-muted-foreground">— {sector.reason}</span>{" "}
            <span className="text-muted-foreground">→ "{sector.weatherLabel}"</span> <span>{sector.weatherIcon}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
