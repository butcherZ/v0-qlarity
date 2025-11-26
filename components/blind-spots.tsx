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
        <Card className="border-[oklch(0.75_0.18_90)]/50 bg-[oklch(0.20_0.08_90)]/30 backdrop-blur-sm shadow-lg shadow-[oklch(0.75_0.18_90)]/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-[oklch(0.80_0.20_100)] flex items-center gap-2">
              🌑 Total Blind Spots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[oklch(0.80_0.20_100)]">{blindSpots.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Features in the dark</p>
          </CardContent>
        </Card>

        {reasonCounts.slice(0, 3).map(([reason, spots]) => (
          <Card
            key={reason}
            className="border-[oklch(0.55_0.25_25)]/50 bg-[oklch(0.20_0.08_25)]/30 backdrop-blur-sm shadow-lg shadow-[oklch(0.55_0.25_25)]/10"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-[oklch(0.65_0.28_25)] line-clamp-2 flex items-center gap-2">
                🔴 {reason}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[oklch(0.65_0.28_25)]">{spots.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Systems affected</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {reasonCounts.map(([reason, spots]) => (
        <Card key={reason} className="overflow-hidden bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="bg-muted/30 border-b border-border/50">
            <CardTitle className="flex items-start gap-2 text-lg">
              <span className="text-xl mt-0.5 flex-shrink-0">⚠️</span>
              <div>
                <div className="flex items-center gap-2">{reason}</div>
                <CardDescription className="mt-1">{spots.length} features lost in space</CardDescription>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {spots.map((spot) => (
                <div
                  key={spot.featureKey}
                  className="p-4 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all group"
                >
                  <div className="font-semibold text-foreground flex items-center gap-2">
                    <span className="group-hover:scale-110 transition-transform">🌌</span>
                    {spot.displayName}
                  </div>
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
