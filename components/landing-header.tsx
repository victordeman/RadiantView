import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LandingHeader() {
  return (
    <header className="px-6 h-20 flex items-center bg-transparent absolute top-0 w-full z-50">
      <Link className="flex items-center justify-center" href="/">
        <span className="font-bold text-2xl tracking-tight text-white uppercase italic">RadiantView</span>
      </Link>
      <nav className="ml-auto flex items-center">
        <Link href="/register">
          <Button className="bg-bright-blue hover:bg-bright-blue/90 text-white font-bold px-8 py-6 rounded-md text-sm tracking-widest uppercase">
            Join Us Today
          </Button>
        </Link>
      </nav>
    </header>
  );
}
