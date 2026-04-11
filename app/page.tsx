import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  PlayCircle, 
  ArrowRight, 
  Database, 
  Monitor, 
  Smartphone, 
  Cpu, 
  Share2,
  CheckCircle2
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      {/* Navigation */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-slate-800/50">
        <Link className="flex items-center justify-center" href="#">
          <span className="font-bold text-2xl tracking-tight text-primary">RadiantView</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:text-primary transition-colors hidden md:block" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors hidden md:block" href="#testimonials">
            Testimonials
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
              Sign In
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-24 md:py-32 lg:py-48 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                  Cloud-Native Enterprise <br className="hidden md:block" /> Imaging Platform
                </h1>
                <p className="mx-auto max-w-[700px] text-slate-400 md:text-xl lg:text-2xl font-medium">
                  RIS + PACS + AI in one zero-footprint web app
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-semibold">
                  Request Demo
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 border-slate-700 hover:bg-slate-800 rounded-full font-semibold gap-2">
                  <PlayCircle className="size-5" />
                  Watch 2-min Video
                </Button>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full -z-10" />
        </section>

        {/* Features Grid */}
        <section id="features" className="w-full py-24 bg-slate-950 border-t border-slate-900">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Everything you need in one platform</h2>
              <div className="w-20 h-1 bg-primary rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Database, title: "RIS", desc: "Radiology Information System built for modern workflows." },
                { icon: Monitor, title: "PACS Viewer", desc: "Lightning-fast, zero-footprint diagnostic web viewer." },
                { icon: Smartphone, title: "Mobile Access", desc: "Access studies and reports from any device, anywhere." },
                { icon: Cpu, title: "AI Tools", desc: "Integrated AI for automated measurements and triage." },
                { icon: Share2, title: "Secure Collaboration", desc: "Instant clinical sharing and real-time consulting." },
                { icon: CheckCircle2, title: "Enterprise Scalability", desc: "Grows with your practice, from clinics to hospital networks." },
              ].map((feature, i) => (
                <div key={i} className="group relative p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-primary/50 transition-all duration-300">
                  <div className="mb-4 inline-flex p-3 rounded-lg bg-slate-950 text-primary border border-slate-800 group-hover:shadow-[0_0_15px_rgba(45,212,191,0.2)] transition-all">
                    <feature.icon className="size-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="w-full py-24 bg-slate-900/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">Trusted by leading <br className="hidden md:block" /> healthcare providers</h2>
                <p className="text-slate-400 text-lg mb-8">Join hundreds of practices that have transformed their imaging workflow with RadiantView.</p>
                <div className="flex gap-4">
                   <div className="flex -space-x-2">
                     {[1,2,3,4].map(i => (
                       <div key={i} className="size-10 rounded-full border-2 border-slate-950 bg-slate-800" />
                     ))}
                   </div>
                   <div className="text-sm">
                     <p className="font-bold">Over 500+ clinics</p>
                     <p className="text-slate-500">worldwide trust RadiantView</p>
                   </div>
                </div>
              </div>
              <div className="grid gap-6">
                <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 relative">
                  <p className="text-lg italic text-slate-300 relative z-10">
                    &quot;RadiantView has completely changed how our clinic operates. The speed of the web viewer is unmatched, and having RIS/PACS in one tab is a game changer.&quot;
                  </p>
                  <div className="mt-6">
                    <p className="font-bold">Dr. Sarah Chen</p>
                    <p className="text-sm text-slate-500">Chief of Radiology, Metro Health</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-24 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-6">Ready to upgrade your imaging?</h2>
            <p className="text-primary-foreground/80 text-xl mb-10 max-w-[600px] mx-auto">
              Get started today and see why top radiologists choose our zero-footprint platform.
            </p>
            <Button size="lg" variant="secondary" className="h-12 px-10 rounded-full font-bold text-lg">
              Get Started Now <ArrowRight className="ml-2 size-5" />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-slate-900 bg-slate-950">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <span className="font-bold text-xl tracking-tight text-primary">RadiantView</span>
              <p className="mt-4 text-sm text-slate-500 leading-relaxed">
                The next generation of cloud-native medical imaging solutions. Built for speed, security, and precision.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-slate-300">Platform</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link href="#">PACS Viewer</Link></li>
                <li><Link href="#">RIS</Link></li>
                <li><Link href="#">AI Marketplace</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-slate-300">Company</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link href="#">About Us</Link></li>
                <li><Link href="#">Contact</Link></li>
                <li><Link href="#">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-slate-300">Connect</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link href="#">LinkedIn</Link></li>
                <li><Link href="#">Twitter</Link></li>
                <li><Link href="#">Support</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-900 text-xs text-slate-600">
            <p>© 2024 RadiantView Inc. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
               <span>Made with precision for healthcare.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
