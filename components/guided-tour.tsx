"use client"

import { useEffect, useState, useCallback } from "react"
import { usePathname, useRouter } from "next/navigation"
import { driver, type DriveStep } from "driver.js"
import "driver.js/dist/driver.css"
import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

type TourId =
  | "dashboard"
  | "patients"
  | "scheduling"
  | "orders"
  | "viewer"
  | "full"

interface TourConfig {
  id: TourId
  label: string
  description: string
  startPath: string
  steps: DriveStep[]
}

const tourConfigs: TourConfig[] = [
  {
    id: "dashboard",
    label: "Worklist Tour",
    description: "Search, filter, and review diagnostic studies",
    startPath: "/dashboard",
    steps: [
      {
        element: "[data-tour='worklist-heading']",
        popover: {
          title: "Worklist",
          description:
            "This is your central worklist. All incoming diagnostic studies appear here for review and action.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "[data-tour='quick-action-order']",
        popover: {
          title: "Quick Action: New Order",
          description:
            "Click this hub to quickly create a new imaging order. It takes you directly to the Orders page.",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: "[data-tour='quick-action-viewer']",
        popover: {
          title: "Quick Action: Image Viewer",
          description:
            "Jump straight to the DICOM image viewer from here.",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: "[data-tour='worklist-search']",
        popover: {
          title: "Search Studies",
          description:
            "Type a patient name, ID, or accession number to instantly filter the worklist.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "[data-tour='modality-filters']",
        popover: {
          title: "Filter by Modality",
          description:
            "Click a modality button (CR, CT, MR, US) to show only studies of that type. Click 'All Modalities' to reset.",
          side: "bottom",
          align: "end",
        },
      },
      {
        element: "[data-tour='study-table']",
        popover: {
          title: "Study Table",
          description:
            "Each row shows a study with patient info, modality, date, status, and priority. Click 'View Images' to open the DICOM viewer for that study.",
          side: "top",
          align: "center",
        },
      },
    ],
  },
  {
    id: "patients",
    label: "Patients Tour",
    description: "Add patients, search, and view patient details",
    startPath: "/patients",
    steps: [
      {
        element: "[data-tour='patients-heading']",
        popover: {
          title: "Patients Page",
          description:
            "Manage all patient records from this page. You can search, add new patients, and view detailed patient information.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "[data-tour='add-patient-btn']",
        popover: {
          title: "Add a New Patient",
          description:
            "Click this button to open the Add Patient form. Fill in the Patient ID, Full Name, Date of Birth, and Gender, then click 'Create Patient'.",
          side: "left",
          align: "center",
        },
      },
      {
        element: "[data-tour='patient-search']",
        popover: {
          title: "Search Patients",
          description:
            "Type a name or patient ID to search. Results filter in real-time as you type.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "[data-tour='patient-grid']",
        popover: {
          title: "Patient Cards",
          description:
            "Each card shows a patient's name, ID, date of birth, and number of studies. Click any card to open a detailed side panel with all their studies.",
          side: "top",
          align: "center",
        },
      },
    ],
  },
  {
    id: "scheduling",
    label: "Scheduling Tour",
    description: "Create appointments and view the calendar",
    startPath: "/scheduling",
    steps: [
      {
        element: "[data-tour='schedule-heading']",
        popover: {
          title: "Scheduling Page",
          description:
            "View and manage all imaging appointments. The calendar shows color-coded appointments by modality.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "[data-tour='new-appointment-btn']",
        popover: {
          title: "Create a New Appointment",
          description:
            "Click here to schedule a new appointment. Search for a patient, pick a date/time, select a modality and duration, then click 'Create'.",
          side: "left",
          align: "center",
        },
      },
      {
        element: "[data-tour='schedule-calendar']",
        popover: {
          title: "Calendar View",
          description:
            "Switch between Month, Week, Day, and Agenda views using the toolbar buttons. Click on any empty slot to pre-fill a new appointment. Appointments are color-coded by modality (blue = CT, purple = MR, green = US, etc.).",
          side: "top",
          align: "center",
        },
      },
      {
        element: "[data-tour='today-appointments']",
        popover: {
          title: "Today's Appointments",
          description:
            "This sidebar shows all appointments scheduled for today with their time, modality, and status.",
          side: "left",
          align: "start",
        },
      },
    ],
  },
  {
    id: "orders",
    label: "Orders Tour",
    description: "Create and track imaging orders",
    startPath: "/orders",
    steps: [
      {
        element: "[data-tour='orders-heading']",
        popover: {
          title: "Orders Page",
          description:
            "Track all imaging orders here. You can filter by status, search, and create new orders.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "[data-tour='new-order-btn']",
        popover: {
          title: "Create a New Order",
          description:
            "Click to create a new imaging order. Search for a patient, select a modality (CT, MR, US, etc.), set priority (Routine, High, STAT), add a referring physician and clinical notes.",
          side: "left",
          align: "center",
        },
      },
      {
        element: "[data-tour='order-search']",
        popover: {
          title: "Search Orders",
          description:
            "Search by order number, patient name, or referring physician.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "[data-tour='order-status-tabs']",
        popover: {
          title: "Filter by Status",
          description:
            "Click a status tab to filter: All, Pending, In Progress, Completed, or Cancelled.",
          side: "bottom",
          align: "end",
        },
      },
      {
        element: "[data-tour='orders-table']",
        popover: {
          title: "Orders Table",
          description:
            "Each row shows the order number, patient, modality, priority, status, referring doctor, and creation date.",
          side: "top",
          align: "center",
        },
      },
    ],
  },
  {
    id: "viewer",
    label: "Viewer Tour",
    description: "View DICOM images with the built-in viewer",
    startPath: "/dashboard",
    steps: [
      {
        element: "[data-tour='study-table']",
        popover: {
          title: "Open the Image Viewer",
          description:
            "To view DICOM images, find a study in the worklist and click the 'View Images' button. This opens the full-screen DICOM viewer with the study pre-loaded.",
          side: "top",
          align: "center",
        },
      },
    ],
  },
]

const fullTourSteps: DriveStep[] = [
  {
    popover: {
      title: "Welcome to RadiantView! 🏥",
      description:
        "Let's take a quick tour of the platform. RadiantView combines RIS + PACS + AI in one zero-footprint web app. We'll walk through all the key features.",
    },
  },
  {
    element: "[data-tour='sidebar']",
    popover: {
      title: "Navigation Sidebar",
      description:
        "Use the sidebar to navigate between pages: Worklist, Patients, Schedule, Orders, Viewer, Reports, Analytics, and Admin. The sidebar collapses on smaller screens.",
      side: "right",
      align: "center",
    },
  },
  {
    element: "[data-tour='topbar-search']",
    popover: {
      title: "Global Search",
      description:
        "Use this search bar to quickly find patients and orders across the entire system.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='topbar-new-order']",
    popover: {
      title: "Quick New Order",
      description:
        "Click this button to create a new imaging order from anywhere in the app.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "[data-tour='topbar-notifications']",
    popover: {
      title: "Notifications",
      description:
        "Check your notifications here — urgent studies, report updates, and system alerts.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "[data-tour='topbar-user-menu']",
    popover: {
      title: "User Menu",
      description:
        "Click your avatar to access your profile, settings, or log out.",
      side: "bottom",
      align: "end",
    },
  },
  ...tourConfigs[0].steps, // Dashboard steps
]

export function GuidedTour() {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const startTour = useCallback(
    (tourId: TourId) => {
      setMenuOpen(false)

      if (tourId === "full") {
        // Full tour starts on dashboard
        if (pathname !== "/dashboard") {
          router.push("/dashboard")
          setTimeout(() => runTour(fullTourSteps), 800)
        } else {
          runTour(fullTourSteps)
        }
        return
      }

      const config = tourConfigs.find((t) => t.id === tourId)
      if (!config) return

      if (pathname !== config.startPath) {
        router.push(config.startPath)
        setTimeout(() => runTour(config.steps), 800)
      } else {
        runTour(config.steps)
      }
    },
    [pathname, router]
  )

  const runTour = (steps: DriveStep[]) => {
    const d = driver({
      showProgress: true,
      steps,
      nextBtnText: "Next →",
      prevBtnText: "← Back",
      doneBtnText: "Done ✓",
      popoverClass: "radiantview-tour-popover",
      stagePadding: 6,
      stageRadius: 8,
      allowClose: true,
      overlayColor: "rgba(0, 0, 0, 0.75)",
    })
    d.drive()
  }

  // Close menu on click outside
  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest("[data-tour-menu]")) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("click", handler, true)
    return () => document.removeEventListener("click", handler, true)
  }, [menuOpen])

  return (
    <>
      <style>{`
        .radiantview-tour-popover {
          background: #0f172a !important;
          border: 1px solid #1e293b !important;
          color: #f8fafc !important;
          border-radius: 12px !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
        }
        .radiantview-tour-popover .driver-popover-title {
          color: #f8fafc !important;
          font-size: 16px !important;
          font-weight: 700 !important;
        }
        .radiantview-tour-popover .driver-popover-description {
          color: #94a3b8 !important;
          font-size: 14px !important;
          line-height: 1.6 !important;
        }
        .radiantview-tour-popover .driver-popover-progress-text {
          color: #64748b !important;
        }
        .radiantview-tour-popover .driver-popover-prev-btn {
          color: #94a3b8 !important;
          border: 1px solid #334155 !important;
          background: transparent !important;
          border-radius: 6px !important;
          padding: 6px 14px !important;
          font-size: 13px !important;
        }
        .radiantview-tour-popover .driver-popover-prev-btn:hover {
          background: #1e293b !important;
          color: #f8fafc !important;
        }
        .radiantview-tour-popover .driver-popover-next-btn,
        .radiantview-tour-popover .driver-popover-close-btn-text {
          background: #2dd4bf !important;
          color: #020617 !important;
          border: none !important;
          border-radius: 6px !important;
          padding: 6px 14px !important;
          font-weight: 600 !important;
          font-size: 13px !important;
        }
        .radiantview-tour-popover .driver-popover-next-btn:hover,
        .radiantview-tour-popover .driver-popover-close-btn-text:hover {
          background: #14b8a6 !important;
        }
        .radiantview-tour-popover .driver-popover-arrow-side-left,
        .radiantview-tour-popover .driver-popover-arrow-side-right,
        .radiantview-tour-popover .driver-popover-arrow-side-top,
        .radiantview-tour-popover .driver-popover-arrow-side-bottom {
          border-color: #1e293b !important;
        }
        .radiantview-tour-popover .driver-popover-close-btn {
          color: #64748b !important;
        }
        .radiantview-tour-popover .driver-popover-close-btn:hover {
          color: #f8fafc !important;
        }
      `}</style>

      <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50" data-tour-menu>
        {menuOpen && (
          <div className="absolute bottom-14 right-0 w-72 rounded-xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="p-3 border-b border-border">
              <p className="text-sm font-semibold text-foreground">Guided Tours</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Choose a tour to learn how to use RadiantView
              </p>
            </div>
            <div className="p-1.5">
              <button
                onClick={() => startTour("full")}
                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-primary/10 transition-colors group"
              >
                <p className="text-sm font-medium text-primary group-hover:text-primary">
                  🚀 Full Platform Tour
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Complete walkthrough of all features
                </p>
              </button>
              <div className="h-px bg-border my-1" />
              {tourConfigs.map((tour) => (
                <button
                  key={tour.id}
                  onClick={() => startTour(tour.id)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <p className="text-sm font-medium text-foreground">{tour.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {tour.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
        <Button
          size="icon"
          className="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl transition-all"
          onClick={() => setMenuOpen(!menuOpen)}
          data-tour="tour-button"
        >
          <HelpCircle className="size-6" />
        </Button>
      </div>
    </>
  )
}
