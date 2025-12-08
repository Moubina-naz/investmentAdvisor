"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { InvestorAdvice } from "@/lib/types"

interface InvestorAdviceProps {
  data: InvestorAdvice[]
  onBeginnerClick?: () => void
}

export function InvestorAdviceCard({ data, onBeginnerClick }: InvestorAdviceProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">What This Means for You</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="mb-4 space-y-2">
          {data.map((item) => (
            <li key={item.type} className="flex items-start gap-2 text-sm">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-foreground" />
              <span>
                <span className="font-semibold">{item.type}:</span>{" "}
                <span className="text-muted-foreground">{item.advice}</span>
              </span>
            </li>
          ))}
        </ul>
        <button onClick={onBeginnerClick} className="text-sm font-medium text-emerald-600 hover:underline">
          What does this mean for a beginner?
        </button>
      </CardContent>
    </Card>
  )
}
