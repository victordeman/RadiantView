import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LandingHeader() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
      <Link className="flex items-center justify-center" href="/">
        <span className="font-bold text-2xl tracking-tight text-primary">RadiantView</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
        <Link className="text-sm font-medium hover:text-primary transition-colors hidden md:block" href="/#features">
          Features
        </Link>
        <Link className="text-sm font-medium hover:text-primary transition-colors hidden md:block" href="/#testimonials">
          Testimonials
        </Link>
        <Link href="/login">
          <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
            Sign In
          </Button>
        </Link>
      </nav>
    </header>
  );
}
