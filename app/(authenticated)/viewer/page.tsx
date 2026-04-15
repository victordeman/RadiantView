"use client"

import { Monitor } from "lucide-react"

export default function ViewerPage() {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Image Viewer</h1>
        <p className="text-muted-foreground">Zero-footprint DICOM diagnostic viewer</p>
      </div>
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
        <Monitor className="size-16 mb-4 opacity-30" />
        <p className="text-lg font-medium">PACS Viewer</p>
        <p className="text-sm">OHIF Viewer integration coming in Phase 3.</p>
        <p className="text-sm mt-1">Select a study from the Worklist to view images.</p>
      </div>
    </div>
  )
}
