"use client"

import { WifiOff, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-sm">
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-card border border-border">
            <WifiOff className="size-10 text-muted-foreground" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">You&apos;re Offline</h1>
          <p className="text-muted-foreground">
            RadiantView requires an internet connection to access patient data and DICOM images.
          </p>
        </div>
        <Button
          onClick={() => window.location.reload()}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <RefreshCw className="mr-2 size-4" />
          Try Again
        </Button>
      </div>
    </div>
  )
}
