"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Search, User as UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface PatientStudy {
  id: string
  studyInstanceUid: string
  modality: string | null
  studyDate: string | null
  studyDescription: string | null
}

interface Patient {
  id: string
  patientId: string
  name: string
  dob: string
  gender: string
  createdAt: string
  studies: PatientStudy[]
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [formData, setFormData] = useState({ patientId: "", name: "", dob: "", gender: "Male" })
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchPatients = useCallback(async () => {
    try {
      const url = searchQuery
        ? `/api/patients?search=${encodeURIComponent(searchQuery)}`
        : "/api/patients"
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setPatients(data)
      }
    } catch (error) {
      console.error("Failed to fetch patients:", error)
    } finally {
      setLoading(false)
    }
  }, [searchQuery])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPatients()
    }, 300)
    return () => clearTimeout(timer)
  }, [fetchPatients])

  const handleAddPatient = async () => {
    setFormError(null)
    if (!formData.patientId || !formData.name || !formData.dob || !formData.gender) {
      setFormError("All fields are required.")
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setAddDialogOpen(false)
        setFormData({ patientId: "", name: "", dob: "", gender: "Male" })
        fetchPatients()
      } else {
        const text = await res.text()
        setFormError(text || "Failed to create patient.")
      }
    } catch {
      setFormError("Something went wrong.")
    } finally {
      setSubmitting(false)
    }
  }

  const openPatientDetail = async (patient: Patient) => {
    try {
      const res = await fetch(`/api/patients/${patient.id}`)
      if (res.ok) {
        const data = await res.json()
        setSelectedPatient(data)
      } else {
        setSelectedPatient(patient)
      }
    } catch {
      setSelectedPatient(patient)
    }
    setSheetOpen(true)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground">Manage patient records</p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger render={<Button className="bg-primary text-primary-foreground hover:bg-primary/90" />}>
            <Plus className="mr-2 size-4" />
            Add Patient
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Patient</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              {formError && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                  {formError}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="add-patientId">Patient ID</Label>
                <Input id="add-patientId" placeholder="PT-00001" value={formData.patientId} onChange={(e) => setFormData({ ...formData, patientId: e.target.value })} className="bg-background border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-name">Full Name</Label>
                <Input id="add-name" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-background border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-dob">Date of Birth</Label>
                <Input id="add-dob" type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} className="bg-background border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-gender">Gender</Label>
                <select id="add-gender" className="w-full h-10 px-3 py-2 rounded-md bg-background border border-border text-sm" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <DialogClose render={<Button variant="outline" className="flex-1" />}>Cancel</DialogClose>
                <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleAddPatient} disabled={submitting}>
                  {submitting ? "Creating..." : "Create Patient"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name or patient ID..."
          className="pl-9 bg-card border-border/50 focus-visible:ring-primary/50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Patient Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-5 rounded-xl bg-card border border-border space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      ) : patients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <UserIcon className="size-12 mb-4 opacity-50" />
          <p className="text-lg font-medium">No patients found</p>
          <p className="text-sm">Try adjusting your search or add a new patient.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {patients.map((patient) => (
            <div
              key={patient.id}
              onClick={() => openPatientDetail(patient)}
              className="p-5 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-sm">
                  {getInitials(patient.name)}
                </div>
                <div>
                  <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{patient.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{patient.patientId}</p>
                </div>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>DOB: {new Date(patient.dob).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                <p>Gender: {patient.gender}</p>
                <p className="text-xs">
                  {patient.studies && patient.studies.length > 0
                    ? `${patient.studies.length} ${patient.studies.length === 1 ? "study" : "studies"}`
                    : "No studies"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Patient Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedPatient && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary font-bold">
                    {getInitials(selectedPatient.name)}
                  </div>
                  <div>
                    <p className="text-lg font-bold">{selectedPatient.name}</p>
                    <p className="text-sm text-muted-foreground font-mono">{selectedPatient.patientId}</p>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">{new Date(selectedPatient.dob).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Gender</p>
                    <p className="font-medium">{selectedPatient.gender}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Studies</h3>
                  {selectedPatient.studies && selectedPatient.studies.length > 0 ? (
                    <div className="space-y-2">
                      {selectedPatient.studies.map((study) => (
                        <div key={study.id} className="p-3 rounded-lg bg-card border border-border flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="font-mono">{study.modality || "N/A"}</Badge>
                            <div>
                              <p className="text-sm font-medium">{study.studyDescription || "No description"}</p>
                              <p className="text-xs text-muted-foreground">
                                {study.studyDate ? new Date(study.studyDate).toLocaleDateString() : "N/A"}
                              </p>
                            </div>
                          </div>
                          <Link href={`/viewer/${study.studyInstanceUid}?patientName=${encodeURIComponent(selectedPatient.name)}&patientId=${encodeURIComponent(selectedPatient.patientId)}&modality=${encodeURIComponent(study.modality || "")}&date=${encodeURIComponent(study.studyDate || "")}&description=${encodeURIComponent(study.studyDescription || "")}`}>
                            <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
                              View
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No studies found for this patient.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
