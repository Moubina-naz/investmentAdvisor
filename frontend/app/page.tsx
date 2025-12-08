"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { CoachBanner } from "@/components/coach-banner"
import { ReadinessPulse } from "@/components/readiness-pulse"
import { MarketSection } from "@/components/market-section"
import { EducationalCard } from "@/components/educational-card"
import { BrokerPlatforms } from "@/components/broker-platforms"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { fetchDashboardData } from "@/lib/mock-data"
import type { DashboardData } from "@/lib/types"

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const dashboardData = await fetchDashboardData()
        setData(dashboardData)
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Action handlers - Connect these to your backend later
  const handleBoostScore = () => {
    console.log("[v0] Boost score clicked - connect to backend")
    // TODO: Navigate to score improvement flow
  }

  const handleTellChanges = () => {
    console.log("[v0] Tell changes clicked - connect to backend")
    // TODO: Open weekly update modal/form
  }

  const handleReadyToInvest = () => {
    console.log("[v0] Ready to invest clicked - connect to backend")
    // TODO: Navigate to investment readiness assessment
  }

  const handleBeginnerClick = () => {
    console.log("[v0] Beginner help clicked - connect to backend")
    // TODO: Show beginner-friendly explanation modal
  }

  return (
    <div className="min-h-screen bg-background">
      <Header userName={data?.user.name || "User"} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {loading ? (
          <DashboardSkeleton />
        ) : data ? (
          <>
            <CoachBanner />

            <ReadinessPulse
              score={data.user.readinessScore}
              message={data.user.scoreMessage}
              onBoostScore={handleBoostScore}
              onTellChanges={handleTellChanges}
              onReadyToInvest={handleReadyToInvest}
            />

            <MarketSection data={data} onBeginnerClick={handleBeginnerClick} />

            <div className="grid gap-4 md:grid-cols-3">
              {data.educationalCards.map((card) => (
                <EducationalCard key={card.id} data={card} />
              ))}
            </div>

            <BrokerPlatforms platforms={data.brokerPlatforms} />
          </>
        ) : (
          <p className="text-center text-muted-foreground">Failed to load dashboard data.</p>
        )}
      </main>
    </div>
  )
}
