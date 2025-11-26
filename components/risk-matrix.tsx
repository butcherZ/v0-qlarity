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

interface Concern {
  featureKey: string
  displayName: string
  reason: string
}

export default function RiskMatrix({
  features,
  concerns,
}: {
  features: Feature[]
  concerns: Concern[]
}) {
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null)

  // Calculate risk metrics for each feature
  const featureRisks = features.map((feature) => {
    const totalTests =
      feature.unitIntegration.unitTestCount + feature.unitIntegration.integrationTestCount + feature.e2e.testCount

    // Low coverage flag
    const isLowCoverage = totalTests < 5 || feature.coverageState === "none"

    // High complexity proxy: features with many tests tend to be complex
    const isComplex = totalTests > 50

    // High git churn proxy: critical features with high test count but no coverage
    const isHighChurn = feature.coverageState === "none" && totalTests > 10

    const riskLevel = isHighChurn
      ? "critical"
      : isLowCoverage
        ? "high"
        : isComplex && feature.coverageState === "partial"
          ? "medium"
          : "low"

    return {
      ...feature,
      totalTests,
      isLowCoverage,
      isComplex,
      isHighChurn,
      riskLevel,
    }
  })

  // Filter by risk level
  const criticalRisks = featureRisks.filter((f) => f.riskLevel === "critical")
  const highRisks = featureRisks.filter((f) => f.riskLevel === "high")
  const mediumRisks = featureRisks.filter((f) => f.riskLevel === "medium")

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-500/10 border-red-500 text-red-600 dark:text-red-400"
      case "high":
        return "bg-orange-500/10 border-orange-500 text-orange-600 dark:text-orange-400"
      case "medium":
        return "bg-yellow-500/10 border-yellow-500 text-yellow-600 dark:text-yellow-400"
      default:
        return "bg-green-500/10 border-green-500 text-green-600 dark:text-green-400"
    }
  }

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Risk Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-red-500/10 border-red-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">{criticalRisks.length}</div>
            <p className="text-xs text-muted-foreground mt-2">Immediate action needed</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-500/10 border-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-600 dark:text-orange-400">High Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{highRisks.length}</div>
            <p className="text-xs text-muted-foreground mt-2">Should be prioritized</p>
          </CardContent>
        </Card>

        <Card className="bg-yellow-500/10 border-yellow-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Medium Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{mediumRisks.length}</div>
            <p className="text-xs text-muted-foreground mt-2">Monitor closely</p>
          </CardContent>
        </Card>

        <Card className="bg-green-500/10 border-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">Low Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {featureRisks.filter((f) => f.riskLevel === "low").length}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Well covered</p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Risk Details */}
      {criticalRisks.length > 0 && (
        <Card className="bg-red-500/10 border-2 border-red-500">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Critical Risk Areas</CardTitle>
            <CardDescription>Features with no coverage and high complexity - prioritize testing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criticalRisks.map((feature) => (
                <div
                  key={feature.featureKey}
                  className="p-3 rounded-lg border-l-4 border-red-500 bg-card hover:bg-secondary/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedRisk(selectedRisk === feature.featureKey ? null : feature.featureKey)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">{feature.displayName}</div>
                      <div className="text-xs text-muted-foreground mt-1">{feature.sourceModulePath}</div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getRiskBadgeColor("critical")}`}>
                      Critical
                    </span>
                  </div>

                  {selectedRisk === feature.featureKey && (
                    <div className="mt-3 pt-3 border-t border-border text-sm space-y-2">
                      <div>
                        <span className="text-muted-foreground">Tests: </span>
                        <span className="font-semibold text-foreground">{feature.totalTests}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Coverage: </span>
                        <span className="font-semibold text-red-600 dark:text-red-400 capitalize">
                          {feature.coverageState}
                        </span>
                      </div>
                      {feature.isHighChurn && (
                        <div className="text-red-600 dark:text-red-400 text-xs">
                          ⚠️ High git churn with insufficient test coverage
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* High Risk Details */}
      {highRisks.length > 0 && (
        <Card className="bg-orange-500/10 border-2 border-orange-500">
          <CardHeader>
            <CardTitle className="text-orange-600 dark:text-orange-400">High Risk Areas</CardTitle>
            <CardDescription>Features with low coverage - add tests soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {highRisks.map((feature) => (
                <div
                  key={feature.featureKey}
                  className="p-3 rounded-lg border border-orange-500/30 bg-card hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-medium text-foreground text-sm">{feature.displayName}</div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getRiskBadgeColor("high")}`}>High</span>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Tests: {feature.totalTests}</div>
                    <div>
                      Coverage: <span className="capitalize">{feature.coverageState}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Medium Risk Details */}
      {mediumRisks.length > 0 && (
        <Card className="bg-yellow-500/10 border-2 border-yellow-500">
          <CardHeader>
            <CardTitle className="text-yellow-600 dark:text-yellow-400">Medium Risk Areas</CardTitle>
            <CardDescription>Complex features with partial coverage - monitor and improve</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mediumRisks.map((feature) => (
                <div
                  key={feature.featureKey}
                  className="p-3 rounded-lg border border-yellow-500/30 bg-card hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-medium text-foreground text-sm">{feature.displayName}</div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getRiskBadgeColor("medium")}`}>
                      Medium
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Tests: {feature.totalTests}</div>
                    <div>
                      Coverage: <span className="capitalize">{feature.coverageState}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Coverage Concerns from Action Plan */}
      {concerns.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Coverage Concerns & Recommendations</CardTitle>
            <CardDescription>Areas flagged in the test coverage analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {concerns.map((concern, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-border bg-secondary/20 hover:bg-secondary/40 transition-colors"
                >
                  <div className="font-medium text-foreground text-sm">{concern.displayName}</div>
                  <div className="text-xs text-muted-foreground mt-1">{concern.reason}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk Legend */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Risk Assessment Criteria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="space-y-2">
            <div className="font-semibold text-red-600 dark:text-red-400">Critical Risk:</div>
            <div className="text-muted-foreground ml-4">
              High git churn (many tests but no coverage) or frequently changing untested code
            </div>
          </div>
          <div className="space-y-2">
            <div className="font-semibold text-orange-600 dark:text-orange-400">High Risk:</div>
            <div className="text-muted-foreground ml-4">Low test coverage (&lt;5 tests) or no automated coverage</div>
          </div>
          <div className="space-y-2">
            <div className="font-semibold text-yellow-600 dark:text-yellow-400">Medium Risk:</div>
            <div className="text-muted-foreground ml-4">Complex features (&gt;50 tests) with only partial coverage</div>
          </div>
          <div className="space-y-2">
            <div className="font-semibold text-green-600 dark:text-green-400">Low Risk:</div>
            <div className="text-muted-foreground ml-4">Well-tested features with full or adequate coverage</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
