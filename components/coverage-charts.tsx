"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

export default function CoverageCharts({ stats }: { stats: Stats }) {
  const [mounted, setMounted] = useState(false)
  const [chartColors, setChartColors] = useState({
    chart1: "#3b82f6",
    chart2: "#8b5cf6",
    chart3: "#ec4899",
  })

  useEffect(() => {
    const colors = {
      chart1: getComputedStyle(document.documentElement).getPropertyValue("--color-chart-1").trim() || "#3b82f6",
      chart2: getComputedStyle(document.documentElement).getPropertyValue("--color-chart-2").trim() || "#8b5cf6",
      chart3: getComputedStyle(document.documentElement).getPropertyValue("--color-chart-3").trim() || "#ec4899",
    }
    setChartColors(colors)
    setMounted(true)
  }, [])

  const testTypeData = [
    { name: "Unit Tests", value: stats.unit.testFileCount, color: "var(--color-chart-1)" },
    { name: "Integration Tests", value: stats.integration.testFileCount, color: "var(--color-chart-2)" },
    { name: "E2E Tests", value: stats.e2e.testFileCount, color: "var(--color-chart-3)" },
  ]

  const coverageStateData = [
    { name: "Fully Covered", value: stats.featureCoverage.fullyCovered, fill: "hsl(120, 100%, 40%)" },
    { name: "Partially Covered", value: stats.featureCoverage.partiallyCovered, fill: "hsl(45, 93%, 50%)" },
    { name: "No Coverage", value: stats.featureCoverage.noAutomatedCoverage, fill: "hsl(0, 84%, 60%)" },
  ]

  const featuresCoveredData = [
    { name: "Unit", value: stats.unit.featuresCovered },
    { name: "Integration", value: stats.integration.featuresCovered },
    { name: "E2E", value: stats.e2e.featuresCovered },
  ]

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border animate-pulse h-80" />
        <Card className="bg-card border-border animate-pulse h-80" />
        <Card className="bg-card border-border animate-pulse h-80 lg:col-span-2" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Test Files Distribution */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Test Files Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={testTypeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-foreground)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" fill={chartColors.chart1} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Feature Coverage State */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Feature Coverage State</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="w-full">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={coverageStateData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {coverageStateData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-foreground)",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Features Covered by Test Type */}
      <Card className="bg-card border-border lg:col-span-2">
        <CardHeader>
          <CardTitle>Features Covered by Test Type</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={featuresCoveredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-foreground)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" fill={chartColors.chart2} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
