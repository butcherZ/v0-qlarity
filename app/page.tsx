"use client"

import { useState, useEffect } from "react"
import CoverageOverview from "@/components/coverage-overview"
import CoverageCharts from "@/components/coverage-charts"
import FeaturesMap from "@/components/features-map"
import TestPyramid from "@/components/test-pyramid"
import RiskMatrix from "@/components/risk-matrix"
import BlindSpots from "@/components/blind-spots"
import ActionPlan from "@/components/action-plan"
import FileUpload from "@/components/file-upload"
import { Card } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"

interface CoverageData {
  generatedAt: string
  context: {
    repository: string
    pathsAnalyzed: string[]
  }
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
  features: Array<{
    featureKey: string
    displayName: string
    sourceModulePath: string
    unitIntegration: { unitTestCount: number; integrationTestCount: number }
    e2e: { testCount: number }
    coverageState: string
  }>
  coverageConcerns?: Array<{
    featureKey: string
    displayName: string
    reason: string
  }>
  blindSpots?: Array<{
    featureKey: string
    displayName: string
    reason: string
  }>
  actionPlan?: Array<{
    description: string
    criticality: "High" | "Medium" | "Low"
  }>
}

interface StoredJSON {
  id: string
  repository: string
  data: CoverageData
}

interface MultiContextData {
  contexts: CoverageData[]
}

interface MultiReportData {
  generatedAt: string
  reports: Array<{
    name: string
    data: CoverageData
  }>
}

export default function DashboardPage() {
  const [storedJSONs, setStoredJSONs] = useState<StoredJSON[]>([])
  const [selectedJSONId, setSelectedJSONId] = useState<string | null>(null)
  const [allContexts, setAllContexts] = useState<CoverageData[]>([])
  const [selectedContextIndex, setSelectedContextIndex] = useState<number | "all">(0)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<
    "overview" | "map" | "pyramid" | "risks" | "blindspots" | "actions" | "charts"
  >("overview")

  const loadDataFromSupabase = async () => {
    try {
      const response = await fetch("/api/coverage-reports")
      if (!response.ok) {
        throw new Error("Failed to fetch from Supabase")
      }

      const result = await response.json()

      if (result.reports && result.reports.length > 0) {
        const supabaseJSONs = result.reports.map((report: any) => ({
          id: report.id,
          repository: report.repository,
          data: report.data,
        }))

        setStoredJSONs(supabaseJSONs)
        setSelectedJSONId(supabaseJSONs[0]?.id || null)
        setAllContexts(supabaseJSONs.map((j: StoredJSON) => j.data))
        return true
      }

      return false
    } catch (error) {
      console.error("[v0] Failed to load from Supabase:", error)
      return false
    }
  }

  useEffect(() => {
    const loadInitialData = async () => {
      const loadedFromSupabase = await loadDataFromSupabase()

      if (!loadedFromSupabase) {
        try {
          const response = await fetch("/test-coverage-data.json")
          const jsonData = await response.json()

          let contexts: CoverageData[] = []
          if (jsonData.reports && Array.isArray(jsonData.reports)) {
            contexts = jsonData.reports.map((report: any) => ({
              ...report.data,
              context: {
                ...report.data.context,
                repository: report.name || report.data.context.repository,
              },
            }))
          } else if (jsonData.contexts && Array.isArray(jsonData.contexts)) {
            contexts = jsonData.contexts
          } else {
            contexts = [jsonData]
          }

          const initialStoredJSONs = contexts.map((ctx, idx) => ({
            id: `default-${idx}`,
            repository: ctx.context.repository,
            data: ctx,
          }))

          setStoredJSONs(initialStoredJSONs)
          setSelectedJSONId(initialStoredJSONs[0]?.id || null)
          setAllContexts(contexts)
        } catch (error) {
          console.error("[v0] Failed to load coverage data:", error)
        }
      }

      setLoading(false)
    }

    loadInitialData()
  }, [])

  const handleFileUpload = async (
    uploadedData: CoverageData | MultiContextData | MultiReportData,
    repository: string,
  ) => {
    // Reload all data from Supabase to get the latest
    await loadDataFromSupabase()
    setActiveTab("overview")
  }

  const handleJSONSelect = (jsonId: string) => {
    setSelectedJSONId(jsonId)
    setSelectedContextIndex(0)
  }

  const getAggregatedData = (): CoverageData => {
    if (allContexts.length === 0) return {} as CoverageData

    const aggregated: CoverageData = {
      generatedAt: new Date().toISOString(),
      context: {
        repository: `All (${allContexts.length})`,
        pathsAnalyzed: allContexts.flatMap((ctx) => ctx.context.pathsAnalyzed),
      },
      statistics: {
        unit: {
          featuresCovered: allContexts.reduce((sum, ctx) => sum + ctx.statistics.unit.featuresCovered, 0),
          testFileCount: allContexts.reduce((sum, ctx) => sum + ctx.statistics.unit.testFileCount, 0),
        },
        integration: {
          featuresCovered: allContexts.reduce((sum, ctx) => sum + ctx.statistics.integration.featuresCovered, 0),
          testFileCount: allContexts.reduce((sum, ctx) => sum + ctx.statistics.integration.testFileCount, 0),
        },
        e2e: {
          featuresCovered: allContexts.reduce((sum, ctx) => sum + ctx.statistics.e2e.featuresCovered, 0),
          testFileCount: allContexts.reduce((sum, ctx) => sum + ctx.statistics.e2e.testFileCount, 0),
        },
        featureCoverage: {
          totalFeatures: allContexts.reduce((sum, ctx) => sum + ctx.statistics.featureCoverage.totalFeatures, 0),
          fullyCovered: allContexts.reduce((sum, ctx) => sum + ctx.statistics.featureCoverage.fullyCovered, 0),
          partiallyCovered: allContexts.reduce((sum, ctx) => sum + ctx.statistics.featureCoverage.partiallyCovered, 0),
          noAutomatedCoverage: allContexts.reduce(
            (sum, ctx) => sum + ctx.statistics.featureCoverage.noAutomatedCoverage,
            0,
          ),
        },
      },
      features: allContexts.flatMap((ctx) =>
        ctx.features.map((f) => ({
          ...f,
          sourceModulePath: `${ctx.context.repository}/${f.sourceModulePath}`,
        })),
      ),
      coverageConcerns: allContexts.flatMap((ctx) => ctx.coverageConcerns || []),
      blindSpots: allContexts.flatMap((ctx) => ctx.blindSpots || []),
      actionPlan: allContexts.flatMap((ctx) => ctx.actionPlan || []),
    }

    return aggregated
  }

  const selectedStoredJSON = storedJSONs.find((j) => j.id === selectedJSONId)
  const currentData = selectedStoredJSON ? selectedStoredJSON.data : getAggregatedData()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading test coverage data...</p>
        </div>
      </div>
    )
  }

  if (storedJSONs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 max-w-md">
          <h2 className="text-lg font-semibold text-destructive mb-2">Error</h2>
          <p className="text-sm text-muted-foreground">Failed to load coverage data</p>
          <div className="mt-6">
            <FileUpload onUpload={handleFileUpload} />
          </div>
        </Card>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-40 shadow-lg shadow-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                🛸 Qlarity <span className="text-primary">Mission Control</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                🚀 Generated:{" "}
                <span className="font-medium">{new Date(currentData.generatedAt).toLocaleDateString()}</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <FileUpload onUpload={handleFileUpload} />
              <div className="flex items-center gap-2">
                <label htmlFor="view-select" className="text-sm font-medium text-foreground whitespace-nowrap">
                  View:
                </label>
                <select
                  id="view-select"
                  value={selectedJSONId || "all"}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value === "all") {
                      setSelectedJSONId(null)
                    } else {
                      handleJSONSelect(value)
                    }
                  }}
                  className="px-3 py-2 rounded-lg text-sm font-medium bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 transition-colors cursor-pointer"
                >
                  <option value="all">All ({storedJSONs.length})</option>
                  {storedJSONs.map((json) => (
                    <option key={json.id} value={json.id}>
                      {json.repository}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-2 border-b border-border/50 -mb-6 overflow-x-auto">
            {(["overview", "map", "pyramid", "risks", "blindspots", "actions", "charts"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium transition-colors capitalize whitespace-nowrap ${
                  activeTab === tab
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "map"
                  ? "Features Map"
                  : tab === "pyramid"
                    ? "Test Pyramid"
                    : tab === "risks"
                      ? "Risk Analysis"
                      : tab === "blindspots"
                        ? "Blind Spots"
                        : tab === "actions"
                          ? "Action Plan"
                          : tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && <CoverageOverview data={currentData} />}
        {activeTab === "map" && <FeaturesMap features={currentData.features} />}
        {activeTab === "pyramid" && <TestPyramid stats={currentData.statistics} />}
        {activeTab === "risks" && (
          <RiskMatrix features={currentData.features} concerns={currentData.coverageConcerns || []} />
        )}
        {activeTab === "blindspots" && <BlindSpots blindSpots={currentData.blindSpots || []} />}
        {activeTab === "actions" && <ActionPlan actionPlan={currentData.actionPlan || []} />}
        {activeTab === "charts" && <CoverageCharts stats={currentData.statistics} />}
      </div>
    </main>
  )
}
