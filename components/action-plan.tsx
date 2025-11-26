"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ActionItem {
  description: string
  criticality: "High" | "Medium" | "Low"
}

interface ActionPlanProps {
  actionPlan: ActionItem[]
}

const criticityConfig = {
  High: {
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    borderColor: "border-red-200 dark:border-red-900/50",
    badgeColor: "bg-red-100 dark:bg-red-900/40 text-red-900 dark:text-red-100",
    symbol: "⚠",
  },
  Medium: {
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
    borderColor: "border-amber-200 dark:border-amber-900/50",
    badgeColor: "bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-100",
    symbol: "⚠",
  },
  Low: {
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-900/50",
    badgeColor: "bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100",
    symbol: "ℹ",
  },
}

export default function ActionPlan({ actionPlan }: ActionPlanProps) {
  const groupByCriticality = (items: ActionItem[]) => {
    return {
      High: items.filter((i) => i.criticality === "High"),
      Medium: items.filter((i) => i.criticality === "Medium"),
      Low: items.filter((i) => i.criticality === "Low"),
    }
  }

  const grouped = groupByCriticality(actionPlan)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-red-900 dark:text-red-200">Critical Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-900 dark:text-red-100">{grouped.High.length}</div>
            <p className="text-xs text-red-700 dark:text-red-300 mt-1">High criticality items</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-amber-900 dark:text-amber-200">Important Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900 dark:text-amber-100">{grouped.Medium.length}</div>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">Medium criticality items</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-blue-900 dark:text-blue-200">Nice to Have</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{grouped.Low.length}</div>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">Low criticality items</p>
          </CardContent>
        </Card>
      </div>

      {(["High", "Medium", "Low"] as const).map((criticality) => {
        const items = grouped[criticality]
        if (items.length === 0) return null

        const config = criticityConfig[criticality]

        return (
          <Card key={criticality} className={`border ${config.borderColor} ${config.bgColor}`}>
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className={`text-2xl ${config.color}`}>{config.symbol}</span>
                {criticality} Criticality
              </CardTitle>
              <CardDescription>{items.length} action items</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors items-center"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <span className={`text-lg ${config.color}`}>✓</span>
                    </div>
                    <div className="flex-1 flex items-center">
                      <p className="text-foreground font-medium">{item.description}</p>
                    </div>
                    <div
                      className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${config.badgeColor} flex items-center justify-center`}
                    >
                      {criticality}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
