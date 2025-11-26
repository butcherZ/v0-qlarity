"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface Stats {
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

export default function TestPyramid({ stats }: { stats: Stats }) {
  const totalTests = stats.unit.testFileCount + stats.integration.testFileCount + stats.e2e.testFileCount
  const unitPercent = ((stats.unit.testFileCount / totalTests) * 100).toFixed(1)
  const integrationPercent = ((stats.integration.testFileCount / totalTests) * 100).toFixed(1)
  const e2ePercent = ((stats.e2e.testFileCount / totalTests) * 100).toFixed(1)

  const unitFeaturePercent = ((stats.unit.featuresCovered / stats.featureCoverage.totalFeatures) * 100).toFixed(1)
  const integrationFeaturePercent = (
    (stats.integration.featuresCovered / stats.featureCoverage.totalFeatures) *
    100
  ).toFixed(1)
  const e2eFeaturePercent = ((stats.e2e.featuresCovered / stats.featureCoverage.totalFeatures) * 100).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Main Pyramid Visualization */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Test Pyramid</CardTitle>
          <CardDescription>Distribution of test types following the testing pyramid principle</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 gap-6">
            {/* Pyramid */}
            <div className="w-full max-w-md">
              {/* E2E Layer */}
              <div className="mb-2">
                <div className="bg-red-500/20 border-2 border-red-500 rounded-lg p-4 mx-auto" style={{ width: "30%" }}>
                  <div className="text-center">
                    <div className="text-sm font-bold text-red-600 dark:text-red-400">E2E Tests</div>
                    <div className="text-2xl font-bold text-foreground">{stats.e2e.testFileCount}</div>
                    <div className="text-xs text-muted-foreground">{e2ePercent}% of tests</div>
                  </div>
                </div>
              </div>

              {/* Integration Layer */}
              <div className="mb-2">
                <div
                  className="bg-yellow-500/20 border-2 border-yellow-500 rounded-lg p-4 mx-auto"
                  style={{ width: "50%" }}
                >
                  <div className="text-center">
                    <div className="text-sm font-bold text-yellow-600 dark:text-yellow-400">Integration Tests</div>
                    <div className="text-2xl font-bold text-foreground">{stats.integration.testFileCount}</div>
                    <div className="text-xs text-muted-foreground">{integrationPercent}% of tests</div>
                  </div>
                </div>
              </div>

              {/* Unit Layer */}
              <div>
                <div className="bg-green-500/20 border-2 border-green-500 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-sm font-bold text-green-600 dark:text-green-400">Unit Tests</div>
                    <div className="text-2xl font-bold text-foreground">{stats.unit.testFileCount}</div>
                    <div className="text-xs text-muted-foreground">{unitPercent}% of tests</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="text-center pt-4 border-t border-border">
              <div className="text-sm text-muted-foreground">Total Tests</div>
              <div className="text-4xl font-bold text-foreground">{totalTests}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Coverage Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">Unit Test Coverage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Features Covered</span>
                <span className="text-sm font-semibold text-foreground">{stats.unit.featuresCovered}</span>
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div
                  className="bg-green-500 rounded-full h-2 transition-all"
                  style={{ width: `${unitFeaturePercent}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-2">{unitFeaturePercent}% of features</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Test Files</div>
              <div className="text-2xl font-bold text-foreground">{stats.unit.testFileCount}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
              Integration Coverage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Features Covered</span>
                <span className="text-sm font-semibold text-foreground">{stats.integration.featuresCovered}</span>
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div
                  className="bg-yellow-500 rounded-full h-2 transition-all"
                  style={{ width: `${integrationFeaturePercent}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-2">{integrationFeaturePercent}% of features</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Test Files</div>
              <div className="text-2xl font-bold text-foreground">{stats.integration.testFileCount}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400">E2E Coverage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Features Covered</span>
                <span className="text-sm font-semibold text-foreground">{stats.e2e.featuresCovered}</span>
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div
                  className="bg-red-500 rounded-full h-2 transition-all"
                  style={{ width: `${e2eFeaturePercent}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-2">{e2eFeaturePercent}% of features</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Test Files</div>
              <div className="text-2xl font-bold text-foreground">{stats.e2e.testFileCount}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pyramid Principle Info */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Testing Pyramid Principle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            The testing pyramid suggests that you should have{" "}
            <span className="font-semibold text-foreground">many unit tests</span>,
            <span className="font-semibold text-foreground"> fewer integration tests</span>, and
            <span className="font-semibold text-foreground"> even fewer end-to-end tests</span>.
          </p>
          <p>This approach optimizes for:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <span className="font-semibold text-foreground">Speed:</span> Unit tests run fastest
            </li>
            <li>
              <span className="font-semibold text-foreground">Reliability:</span> Unit tests are more stable
            </li>
            <li>
              <span className="font-semibold text-foreground">Cost:</span> Fewer expensive E2E tests
            </li>
            <li>
              <span className="font-semibold text-foreground">Coverage:</span> Broad coverage with efficient tests
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
