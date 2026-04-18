"use client"

import { Monitor, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ViewerIndexPage() {
  return (
    <div className="flex flex-col h-screen bg-slate-950">
      <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 border-b border-border">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" />
            <span>Back to Worklist</span>
          </Button>
        </Link>
        <div className="w-px h-6 bg-border" />
        <span className="text-sm font-semibold text-foreground">DICOM Viewer</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <Monitor className="size-20 text-muted-foreground/20 mb-6" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Image Viewer</h1>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          Select a study from the Worklist or Patients page to view DICOM images in the zero-footprint viewer.
        </p>
        <Link href="/dashboard">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Go to Worklist
          </Button>
        </Link>
      </div>
    </div>
  )
}
