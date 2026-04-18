"use client"

import { Monitor, ImageIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ViewerPlaceholderProps {
  patientName?: string
  patientId?: string
  modality?: string
  studyDate?: string
  studyDescription?: string
  studyInstanceUid?: string
}

export function ViewerPlaceholder({
  patientName,
  patientId,
  modality,
  studyDate,
  studyDescription,
  studyInstanceUid,
}: ViewerPlaceholderProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null
    try {
      if (/^\d{8}$/.test(dateStr)) {
        const d = new Date(
          `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`
        )
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      }
      const d = new Date(dateStr)
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="flex flex-1 bg-slate-950">
      {/* Mock Series Thumbnails Strip */}
      <div className="hidden md:flex flex-col w-20 bg-slate-900/80 border-r border-border p-2 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`aspect-square rounded bg-slate-800 border ${
              i === 0 ? "border-primary/50" : "border-border/50"
            } flex items-center justify-center`}
          >
            <ImageIcon className="size-5 text-muted-foreground/30" />
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="flex flex-col items-center gap-6 max-w-lg text-center">
          <div className="relative">
            <Monitor className="size-20 text-muted-foreground/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                <ImageIcon className="size-4 text-primary/50" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">DICOM Viewer</h2>
            <p className="text-muted-foreground text-sm">
              Connect to an Orthanc server to view DICOM images
            </p>
            <p className="text-muted-foreground/60 text-xs">
              Set <code className="text-primary/60 bg-primary/5 px-1 py-0.5 rounded">ORTHANC_URL</code> in your environment to enable the viewer
            </p>
          </div>

          {/* Study Metadata Cards */}
          {(patientName || studyInstanceUid) && (
            <div className="w-full mt-4 space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Study Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {patientName && (
                  <MetadataCard label="Patient" value={patientName} />
                )}
                {patientId && (
                  <MetadataCard label="Patient ID" value={patientId} mono />
                )}
                {modality && (
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-border/50">
                    <p className="text-xs text-muted-foreground mb-1">Modality</p>
                    <Badge variant="outline" className="font-mono">
                      {modality}
                    </Badge>
                  </div>
                )}
                {studyDate && (
                  <MetadataCard
                    label="Study Date"
                    value={formatDate(studyDate) || studyDate}
                  />
                )}
                {studyDescription && (
                  <MetadataCard
                    label="Description"
                    value={studyDescription}
                    className="sm:col-span-2"
                  />
                )}
                {studyInstanceUid && (
                  <MetadataCard
                    label="Study Instance UID"
                    value={studyInstanceUid}
                    mono
                    className="sm:col-span-2"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MetadataCard({
  label,
  value,
  mono,
  className,
}: {
  label: string
  value: string
  mono?: boolean
  className?: string
}) {
  return (
    <div className={`p-3 rounded-lg bg-slate-900/80 border border-border/50 ${className || ""}`}>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`text-sm text-foreground truncate ${mono ? "font-mono" : "font-medium"}`}>
        {value}
      </p>
    </div>
  )
}
