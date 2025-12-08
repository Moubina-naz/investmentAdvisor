"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ReadinessPulseProps {
  score: number
  message: string
  onBoostScore?: () => void
  onTellChanges?: () => void
  onReadyToInvest?: () => void
}

export function ReadinessPulse({ score, message, onBoostScore, onTellChanges, onReadyToInvest }: ReadinessPulseProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleBoostClick = () => {
    setIsAnimating(true)
    onBoostScore?.()
    setTimeout(() => setIsAnimating(false), 500)
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardContent className="flex flex-col items-center py-8 px-6">
        <h2 className="mb-6 text-xl font-semibold text-foreground">Readiness Pulse™</h2>

        <div className={`relative mb-4 transition-transform ${isAnimating ? "scale-110" : ""}`}>
          <span className="text-6xl font-bold text-emerald-500">{score}</span>
          <span className="text-2xl text-muted-foreground">/100</span>
        </div>

        <p className="mb-8 max-w-md text-center text-sm text-muted-foreground">{message}</p>

        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={handleBoostClick} className="bg-emerald-500 hover:bg-emerald-600 text-white">
            Boost My Score
          </Button>
          <Button variant="outline" onClick={onTellChanges}>
            Tell Us What Changed This Week
          </Button>
          <Button
            variant="outline"
            onClick={onReadyToInvest}
            className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 bg-transparent"
          >
            I'm Ready to Invest
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
