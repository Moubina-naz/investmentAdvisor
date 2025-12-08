import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { BrokerPlatform } from "@/lib/types"

interface BrokerPlatformsProps {
  platforms: BrokerPlatform[]
}

export function BrokerPlatforms({ platforms }: BrokerPlatformsProps) {
  return (
    <Card>
      <CardContent className="py-6">
        <p className="mb-4 text-center text-sm font-medium text-foreground">
          When you're ready, invest on any SEBI-registered platform.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {platforms.map((platform) => (
            <Button key={platform.name} variant="outline" asChild className="min-w-[100px] bg-transparent">
              <a href={platform.url} target="_blank" rel="noopener noreferrer">
                {platform.name}
              </a>
            </Button>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          We explain. We guide. We don't sell or execute trades.
        </p>
      </CardContent>
    </Card>
  )
}
