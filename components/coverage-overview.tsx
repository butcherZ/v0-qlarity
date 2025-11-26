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
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{coverage.totalFeatures}</div>
            <p className="text-xs text-muted-foreground mt-2">Features analyzed</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Fully Covered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{coverage.fullyCovered}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round((coverage.fullyCovered / coverage.totalFeatures) * 100)}% coverage
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Partially Covered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-500">{coverage.partiallyCovered}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round((coverage.partiallyCovered / coverage.totalFeatures) * 100)}% coverage
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">No Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 dark:text-red-500">{coverage.noAutomatedCoverage}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round((coverage.noAutomatedCoverage / coverage.totalFeatures) * 100)}% uncovered
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Test Type Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Unit Tests</CardTitle>
            <CardDescription>Test files and features</CardDescription>
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

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Integration Tests</CardTitle>
            <CardDescription>Test files and features</CardDescription>
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

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">E2E Tests</CardTitle>
            <CardDescription>Test files and features</CardDescription>
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
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Coverage Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Fully Covered</span>
              <span className="text-sm font-semibold text-primary">
                {Math.round((coverage.fullyCovered / coverage.totalFeatures) * 100)}%
              </span>
            </div>
            <div className="w-full bg-border rounded-full h-2">
              <div
                className="bg-primary rounded-full h-2 transition-all"
                style={{ width: `${(coverage.fullyCovered / coverage.totalFeatures) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Partially Covered</span>
              <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-500">
                {Math.round((coverage.partiallyCovered / coverage.totalFeatures) * 100)}%
              </span>
            </div>
            <div className="w-full bg-border rounded-full h-2">
              <div
                className="bg-yellow-600 dark:bg-yellow-500 rounded-full h-2 transition-all"
                style={{ width: `${(coverage.partiallyCovered / coverage.totalFeatures) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-foreground">No Coverage</span>
              <span className="text-sm font-semibold text-red-600 dark:text-red-500">
                {Math.round((coverage.noAutomatedCoverage / coverage.totalFeatures) * 100)}%
              </span>
            </div>
            <div className="w-full bg-border rounded-full h-2">
              <div
                className="bg-red-600 dark:bg-red-500 rounded-full h-2 transition-all"
                style={{ width: `${(coverage.noAutomatedCoverage / coverage.totalFeatures) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
