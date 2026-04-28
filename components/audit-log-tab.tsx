"use client"

import { useState, useEffect, useCallback } from "react"
import { ClipboardList, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface AuditEntry {
  id: string
  action: string
  resource: string
  details: string | null
  createdAt: string
  user: { name: string | null; email: string | null }
}

const actionColors: Record<string, string> = {
  USER_LOGIN: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  USER_LOGOUT: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  USER_CREATED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  USER_UPDATED: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  USER_DELETED: "bg-red-500/10 text-red-400 border-red-500/20",
  REPORT_CREATED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  REPORT_UPDATED: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  REPORT_SIGNED: "bg-primary/10 text-primary border-primary/20",
  REPORT_DELETED: "bg-red-500/10 text-red-400 border-red-500/20",
  VIEWER_ACCESS: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  PATIENT_CREATED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  ORDER_CREATED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
}

export function AuditLogTab() {
  const [logs, setLogs] = useState<AuditEntry[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [offset, setOffset] = useState(0)
  const limit = 20

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/audit?limit=${limit}&offset=${offset}`)
      if (res.ok) {
        const data = await res.json()
        setLogs(data.logs)
        setTotal(data.total)
      }
    } catch (error) {
      console.error("Failed to fetch audit logs:", error)
    } finally {
      setLoading(false)
    }
  }, [offset])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <ClipboardList className="size-8 opacity-50" />
                  <p>No audit logs recorded yet.</p>
                  <p className="text-xs">Actions like login, report signing, and user management will appear here.</p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {offset + 1}–{Math.min(offset + limit, total)} of {total} entries
        </p>
        <Button variant="ghost" size="sm" onClick={fetchLogs}>
          <RefreshCw className="mr-2 size-3.5" />
          Refresh
        </Button>
      </div>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead className="hidden md:table-cell">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id} className="hover:bg-muted/50">
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="font-medium text-sm">
                  {log.user.name || log.user.email || "System"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-mono ${actionColors[log.action] || ""}`}
                  >
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                  {log.resource}
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground max-w-[250px] truncate">
                  {log.details || "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {total > limit && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={offset === 0}
            onClick={() => setOffset(Math.max(0, offset - limit))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={offset + limit >= total}
            onClick={() => setOffset(offset + limit)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
