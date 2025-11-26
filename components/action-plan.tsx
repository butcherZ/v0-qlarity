"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface ActionItem {
  description: string
  criticality: "High" | "Medium" | "Low"
}

interface ActionPlanProps {
  actionPlan: ActionItem[]
  fullCoverageData?: any
}

const criticityConfig = {
  High: {
    color: "text-[oklch(0.60_0.28_25)]",
    bgColor: "bg-[oklch(0.20_0.08_25)]/30 backdrop-blur-sm",
    borderColor: "border-[oklch(0.55_0.25_25)]/50",
    badgeColor: "bg-[oklch(0.55_0.25_25)]/20 text-[oklch(0.65_0.28_25)] border border-[oklch(0.55_0.25_25)]/30",
    symbol: "🔴",
  },
  Medium: {
    color: "text-[oklch(0.75_0.18_90)]",
    bgColor: "bg-[oklch(0.20_0.08_90)]/30 backdrop-blur-sm",
    borderColor: "border-[oklch(0.75_0.18_90)]/50",
    badgeColor: "bg-[oklch(0.75_0.18_90)]/20 text-[oklch(0.80_0.20_100)] border border-[oklch(0.75_0.18_90)]/30",
    symbol: "🟡",
  },
  Low: {
    color: "text-primary",
    bgColor: "bg-primary/10 backdrop-blur-sm",
    borderColor: "border-primary/50",
    badgeColor: "bg-primary/20 text-primary border border-primary/30",
    symbol: "🔵",
  },
}

export default function ActionPlan({ actionPlan, fullCoverageData }: ActionPlanProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const groupByCriticality = (items: ActionItem[]) => {
    return {
      High: items.filter((i) => i.criticality === "High"),
      Medium: items.filter((i) => i.criticality === "Medium"),
      Low: items.filter((i) => i.criticality === "Low"),
    }
  }

  const grouped = groupByCriticality(actionPlan)

  const handleGenerateTickets = async () => {
    setIsLoading(true)
    setSuccessMessage(null)

    try {
      const projectName = fullCoverageData?.context?.repository || "unknown-project"

      const response = await fetch("https://n8n.tools.strapi.team/webhook-test/09da57f1-1d74-408e-922d-04dbe7915796", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName,
          actionPlan,
          fullCoverageData: fullCoverageData || null,
        }),
      })

      if (response.ok) {
        setSuccessMessage("Tickets generated successfully!")
        setTimeout(() => setSuccessMessage(null), 3000)
      } else {
        throw new Error("Failed to generate tickets")
      }
    } catch (error) {
      console.error("Error generating tickets:", error)
      setSuccessMessage("Failed to generate tickets")
      setTimeout(() => setSuccessMessage(null), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">🚀 Mission Action Plan</h2>
          <p className="text-sm text-muted-foreground mt-1">Strategic actions to improve test coverage</p>
        </div>
        <div className="flex items-center gap-3">
          {successMessage && (
            <span
              className={`text-sm font-medium ${successMessage.includes("success") ? "text-primary" : "text-destructive"}`}
            >
              {successMessage}
            </span>
          )}
          <Button
            onClick={handleGenerateTickets}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
          >
            {isLoading ? "Generating..." : "🎫 Generate Tickets and Test"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-[oklch(0.55_0.25_25)]/50 bg-[oklch(0.20_0.08_25)]/30 backdrop-blur-sm shadow-lg shadow-[oklch(0.55_0.25_25)]/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-[oklch(0.65_0.28_25)] flex items-center gap-2">
              🚨 Critical Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[oklch(0.65_0.28_25)]">{grouped.High.length}</div>
            <p className="text-xs text-muted-foreground mt-1">High priority missions</p>
          </CardContent>
        </Card>

        <Card className="border-[oklch(0.75_0.18_90)]/50 bg-[oklch(0.20_0.08_90)]/30 backdrop-blur-sm shadow-lg shadow-[oklch(0.75_0.18_90)]/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-[oklch(0.80_0.20_100)] flex items-center gap-2">
              ⚠️ Important Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[oklch(0.80_0.20_100)]">{grouped.Medium.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Medium priority missions</p>
          </CardContent>
        </Card>

        <Card className="border-primary/50 bg-primary/10 backdrop-blur-sm shadow-lg shadow-primary/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-primary flex items-center gap-2">💫 Nice to Have</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{grouped.Low.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Low priority missions</p>
          </CardContent>
        </Card>
      </div>

      {(["High", "Medium", "Low"] as const).map((criticality) => {
        const items = grouped[criticality]
        if (items.length === 0) return null

        const config = criticityConfig[criticality]

        return (
          <Card key={criticality} className={`border ${config.borderColor} ${config.bgColor}`}>
            <CardHeader className="border-b border-border/50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="text-2xl">{config.symbol}</span>
                {criticality} Criticality Missions
              </CardTitle>
              <CardDescription>{items.length} action items in queue</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 p-4 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 hover:border-primary/30 transition-all items-center group"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <span className="text-lg group-hover:scale-110 transition-transform inline-block">🎯</span>
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
