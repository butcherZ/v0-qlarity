"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"

interface Feature {
  featureKey: string
  displayName: string
  sourceModulePath: string
  unitIntegration: { unitTestCount: number; integrationTestCount: number }
  e2e: { testCount: number }
  coverageState: string
}

export default function FeatureTable({ features }: { features: Feature[] }) {
  const [sortBy, setSortBy] = useState<"name" | "tests" | "state">("name")

  const getCoverageColor = (state: string) => {
    switch (state) {
      case "full":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "partial":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "none":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getCoverageLabel = (state: string) => {
    return state.charAt(0).toUpperCase() + state.slice(1)
  }

  const sortedFeatures = [...features].sort((a, b) => {
    if (sortBy === "name") return a.displayName.localeCompare(b.displayName)
    if (sortBy === "tests") {
      const aTotal = a.unitIntegration.unitTestCount + a.unitIntegration.integrationTestCount + a.e2e.testCount
      const bTotal = b.unitIntegration.unitTestCount + b.unitIntegration.integrationTestCount + b.e2e.testCount
      return bTotal - aTotal
    }
    if (sortBy === "state") return a.coverageState.localeCompare(b.coverageState)
    return 0
  })

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSortBy("name")}
          className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
            sortBy === "name"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-muted"
          }`}
        >
          Sort by Name
        </button>
        <button
          onClick={() => setSortBy("tests")}
          className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
            sortBy === "tests"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-muted"
          }`}
        >
          Sort by Tests
        </button>
        <button
          onClick={() => setSortBy("state")}
          className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
            sortBy === "state"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-muted"
          }`}
        >
          Sort by State
        </button>
      </div>

      <Card className="bg-card border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-4 py-3 font-semibold text-foreground">Feature</th>
                <th className="text-center px-4 py-3 font-semibold text-foreground">Unit Tests</th>
                <th className="text-center px-4 py-3 font-semibold text-foreground">Integration Tests</th>
                <th className="text-center px-4 py-3 font-semibold text-foreground">E2E Tests</th>
                <th className="text-center px-4 py-3 font-semibold text-foreground">Total Tests</th>
                <th className="text-center px-4 py-3 font-semibold text-foreground">Coverage State</th>
              </tr>
            </thead>
            <tbody>
              {sortedFeatures.map((feature) => {
                const totalTests =
                  feature.unitIntegration.unitTestCount +
                  feature.unitIntegration.integrationTestCount +
                  feature.e2e.testCount
                return (
                  <tr
                    key={feature.featureKey}
                    className="border-b border-border hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-foreground">{feature.displayName}</div>
                        <div className="text-xs text-muted-foreground mt-1">{feature.sourceModulePath}</div>
                      </div>
                    </td>
                    <td className="text-center px-4 py-3 text-foreground font-medium">
                      {feature.unitIntegration.unitTestCount}
                    </td>
                    <td className="text-center px-4 py-3 text-foreground font-medium">
                      {feature.unitIntegration.integrationTestCount}
                    </td>
                    <td className="text-center px-4 py-3 text-foreground font-medium">{feature.e2e.testCount}</td>
                    <td className="text-center px-4 py-3 font-semibold text-primary">{totalTests}</td>
                    <td className="text-center px-4 py-3">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getCoverageColor(feature.coverageState)}`}
                      >
                        {getCoverageLabel(feature.coverageState)}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="text-sm text-muted-foreground">Showing {sortedFeatures.length} features</div>
    </div>
  )
}
