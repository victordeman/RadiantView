"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, User, FileText, Calendar, ListTodo } from "lucide-react"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface SearchResult {
  id: string
  type: "patient" | "study" | "report" | "order"
  title: string
  subtitle: string
  href: string
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Ctrl+K / Cmd+K to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen(true)
      }
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [])

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([])
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      if (res.ok) {
        const data = await res.json()
        setResults(data)
      }
    } catch {
      console.error("Search failed")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300)
    return () => clearTimeout(timer)
  }, [query, search])

  const handleSelect = (result: SearchResult) => {
    setOpen(false)
    setQuery("")
    router.push(result.href)
  }

  const iconMap = {
    patient: User,
    study: FileText,
    report: FileText,
    order: ListTodo,
  }

  const labelMap = {
    patient: "Patient",
    study: "Study",
    report: "Report",
    order: "Order",
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[550px] p-0 gap-0 overflow-hidden">
        <div className="flex items-center border-b border-border px-4">
          <Search className="size-4 text-muted-foreground shrink-0" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patients, studies, reports, orders..."
            className="border-0 focus-visible:ring-0 h-12 text-base bg-transparent"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>
        <div className="max-h-[300px] overflow-y-auto p-2">
          {loading && (
            <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
              Searching...
            </div>
          )}
          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-6 text-sm text-muted-foreground">
              <Search className="size-8 mb-2 opacity-30" />
              <p>No results found for &quot;{query}&quot;</p>
            </div>
          )}
          {!loading && results.length > 0 && (
            <div className="space-y-1">
              {results.map((result) => {
                const Icon = iconMap[result.type]
                return (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleSelect(result)}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary shrink-0">
                      <Icon className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{result.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground uppercase font-medium px-1.5 py-0.5 rounded bg-muted/50">
                      {labelMap[result.type]}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
          {!loading && query.length < 2 && (
            <div className="flex flex-col items-center justify-center py-6 text-sm text-muted-foreground">
              <Calendar className="size-8 mb-2 opacity-30" />
              <p>Type at least 2 characters to search</p>
              <p className="text-xs mt-1">Search across patients, studies, reports & orders</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
