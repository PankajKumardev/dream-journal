"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="px-6 py-32 text-center bg-background">
      <div className="max-w-2xl mx-auto space-y-8">
        <h2 className="text-5xl md:text-6xl font-serif text-foreground">Start your journey tonight.</h2>
        <p className="text-muted-foreground text-lg">Join the community of lucid dreamers and explorers.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-auto px-12 h-12 rounded-full">
              Get Started for Free
            </Button>
          </Link>
        </div>
        <p className="text-xs text-muted-foreground pt-8">No credit card required • Cancel anytime</p>
      </div>
    </section>
  );
}
