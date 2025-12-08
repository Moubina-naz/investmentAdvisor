import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import type { EducationalCard as EducationalCardType } from "@/lib/types"

interface EducationalCardProps {
  data: EducationalCardType
}

export function EducationalCard({ data }: EducationalCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{data.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between">
        {data.description && <p className="mb-4 text-sm text-muted-foreground">{data.description}</p>}
        <Link
          href={data.ctaLink}
          className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:underline mt-auto"
        >
          {data.ctaText}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  )
}
