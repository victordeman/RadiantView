import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Providers } from "@/components/providers";
import { ToastProvider } from "@/components/toast-provider";
import { ServiceWorkerRegistration } from "@/components/sw-register";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "RadiantView | Cloud-Native Enterprise Imaging Platform",
  description: "RIS + PACS + AI in one zero-footprint web app. The next generation of medical imaging.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "RadiantView",
  },
};

export const viewport: Viewport = {
  themeColor: "#2dd4bf",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body className={`${inter.variable} font-sans antialiased bg-slate-950 text-slate-50`}>
        <Providers>
          <TooltipProvider>
            {children}
          </TooltipProvider>
          <ToastProvider />
          <ServiceWorkerRegistration />
        </Providers>
      </body>
    </html>
  );
}
