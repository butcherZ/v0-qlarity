"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface CoverageData {
  statistics: {
    unit: { featuresCovered: number; testFileCount: number }
    integration: { featuresCovered: number; testFileCount: number }
    e2e: { featuresCovered: number; testFileCount: number }
    featureCoverage: {
      totalFeatures: number
      fullyCovered: number
      partiallyCovered: number
      noAutomatedCoverage: number
    }
  }
}

export default function CoverageOverview({ data }: { data: CoverageData }) {
  const stats = data.statistics
  const coverage = stats.featureCoverage

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/80 backdrop-blur-sm border-primary/30 shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              🌌 Total Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{coverage.totalFeatures}</div>
            <p className="text-xs text-muted-foreground mt-2">Features in the galaxy</p>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-[oklch(0.65_0.18_160)]/30 shadow-lg shadow-[oklch(0.65_0.18_160)]/10 hover:shadow-[oklch(0.65_0.18_160)]/20 transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              ✨ Fully Covered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[oklch(0.65_0.18_160)]">{coverage.fullyCovered}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round((coverage.fullyCovered / coverage.totalFeatures) * 100)}% stellar coverage
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-[oklch(0.75_0.18_90)]/30 shadow-lg shadow-[oklch(0.75_0.18_90)]/10 hover:shadow-[oklch(0.75_0.18_90)]/20 transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              ⚡ Partially Covered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[oklch(0.75_0.18_90)]">{coverage.partiallyCovered}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round((coverage.partiallyCovered / coverage.totalFeatures) * 100)}% nebula coverage
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-[oklch(0.55_0.25_25)]/30 shadow-lg shadow-[oklch(0.55_0.25_25)]/10 hover:shadow-[oklch(0.55_0.25_25)]/20 transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              🌑 No Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[oklch(0.55_0.25_25)]">{coverage.noAutomatedCoverage}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round((coverage.noAutomatedCoverage / coverage.totalFeatures) * 100)}% dark matter
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Test Type Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">🔬 Unit Tests</CardTitle>
            <CardDescription>Microscopic analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Test Files</span>
                <span className="font-semibold text-foreground">{stats.unit.testFileCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Features Covered</span>
                <span className="font-semibold text-foreground">{stats.unit.featuresCovered}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">🔗 Integration Tests</CardTitle>
            <CardDescription>System connections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Test Files</span>
                <span className="font-semibold text-foreground">{stats.integration.testFileCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Features Covered</span>
                <span className="font-semibold text-foreground">{stats.integration.featuresCovered}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">🌍 E2E Tests</CardTitle>
            <CardDescription>Full orbit scans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Test Files</span>
                <span className="font-semibold text-foreground">{stats.e2e.testFileCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Features Covered</span>
                <span className="font-semibold text-foreground">{stats.e2e.featuresCovered}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coverage Summary */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">📊 Coverage Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-foreground">✨ Fully Covered</span>
              <span className="text-sm font-semibold text-[oklch(0.65_0.18_160)]">
                {Math.round((coverage.fullyCovered / coverage.totalFeatures) * 100)}%
              </span>
            </div>
            <div className="w-full bg-border/50 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[oklch(0.65_0.18_160)] to-[oklch(0.70_0.20_160)] rounded-full h-2.5 transition-all shadow-[0_0_10px_oklch(0.65_0.18_160)]"
                style={{ width: `${(coverage.fullyCovered / coverage.totalFeatures) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-foreground">⚡ Partially Covered</span>
              <span className="text-sm font-semibold text-[oklch(0.75_0.18_90)]">
                {Math.round((coverage.partiallyCovered / coverage.totalFeatures) * 100)}%
              </span>
            </div>
            <div className="w-full bg-border/50 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[oklch(0.75_0.18_90)] to-[oklch(0.80_0.20_100)] rounded-full h-2.5 transition-all shadow-[0_0_10px_oklch(0.75_0.18_90)]"
                style={{ width: `${(coverage.partiallyCovered / coverage.totalFeatures) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-foreground">🌑 No Coverage</span>
              <span className="text-sm font-semibold text-[oklch(0.55_0.25_25)]">
                {Math.round((coverage.noAutomatedCoverage / coverage.totalFeatures) * 100)}%
              </span>
            </div>
            <div className="w-full bg-border/50 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[oklch(0.55_0.25_25)] to-[oklch(0.60_0.28_30)] rounded-full h-2.5 transition-all shadow-[0_0_10px_oklch(0.55_0.25_25)]"
                style={{ width: `${(coverage.noAutomatedCoverage / coverage.totalFeatures) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
