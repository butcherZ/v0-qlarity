"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function TestMetrics({ label, value, total }: { label: string; value: number; total?: number }) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-bold text-foreground">{value}</div>
          {total && <div className="text-sm text-muted-foreground">of {total}</div>}
        </div>
      </CardContent>
    </Card>
  )
}
