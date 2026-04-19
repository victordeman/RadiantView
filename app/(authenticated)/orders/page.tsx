"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Search, Filter, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

interface OrderPatient {
  name: string
  patientId: string
}

interface Order {
  id: string
  orderNumber: string
  status: string
  modality: string | null
  priority: string
  notes: string | null
  referringDoc: string | null
  patientId: string
  patient: OrderPatient
  createdAt: string
}

interface PatientOption {
  id: string
  patientId: string
  name: string
}

const statusTabs = ["All", "PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [patients, setPatients] = useState<PatientOption[]>([])
  const [patientSearch, setPatientSearch] = useState("")
  const [selectedPatientId, setSelectedPatientId] = useState("")
  const [formData, setFormData] = useState({
    modality: "CT",
    priority: "ROUTINE",
    referringDoc: "",
    notes: "",
  })
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchOrders = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter !== "All") params.set("status", statusFilter)
      const res = await fetch(`/api/orders?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  useEffect(() => {
    if (!patientSearch) {
      setPatients([])
      return
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/patients?search=${encodeURIComponent(patientSearch)}`)
        if (res.ok) {
          const data = await res.json()
          setPatients(data)
        }
      } catch {
        // ignore
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [patientSearch])

  const handleCreateOrder = async () => {
    setFormError(null)
    if (!selectedPatientId) {
      setFormError("Patient is required.")
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: selectedPatientId,
          modality: formData.modality,
          priority: formData.priority,
          referringDoc: formData.referringDoc || null,
          notes: formData.notes || null,
        }),
      })
      if (res.ok) {
        setDialogOpen(false)
        setFormData({ modality: "CT", priority: "ROUTINE", referringDoc: "", notes: "" })
        setSelectedPatientId("")
        setPatientSearch("")
        fetchOrders()
      } else {
        setFormError("Failed to create order.")
      }
    } catch {
      setFormError("Something went wrong.")
    } finally {
      setSubmitting(false)
    }
  }

  const filteredOrders = orders.filter((order) => {
    const q = searchQuery.toLowerCase()
    return (
      order.orderNumber.toLowerCase().includes(q) ||
      order.patient.name.toLowerCase().includes(q) ||
      (order.referringDoc && order.referringDoc.toLowerCase().includes(q))
    )
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Pending</Badge>
      case "IN_PROGRESS":
        return <Badge className="bg-sky-500/10 text-sky-500 border-sky-500/20">In Progress</Badge>
      case "COMPLETED":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Completed</Badge>
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "STAT":
        return <span className="text-destructive font-bold text-xs">STAT</span>
      case "HIGH":
        return <span className="text-orange-500 font-semibold text-xs">High</span>
      default:
        return <span className="text-muted-foreground text-xs">Routine</span>
    }
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1" data-tour="orders-heading">
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Create and track imaging orders</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button className="bg-primary text-primary-foreground hover:bg-primary/90" data-tour="new-order-btn" />}>
            <Plus className="mr-2 size-4" />
            New Order
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>New Imaging Order</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              {formError && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                  {formError}
                </div>
              )}
              <div className="space-y-2">
                <Label>Patient</Label>
                <Input
                  placeholder="Search patient by name..."
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  className="bg-background border-border"
                />
                {patients.length > 0 && (
                  <div className="border border-border rounded-md max-h-32 overflow-y-auto bg-card">
                    {patients.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setSelectedPatientId(p.id)
                          setPatientSearch(p.name)
                          setPatients([])
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex justify-between"
                      >
                        <span>{p.name}</span>
                        <span className="text-muted-foreground font-mono text-xs">{p.patientId}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Modality</Label>
                  <select
                    className="w-full h-10 px-3 py-2 rounded-md bg-background border border-border text-sm"
                    value={formData.modality}
                    onChange={(e) => setFormData({ ...formData, modality: e.target.value })}
                  >
                    {["CT", "MR", "US", "CR", "XR", "NM", "PT", "MG"].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <select
                    className="w-full h-10 px-3 py-2 rounded-md bg-background border border-border text-sm"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="STAT">STAT</option>
                    <option value="HIGH">High</option>
                    <option value="ROUTINE">Routine</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Referring Physician</Label>
                <Input
                  placeholder="Dr. Smith"
                  value={formData.referringDoc}
                  onChange={(e) => setFormData({ ...formData, referringDoc: e.target.value })}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label>Clinical Notes</Label>
                <Input
                  placeholder="Clinical indications..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="bg-background border-border"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <DialogClose render={<Button variant="outline" className="flex-1" />}>Cancel</DialogClose>
                <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleCreateOrder} disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Order"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-end md:items-center justify-between bg-card/50 p-4 rounded-xl border border-border/50">
        <div className="flex flex-1 items-center gap-2 w-full md:max-w-md" data-tour="order-search">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by order #, patient, or physician..."
              className="w-full pl-9 bg-background border-border/50 focus-visible:ring-primary/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0 border-border/50">
            <Filter className="size-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto" data-tour="order-status-tabs">
          {statusTabs.map((tab) => (
            <Button
              key={tab}
              variant="ghost"
              size="sm"
              className={tab === statusFilter ? "bg-primary/10 text-primary" : "text-muted-foreground"}
              onClick={() => setStatusFilter(tab)}
            >
              {tab === "IN_PROGRESS" ? "In Progress" : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </Button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden" data-tour="orders-table">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Modality</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Referring Doc</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <ShoppingCart className="size-8 opacity-50" />
                      <p>No orders found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-mono text-sm">{order.orderNumber}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{order.patient.name}</span>
                        <span className="text-xs text-muted-foreground">{order.patient.patientId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">{order.modality || "N/A"}</Badge>
                    </TableCell>
                    <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{order.referringDoc || "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
