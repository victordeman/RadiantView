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
import { LandingHeader } from "@/components/landing-header";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <LandingHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full min-h-screen flex items-center justify-center pt-20 bg-gradient-to-br from-navy via-navy to-cyan-accent overflow-hidden">
          <div className="container px-6 md:px-12 mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side: Content */}
              <div className="flex flex-col space-y-6 text-left">
                <div className="space-y-4">
                  <p className="text-white text-xs font-bold tracking-[0.3em] uppercase opacity-80">Our Mission</p>
                  <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl text-white leading-[1.1]">
                    Cloud-Native <br />
                    Enterprise <br />
                    Imaging Platform
                  </h1>
                  <p className="max-w-[600px] text-white/80 md:text-xl lg:text-2xl font-light">
                    RIS + PACS + AI in one zero-footprint web app
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button size="lg" variant="outline" className="h-14 px-8 border-white/30 text-white hover:bg-white/10 rounded-full font-semibold gap-2 transition-all">
                    <PlayCircle className="size-6" />
                    Watch 2-min Video
                  </Button>
                </div>
              </div>

              {/* Right Side: White Card */}
              <div className="flex justify-center lg:justify-end">
                <div className="w-full max-w-[480px] bg-white rounded-[2.5rem] shadow-2xl p-10 md:p-14 text-slate-900 flex flex-col items-center space-y-8">
                  <div className="flex flex-col items-center space-y-2">
                    <span className="font-bold text-3xl tracking-tight text-bright-blue uppercase">Explore Images</span>
                    <h2 className="text-2xl font-bold tracking-tight mt-4">Gain Insight</h2>
                    <p className="text-slate-500 font-medium">Start Here</p>
                  </div>

                  <div className="w-full space-y-4">
                    <div className="space-y-2">
                      <input
                        type="email"
                        placeholder="Enter your email address here"
                        className="w-full px-6 py-4 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-bright-blue outline-none text-slate-900 placeholder:text-slate-400 font-medium"
                      />
                    </div>
                    <Button className="w-full bg-bright-blue hover:bg-bright-blue/90 text-white font-bold h-14 rounded-xl text-lg tracking-wide uppercase">
                      Continue
                    </Button>
                  </div>

                  <div className="text-center">
                    <Link href="/request-demo" className="text-bright-blue font-bold hover:underline">
                      Request a Demo
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-accent/20 blur-[150px] rounded-full -z-0 opacity-50 translate-x-1/2 -translate-y-1/2" />
        </section>

        {/* Features Grid */}
        <section id="features" className="w-full py-32 bg-navy relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-accent/5 blur-[120px] rounded-full -z-0" />

          <div className="container px-6 md:px-12 mx-auto relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-20">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-white">Everything you need in one platform</h2>
              <div className="w-20 h-1.5 bg-bright-blue rounded-full" />
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
                <div key={i} className="group relative p-10 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-bright-blue/50 transition-all duration-500 backdrop-blur-md hover:translate-y-[-8px]">
                  <div className="mb-6 inline-flex p-4 rounded-2xl bg-bright-blue/10 text-bright-blue border border-bright-blue/20 group-hover:bg-bright-blue group-hover:text-white transition-all duration-300 shadow-lg group-hover:shadow-bright-blue/40">
                    <feature.icon className="size-7" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white tracking-tight">{feature.title}</h3>
                  <p className="text-white/50 leading-relaxed text-lg font-light">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="w-full py-32 bg-navy border-t border-white/5">
          <div className="container px-6 md:px-12 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-4xl font-bold tracking-tight sm:text-6xl mb-8 text-white leading-tight">Trusted by leading <br className="hidden md:block" /> healthcare providers</h2>
                <p className="text-white/60 text-xl mb-12 font-light leading-relaxed">Join hundreds of practices that have transformed their imaging workflow with RadiantView.</p>
                <div className="flex gap-6 items-center">
                   <div className="flex -space-x-4">
                     {[1,2,3,4].map(i => (
                       <div key={i} className="size-14 rounded-full border-4 border-navy bg-white/10 shadow-xl" />
                     ))}
                   </div>
                   <div className="text-lg">
                     <p className="font-bold text-white tracking-tight">Over 500+ clinics</p>
                     <p className="text-white/30 text-sm uppercase tracking-widest font-bold">worldwide trust RadiantView</p>
                   </div>
                </div>
              </div>
              <div className="grid gap-6">
                <div className="p-12 rounded-[3rem] bg-white/5 border border-white/10 relative backdrop-blur-xl shadow-2xl">
                  <div className="absolute top-8 right-12 text-bright-blue/20">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C20.1216 16 21.017 16.8954 21.017 18V21C21.017 22.1046 20.1216 23 19.017 23H16.017C14.9124 23 14.017 22.1046 14.017 21ZM14.017 21V10C14.017 5.02944 18.0464 1 23.017 1V3C19.151 3 16.017 6.13401 16.017 10V14H21.017V21C21.017 22.1046 20.1216 23 19.017 23H16.017C14.9124 23 14.017 22.1046 14.017 21ZM2.01697 21L2.01697 18C2.01697 16.8954 2.9124 16 4.01697 16H7.01697C8.12154 16 9.01697 16.8954 9.01697 18V21C9.01697 22.1046 8.12154 23 7.01697 23H4.01697C2.9124 23 2.01697 22.1046 2.01697 21ZM2.01697 21V10C2.01697 5.02944 6.04641 1 11.017 1V3C7.15098 3 4.01697 6.13401 4.01697 10V14H9.01697V21C9.01697 22.1046 8.12154 23 7.01697 23H4.01697C2.9124 23 2.01697 22.1046 2.01697 21Z" /></svg>
                  </div>
                  <p className="text-2xl italic text-white/90 relative z-10 leading-relaxed font-light mb-10">
                    &quot;RadiantView has completely changed how our clinic operates. The speed of the web viewer is unmatched, and having RIS/PACS in one tab is a game changer.&quot;
                  </p>
                  <div className="flex items-center space-x-6">
                    <div className="size-16 rounded-full bg-bright-blue/20 border border-bright-blue/30" />
                    <div>
                      <p className="font-bold text-white text-xl tracking-tight">Dr. Sarah Chen</p>
                      <p className="text-bright-blue/60 font-bold text-sm uppercase tracking-widest">Chief of Radiology, Metro Health</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-32 bg-bright-blue">
          <div className="container px-6 md:px-12 mx-auto text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-6xl mb-8 text-white">Ready to upgrade your imaging?</h2>
            <p className="text-white/90 text-xl md:text-2xl mb-12 max-w-[700px] mx-auto font-light">
              Get started today and see why top radiologists choose our zero-footprint platform.
            </p>
            <Button size="lg" variant="secondary" className="h-16 px-12 rounded-full font-bold text-xl bg-white text-bright-blue hover:bg-white/90 shadow-xl transition-all">
              Get Started Now <ArrowRight className="ml-2 size-6" />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-16 bg-navy text-white/60">
        <div className="container px-6 md:px-12 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 pb-12">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-2xl tracking-tight text-white uppercase italic">RadiantView</span>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-xs font-bold tracking-widest uppercase">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-white transition-colors">Contact Us</Link>
              <Link href="#" className="hover:text-white transition-colors">LinkedIn</Link>
              <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold tracking-[0.2em] uppercase opacity-50">
            <p>© 2024 RadiantView Inc. All rights reserved.</p>
            <p className="mt-4 md:mt-0">Made with precision for healthcare.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
