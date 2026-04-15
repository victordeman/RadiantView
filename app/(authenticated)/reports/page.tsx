"use client"

import { FileText } from "lucide-react"

export default function ReportsPage() {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Create and manage diagnostic reports</p>
      </div>
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
        <FileText className="size-16 mb-4 opacity-30" />
        <p className="text-lg font-medium">Reports Module</p>
        <p className="text-sm">Structured reporting with templates coming in Phase 4.</p>
      </div>
    </div>
  )
}
