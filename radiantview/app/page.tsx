import { Plus, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="space-y-10 pb-20 md:pb-0">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to RadiantView. Here is an overview of today&apos;s activity.</p>
      </div>

      {/* Quick Action Hubs */}
      <div className="flex flex-wrap justify-center md:justify-start gap-8">
        <div className="flex flex-col items-center gap-3 group">
          <Button
            className="h-24 w-24 rounded-full bg-card border-2 border-primary/20 hover:border-primary hover:bg-primary/10 text-primary transition-all duration-300 shadow-[0_0_20px_rgba(45,212,191,0.1)] hover:shadow-[0_0_30px_rgba(45,212,191,0.2)]"
            variant="outline"
          >
            <Plus className="size-10" />
          </Button>
          <span className="text-sm font-semibold tracking-wide">New Order</span>
        </div>

        <div className="flex flex-col items-center gap-3 group">
          <Button
            className="h-24 w-24 rounded-full bg-card border-2 border-primary/20 hover:border-primary hover:bg-primary/10 text-primary transition-all duration-300 shadow-[0_0_20px_rgba(45,212,191,0.1)] hover:shadow-[0_0_30px_rgba(45,212,191,0.2)]"
            variant="outline"
          >
            <Monitor className="size-10" />
          </Button>
          <span className="text-sm font-semibold tracking-wide">Image Viewer</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Studies", value: "1,284", change: "+12%" },
          { label: "Pending Reports", value: "43", change: "-5%" },
          { label: "Active Clinicians", value: "12", change: "+2" },
          { label: "System Status", value: "Optimal", change: "100%" },
        ].map((stat, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <div className="flex items-baseline gap-2 mt-2">
              <h2 className="text-2xl font-bold">{stat.value}</h2>
              <span className="text-xs font-medium text-primary">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm h-64 flex items-center justify-center border-dashed">
        <p className="text-muted-foreground">Recent Activity Chart Placeholder</p>
      </div>
    </div>
  );
}
