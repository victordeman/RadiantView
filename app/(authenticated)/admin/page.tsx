"use client"

import { ShieldCheck } from "lucide-react"

export default function AdminPage() {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Administration</h1>
        <p className="text-muted-foreground">Manage users, roles, and system configuration</p>
      </div>
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
        <ShieldCheck className="size-16 mb-4 opacity-30" />
        <p className="text-lg font-medium">Admin Panel</p>
        <p className="text-sm">User management and system settings coming in Phase 4.</p>
      </div>
    </div>
  )
}
