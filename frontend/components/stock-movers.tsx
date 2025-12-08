import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { StockMover } from "@/lib/types"
import { cn } from "@/lib/utils"

interface StockMoversProps {
  data: StockMover[]
}

export function StockMovers({ data }: StockMoversProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Stock Movers—With Reasons</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {data.map((stock) => (
          <div key={stock.symbol} className="text-sm">
            <span className="font-semibold">{stock.symbol}</span>{" "}
            <span className={cn("font-semibold", stock.change >= 0 ? "text-emerald-600" : "text-red-500")}>
              {stock.change >= 0 ? "+" : ""}
              {stock.change}%
            </span>{" "}
            <span className="text-muted-foreground">— {stock.reason}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
