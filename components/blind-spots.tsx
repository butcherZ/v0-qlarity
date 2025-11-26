"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface BlindSpot {
  featureKey: string
  displayName: string
  reason: string
}

interface BlindSpotsProps {
  blindSpots: BlindSpot[]
}

export default function BlindSpots({ blindSpots }: BlindSpotsProps) {
  const groupByReason = (spots: BlindSpot[]) => {
    const groups: Record<string, BlindSpot[]> = {}
    spots.forEach((spot) => {
      const key = spot.reason
      if (!groups[key]) groups[key] = []
      groups[key].push(spot)
    })
    return groups
  }

  const groupedSpots = groupByReason(blindSpots)
  const reasonCounts = Object.entries(groupedSpots).sort(([, a], [, b]) => b.length - a.length)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <Card className="border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-amber-900 dark:text-amber-200">Total Blind Spots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900 dark:text-amber-100">{blindSpots.length}</div>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">Features with coverage gaps</p>
          </CardContent>
        </Card>

        {reasonCounts.slice(0, 3).map(([reason, spots]) => (
          <Card key={reason} className="border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-red-900 dark:text-red-200 line-clamp-2">{reason}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-900 dark:text-red-100">{spots.length}</div>
              <p className="text-xs text-red-700 dark:text-red-300 mt-1">Affected features</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {reasonCounts.map(([reason, spots]) => (
        <Card key={reason} className="overflow-hidden">
          <CardHeader className="bg-muted/50 border-b">
            <CardTitle className="flex items-start gap-2 text-lg">
              <span className="text-amber-600 dark:text-amber-400 text-xl mt-0.5 flex-shrink-0">⚠</span>
              <div>
                <div>{reason}</div>
                <CardDescription className="mt-1">{spots.length} features affected</CardDescription>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {spots.map((spot) => (
                <div
                  key={spot.featureKey}
                  className="p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="font-semibold text-foreground">{spot.displayName}</div>
                  <div className="text-xs text-muted-foreground mt-1 font-mono">{spot.featureKey}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
