"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface Feature {
  featureKey: string
  displayName: string
  sourceModulePath: string
  unitIntegration: { unitTestCount: number; integrationTestCount: number }
  e2e: { testCount: number }
  coverageState: string
}

export default function FeaturesMap({ features }: { features: Feature[] }) {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "full" | "partial" | "none">("all")

  const getCoverageColor = (state: string) => {
    switch (state) {
      case "full":
        return "bg-gradient-to-br from-[oklch(0.65_0.18_160)] to-[oklch(0.70_0.20_160)] hover:from-[oklch(0.70_0.20_160)] hover:to-[oklch(0.75_0.22_160)] shadow-[0_0_15px_oklch(0.65_0.18_160)]"
      case "partial":
        return "bg-gradient-to-br from-[oklch(0.75_0.18_90)] to-[oklch(0.80_0.20_100)] hover:from-[oklch(0.80_0.20_100)] hover:to-[oklch(0.85_0.22_100)] shadow-[0_0_15px_oklch(0.75_0.18_90)]"
      case "none":
        return "bg-gradient-to-br from-[oklch(0.55_0.25_25)] to-[oklch(0.60_0.28_30)] hover:from-[oklch(0.60_0.28_30)] hover:to-[oklch(0.65_0.30_30)] shadow-[0_0_15px_oklch(0.55_0.25_25)]"
      default:
        return "bg-gradient-to-br from-muted to-secondary hover:from-secondary hover:to-muted"
    }
  }

  const getTextColor = (state: string) => {
    switch (state) {
      case "full":
        return "text-[oklch(0.65_0.18_160)]"
      case "partial":
        return "text-[oklch(0.75_0.18_90)]"
      case "none":
        return "text-[oklch(0.60_0.28_25)]"
      default:
        return "text-muted-foreground"
    }
  }

  const filteredFeatures = filter === "all" ? features : features.filter((f) => f.coverageState === filter)

  const sortedByTests = [...filteredFeatures].sort((a, b) => {
    const aTotal = a.unitIntegration.unitTestCount + a.unitIntegration.integrationTestCount + a.e2e.testCount
    const bTotal = b.unitIntegration.unitTestCount + b.unitIntegration.integrationTestCount + b.e2e.testCount
    return bTotal - aTotal
  })

  const fullyCovered = features.filter((f) => f.coverageState === "full").length
  const partiallyCovered = features.filter((f) => f.coverageState === "partial").length
  const noCoverage = features.filter((f) => f.coverageState === "none").length

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/80 backdrop-blur-sm border-[oklch(0.65_0.18_160)]/50 shadow-lg shadow-[oklch(0.65_0.18_160)]/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              ✨ Fully Covered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[oklch(0.65_0.18_160)]">{fullyCovered}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {((fullyCovered / features.length) * 100).toFixed(1)}% stellar
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-[oklch(0.75_0.18_90)]/50 shadow-lg shadow-[oklch(0.75_0.18_90)]/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              ⚡ Partially Covered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[oklch(0.75_0.18_90)]">{partiallyCovered}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {((partiallyCovered / features.length) * 100).toFixed(1)}% nebula
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-[oklch(0.55_0.25_25)]/50 shadow-lg shadow-[oklch(0.55_0.25_25)]/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              🌑 No Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[oklch(0.60_0.28_25)]">{noCoverage}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {((noCoverage / features.length) * 100).toFixed(1)}% void
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "full", "partial", "none"] as const).map((state) => (
          <button
            key={state}
            onClick={() => setFilter(state)}
            className={`px-3 py-2 text-sm rounded-lg font-medium transition-all capitalize ${
              filter === state
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-secondary/50 backdrop-blur-sm text-secondary-foreground hover:bg-secondary/70 border border-border/50"
            }`}
          >
            {state === "all"
              ? "🌌 All Features"
              : state === "full"
                ? "✨ Fully Covered"
                : state === "partial"
                  ? "⚡ Partially Covered"
                  : "🌑 No Coverage"}
          </button>
        ))}
      </div>

      {/* Features Map Grid */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">🗺️ Features Galaxy Map</CardTitle>
          <CardDescription>Interactive visualization of all stellar features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {sortedByTests.map((feature) => {
              const totalTests =
                feature.unitIntegration.unitTestCount +
                feature.unitIntegration.integrationTestCount +
                feature.e2e.testCount

              return (
                <div
                  key={feature.featureKey}
                  className="relative group"
                  onMouseEnter={() => setHoveredFeature(feature.featureKey)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div
                    className={`${getCoverageColor(feature.coverageState)} p-3 rounded-lg cursor-pointer transition-all transform group-hover:scale-110 group-hover:-translate-y-1`}
                  >
                    <div className="aspect-square flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold text-white drop-shadow-lg">{totalTests}</div>
                      <div className="text-xs text-white/90 text-center mt-1 leading-tight drop-shadow">
                        {feature.displayName.split("/").pop()?.substring(0, 10)}
                      </div>
                    </div>
                  </div>

                  {/* Tooltip */}
                  {hoveredFeature === feature.featureKey && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 w-48 bg-card/95 backdrop-blur-xl border border-primary/50 rounded-lg p-3 shadow-2xl shadow-primary/20 text-xs">
                      <div className="font-semibold text-foreground mb-2 flex items-center gap-1">
                        <span>🛸</span> {feature.displayName}
                      </div>
                      <div className="space-y-1 text-muted-foreground">
                        <div>🔬 Unit: {feature.unitIntegration.unitTestCount}</div>
                        <div>🔗 Integration: {feature.unitIntegration.integrationTestCount}</div>
                        <div>🌍 E2E: {feature.e2e.testCount}</div>
                        <div className={`font-medium ${getTextColor(feature.coverageState)} capitalize mt-2`}>
                          {feature.coverageState === "full" && "✨ Fully Covered"}
                          {feature.coverageState === "partial" && "⚡ Partially Covered"}
                          {feature.coverageState === "none" && "🌑 No Coverage"}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* List View */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">📋 Detailed Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sortedByTests.map((feature) => {
              const totalTests =
                feature.unitIntegration.unitTestCount +
                feature.unitIntegration.integrationTestCount +
                feature.e2e.testCount

              return (
                <div
                  key={feature.featureKey}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all"
                >
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{feature.displayName}</div>
                    <div className="text-xs text-muted-foreground font-mono">{feature.sourceModulePath}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">{totalTests}</span> tests
                    </div>
                    <div
                      className={`inline-block w-3 h-3 rounded-full ${getCoverageColor(feature.coverageState).split(" ")[0]}`}
                      title={feature.coverageState}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
