import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Topbar } from "@/components/topbar";
import { BottomNav } from "@/components/bottom-nav";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col w-full">
          <Topbar />
          <main className="flex-1 p-4 md:p-6 mb-16 md:mb-0">
            {children}
          </main>
        </div>
        <BottomNav />
      </div>
    </SidebarProvider>
  );
}
