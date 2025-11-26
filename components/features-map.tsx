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
        return "bg-green-500 hover:bg-green-600"
      case "partial":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "none":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const getTextColor = (state: string) => {
    switch (state) {
      case "full":
        return "text-green-600 dark:text-green-400"
      case "partial":
        return "text-yellow-600 dark:text-yellow-400"
      case "none":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-gray-600 dark:text-gray-400"
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
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Fully Covered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{fullyCovered}</div>
            <p className="text-xs text-muted-foreground mt-2">{((fullyCovered / features.length) * 100).toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Partially Covered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{partiallyCovered}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {((partiallyCovered / features.length) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">No Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">{noCoverage}</div>
            <p className="text-xs text-muted-foreground mt-2">{((noCoverage / features.length) * 100).toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "full", "partial", "none"] as const).map((state) => (
          <button
            key={state}
            onClick={() => setFilter(state)}
            className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors capitalize ${
              filter === state
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-muted"
            }`}
          >
            {state === "all"
              ? "All Features"
              : state === "full"
                ? "Fully Covered"
                : state === "partial"
                  ? "Partially Covered"
                  : "No Coverage"}
          </button>
        ))}
      </div>

      {/* Features Map Grid */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Features Map - Coverage Overview</CardTitle>
          <CardDescription>Interactive visualization of all features and their coverage state</CardDescription>
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
                    className={`${getCoverageColor(feature.coverageState)} p-3 rounded-lg cursor-pointer transition-all transform group-hover:scale-105 shadow-sm`}
                  >
                    <div className="aspect-square flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold text-white">{totalTests}</div>
                      <div className="text-xs text-white/80 text-center mt-1 leading-tight">
                        {feature.displayName.split("/").pop()?.substring(0, 10)}
                      </div>
                    </div>
                  </div>

                  {/* Tooltip */}
                  {hoveredFeature === feature.featureKey && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 w-48 bg-card border border-border rounded-lg p-3 shadow-lg text-xs">
                      <div className="font-semibold text-foreground mb-2">{feature.displayName}</div>
                      <div className="space-y-1 text-muted-foreground">
                        <div>Unit: {feature.unitIntegration.unitTestCount}</div>
                        <div>Integration: {feature.unitIntegration.integrationTestCount}</div>
                        <div>E2E: {feature.e2e.testCount}</div>
                        <div className={`font-medium ${getTextColor(feature.coverageState)} capitalize`}>
                          {feature.coverageState}
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
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Detailed Features</CardTitle>
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
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{feature.displayName}</div>
                    <div className="text-xs text-muted-foreground">{feature.sourceModulePath}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">{totalTests}</span> tests
                    </div>
                    <div
                      className={`inline-block w-3 h-3 rounded-full ${getCoverageColor(feature.coverageState)}`}
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
