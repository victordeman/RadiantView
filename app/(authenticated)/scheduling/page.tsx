"use client"

import { useState, useEffect, useCallback } from "react"
import { Calendar, dateFnsLocalizer, Views, type Event } from "react-big-calendar"
import { format, parse, startOfWeek, getDay, addMinutes } from "date-fns"
import { enUS } from "date-fns/locale/en-US"
import { Plus, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import "react-big-calendar/lib/css/react-big-calendar.css"

const locales = { "en-US": enUS }
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales })

interface CalendarEvent extends Event {
  id: string
  patientName: string
  modality: string | null
  status: string
}

interface PatientOption {
  id: string
  patientId: string
  name: string
}

export default function SchedulingPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [patients, setPatients] = useState<PatientOption[]>([])
  const [patientSearch, setPatientSearch] = useState("")
  const [selectedPatientId, setSelectedPatientId] = useState("")
  const [formData, setFormData] = useState({
    startTime: "",
    duration: "30",
    modality: "CT",
    notes: "",
  })
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchAppointments = useCallback(async () => {
    try {
      const res = await fetch("/api/appointments")
      if (res.ok) {
        const data = await res.json()
        const mapped: CalendarEvent[] = data.map(
          (appt: {
            id: string
            startTime: string
            endTime: string
            modality: string | null
            status: string
            patient: { name: string }
          }) => ({
            id: appt.id,
            title: `${appt.modality || "APPT"} - ${appt.patient.name}`,
            start: new Date(appt.startTime),
            end: new Date(appt.endTime),
            patientName: appt.patient.name,
            modality: appt.modality,
            status: appt.status,
          })
        )
        setEvents(mapped)
      }
    } catch (error) {
      console.error("Failed to fetch appointments:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

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

  const handleCreateAppointment = async () => {
    setFormError(null)
    if (!selectedPatientId || !formData.startTime) {
      setFormError("Patient and start time are required.")
      return
    }
    setSubmitting(true)
    try {
      const start = new Date(formData.startTime)
      const end = addMinutes(start, parseInt(formData.duration))
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: selectedPatientId,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          modality: formData.modality,
          notes: formData.notes,
        }),
      })
      if (res.ok) {
        setDialogOpen(false)
        setFormData({ startTime: "", duration: "30", modality: "CT", notes: "" })
        setSelectedPatientId("")
        setPatientSearch("")
        fetchAppointments()
      } else {
        setFormError("Failed to create appointment.")
      }
    } catch {
      setFormError("Something went wrong.")
    } finally {
      setSubmitting(false)
    }
  }

  const eventStyleGetter = (event: CalendarEvent) => {
    const bgColor =
      event.modality === "CT"
        ? "#3b82f6"
        : event.modality === "MR"
          ? "#a855f7"
          : event.modality === "US"
            ? "#10b981"
            : event.modality === "CR"
              ? "#f59e0b"
              : event.modality === "XR"
                ? "#f97316"
                : "#2dd4bf"
    return {
      style: {
        backgroundColor: bgColor,
        borderRadius: "6px",
        opacity: 0.9,
        color: "white",
        border: "none",
        padding: "2px 6px",
        fontSize: "12px",
      },
    }
  }

  const todayEvents = events.filter((e) => {
    const today = new Date()
    return (
      e.start &&
      e.start.getFullYear() === today.getFullYear() &&
      e.start.getMonth() === today.getMonth() &&
      e.start.getDate() === today.getDate()
    )
  })

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
          <p className="text-muted-foreground">Manage appointments and imaging slots</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button className="bg-primary text-primary-foreground hover:bg-primary/90" />}>
            <Plus className="mr-2 size-4" />
            New Appointment
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>New Appointment</DialogTitle>
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
              <div className="space-y-2">
                <Label>Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="bg-background border-border"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <select
                    className="w-full h-10 px-3 py-2 rounded-md bg-background border border-border text-sm"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  >
                    <option value="15">15 min</option>
                    <option value="30">30 min</option>
                    <option value="45">45 min</option>
                    <option value="60">1 hour</option>
                  </select>
                </div>
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
              </div>
              <div className="space-y-2">
                <Label>Notes (optional)</Label>
                <Input
                  placeholder="Additional notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="bg-background border-border"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <DialogClose render={<Button variant="outline" className="flex-1" />}>Cancel</DialogClose>
                <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleCreateAppointment} disabled={submitting}>
                  {submitting ? "Creating..." : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-[500px] w-full rounded-xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Calendar */}
          <div className="rounded-xl border border-border bg-card p-4 overflow-hidden">
            <style>{`
              .rbc-calendar { background: transparent; color: #f8fafc; }
              .rbc-toolbar { margin-bottom: 16px; }
              .rbc-toolbar button { color: #94a3b8; background: transparent; border: 1px solid #1e293b; border-radius: 6px; padding: 4px 12px; font-size: 13px; }
              .rbc-toolbar button:hover { background: #1e293b; color: #f8fafc; }
              .rbc-toolbar button.rbc-active { background: #2dd4bf; color: #020617; border-color: #2dd4bf; }
              .rbc-header { background: #0f172a; border-bottom: 1px solid #1e293b; padding: 8px; color: #94a3b8; font-size: 13px; font-weight: 500; }
              .rbc-month-view, .rbc-time-view { border: 1px solid #1e293b; border-radius: 8px; overflow: hidden; }
              .rbc-month-row + .rbc-month-row { border-top: 1px solid #1e293b; }
              .rbc-day-bg { background: transparent; }
              .rbc-day-bg + .rbc-day-bg { border-left: 1px solid #1e293b; }
              .rbc-off-range-bg { background: #020617; }
              .rbc-today { background: rgba(45, 212, 191, 0.05) !important; }
              .rbc-date-cell { padding: 4px 8px; color: #94a3b8; font-size: 13px; }
              .rbc-date-cell.rbc-now { color: #2dd4bf; font-weight: 700; }
              .rbc-event { font-size: 12px !important; }
              .rbc-show-more { color: #2dd4bf; font-size: 12px; }
              .rbc-time-header { border-bottom: 1px solid #1e293b; }
              .rbc-time-content { border-top: none; }
              .rbc-timeslot-group { border-bottom: 1px solid #1e293b; }
              .rbc-time-slot { color: #64748b; font-size: 11px; }
              .rbc-current-time-indicator { background-color: #2dd4bf; }
              .rbc-time-gutter { background: #0f172a; }
              .rbc-label { color: #64748b; padding: 0 8px; }
              .rbc-allday-cell { display: none; }
              .rbc-time-header-content { border-left: 1px solid #1e293b; }
              .rbc-agenda-view table { color: #f8fafc; }
              .rbc-agenda-view table thead th { border-bottom: 1px solid #1e293b; color: #94a3b8; }
              .rbc-agenda-view table tbody tr { border-bottom: 1px solid #1e293b; }
              .rbc-agenda-view table tbody tr td { padding: 8px; }
            `}</style>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600 }}
              views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
              defaultView={Views.MONTH}
              eventPropGetter={eventStyleGetter}
              onSelectSlot={(slotInfo) => {
                const d = slotInfo.start
                const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T09:00`
                setFormData({ ...formData, startTime: iso })
                setDialogOpen(true)
              }}
              selectable
            />
          </div>

          {/* Today's Appointments */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Clock className="size-5 text-primary" />
              Today&apos;s Appointments
            </h3>
            {todayEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No appointments today.</p>
            ) : (
              <div className="space-y-3">
                {todayEvents.map((event) => (
                  <div key={event.id} className="p-3 rounded-lg bg-background border border-border/50">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline" className="font-mono text-xs">{event.modality || "N/A"}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {event.start ? format(event.start, "h:mm a") : ""}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{event.patientName}</p>
                    <p className="text-xs text-muted-foreground capitalize">{event.status.toLowerCase()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
