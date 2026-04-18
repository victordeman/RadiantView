"use client"

import { Badge } from "@/components/ui/badge"

interface PatientHeaderBarProps {
  patientName?: string
  patientId?: string
  dob?: string
  gender?: string
  modality?: string
  studyDate?: string
  studyDescription?: string
  accessionNumber?: string
  seriesCount?: number
  imageCount?: number
}

export function PatientHeaderBar({
  patientName,
  patientId,
  dob,
  gender,
  modality,
  studyDate,
  studyDescription,
  accessionNumber,
  seriesCount,
  imageCount,
}: PatientHeaderBarProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A"
    try {
      // Handle YYYYMMDD format
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
    <div className="flex items-center gap-6 px-4 py-2 bg-slate-900/60 border-b border-border text-sm overflow-x-auto">
      {/* Patient Info */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-xs">
          {patientName
            ? patientName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)
            : "?"}
        </div>
        <div>
          <p className="font-semibold text-foreground leading-tight">
            {patientName || "Unknown Patient"}
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            {patientId || "N/A"}
          </p>
        </div>
      </div>

      {/* Patient Details */}
      {(dob || gender) && (
        <div className="flex items-center gap-3 text-muted-foreground shrink-0">
          {dob && <span>DOB: {formatDate(dob)}</span>}
          {gender && <span>{gender}</span>}
        </div>
      )}

      {/* Divider */}
      <div className="w-px h-6 bg-border shrink-0" />

      {/* Study Info */}
      <div className="flex items-center gap-3 shrink-0">
        {modality && (
          <Badge variant="outline" className="font-mono text-xs">
            {modality}
          </Badge>
        )}
        {studyDate && (
          <span className="text-muted-foreground">{formatDate(studyDate)}</span>
        )}
        {studyDescription && (
          <span className="text-foreground font-medium">{studyDescription}</span>
        )}
        {accessionNumber && accessionNumber !== "N/A" && (
          <span className="text-muted-foreground text-xs font-mono">
            Acc# {accessionNumber}
          </span>
        )}
      </div>

      {/* Series/Image Count */}
      {(seriesCount !== undefined || imageCount !== undefined) && (
        <>
          <div className="w-px h-6 bg-border shrink-0" />
          <div className="flex items-center gap-2 text-muted-foreground text-xs shrink-0">
            {seriesCount !== undefined && <span>{seriesCount} series</span>}
            {imageCount !== undefined && <span>{imageCount} images</span>}
          </div>
        </>
      )}
    </div>
  )
}
