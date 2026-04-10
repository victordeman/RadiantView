export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to RadiantView. Here is an overview of today&apos;s activity.</p>
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
