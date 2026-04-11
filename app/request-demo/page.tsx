"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LandingHeader } from "@/components/landing-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  organization: z.string().min(2, { message: "Organization is required" }),
  role: z.string().min(1, { message: "Please select a role" }),
  phone: z.string().min(5, { message: "Phone number is required" }),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function RequestDemoPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    console.log("Form data:", data);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50">
      <LandingHeader />

      <main className="flex-1 flex flex-col items-center py-16 px-4">
        <div className="max-w-3xl w-full space-y-12">
          {/* Intro Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              Book a Demo
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Discover how RadiantView&apos;s AI-powered imaging platform can transform your clinical workflow and accelerate patient care.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl">
            {isSubmitted ? (
              <div className="text-center py-12 space-y-6">
                <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 className="size-12" />
                </div>
                <h2 className="text-2xl font-bold">Request Received!</h2>
                <p className="text-slate-400">
                  Thank you for your interest in RadiantView. A product specialist will contact you shortly to schedule your personalized demo.
                </p>
                <Link href="/">
                  <Button variant="outline" className="mt-4">
                    Return to Homepage
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      className={`bg-slate-950 border-slate-800 focus:border-primary transition-colors ${
                        errors.fullName ? "border-destructive focus:ring-destructive" : ""
                      }`}
                      {...register("fullName")}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-destructive">{errors.fullName.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className={`bg-slate-950 border-slate-800 focus:border-primary transition-colors ${
                        errors.email ? "border-destructive focus:ring-destructive" : ""
                      }`}
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Organization */}
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization / Hospital</Label>
                    <Input
                      id="organization"
                      placeholder="City General Hospital"
                      className={`bg-slate-950 border-slate-800 focus:border-primary transition-colors ${
                        errors.organization ? "border-destructive focus:ring-destructive" : ""
                      }`}
                      {...register("organization")}
                    />
                    {errors.organization && (
                      <p className="text-sm text-destructive">{errors.organization.message}</p>
                    )}
                  </div>

                  {/* Role (Dropdown) */}
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      className={`w-full h-10 px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none focus:border-primary transition-colors ${
                        errors.role ? "border-destructive" : ""
                      }`}
                      {...register("role")}
                    >
                      <option value="" disabled>Select your role</option>
                      <option value="radiologist">Radiologist</option>
                      <option value="it-manager">IT Manager / PACS Admin</option>
                      <option value="administrator">Hospital Administrator</option>
                      <option value="technologist">Technologist</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.role && (
                      <p className="text-sm text-destructive">{errors.role.message}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className={`bg-slate-950 border-slate-800 focus:border-primary transition-colors ${
                        errors.phone ? "border-destructive focus:ring-destructive" : ""
                      }`}
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone.message}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="message">Message (Optional)</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your requirements..."
                      className="bg-slate-950 border-slate-800 focus:border-primary transition-colors min-h-[120px]"
                      {...register("message")}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg rounded-xl transition-all shadow-[0_0_20px_rgba(45,212,191,0.2)]"
                >
                  {isSubmitting ? "Processing..." : "Book Demo"}
                </Button>
                <p className="text-center text-xs text-slate-500 mt-4">
                  By clicking &quot;Book Demo&quot;, you agree to our Terms of Use and Privacy Policy.
                </p>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer (Simplified for Request Demo) */}
      <footer className="w-full py-8 border-t border-slate-900 bg-slate-950 text-center">
        <p className="text-xs text-slate-600">© 2024 RadiantView Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
