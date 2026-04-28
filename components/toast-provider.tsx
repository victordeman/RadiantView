"use client"

import { Toaster } from "sonner"

export function ToastProvider() {
  return (
    <Toaster
      theme="dark"
      position="bottom-right"
      toastOptions={{
        style: {
          background: "#0f172a",
          border: "1px solid #1e293b",
          color: "#f8fafc",
        },
      }}
    />
  )
}
