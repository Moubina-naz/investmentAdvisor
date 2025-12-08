import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Coach Banner Skeleton */}
      <div className="mx-auto max-w-4xl">
        <Skeleton className="h-14 w-full rounded-lg" />
      </div>

      {/* Readiness Pulse Skeleton */}
      <Card className="mx-auto max-w-2xl">
        <CardContent className="flex flex-col items-center py-8">
          <Skeleton className="mb-6 h-6 w-40" />
          <Skeleton className="mb-4 h-16 w-24" />
          <Skeleton className="mb-8 h-4 w-64" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-36" />
          </div>
        </CardContent>
      </Card>

      {/* Market Section Skeleton */}
      <div className="rounded-lg border p-6">
        <Skeleton className="mb-6 h-6 w-64" />
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-40" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Educational Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="mb-4 h-12 w-full" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
