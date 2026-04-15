"use client"

import { BarChart3 } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Operational insights and performance metrics</p>
      </div>
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
        <BarChart3 className="size-16 mb-4 opacity-30" />
        <p className="text-lg font-medium">Analytics Dashboard</p>
        <p className="text-sm">Charts and operational metrics coming in Phase 4.</p>
      </div>
    </div>
  )
}
