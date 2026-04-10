import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Topbar } from "@/components/topbar";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "RadiantView",
  description: "Medical Imaging Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", "font-sans", geist.variable)} style={{ colorScheme: 'dark' }}>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <TooltipProvider>
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <div className="flex flex-col w-full">
                <Topbar />
                <main className="flex-1 p-6">
                  {children}
                </main>
              </div>
            </div>
          </SidebarProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
