"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PricingSection() {
  return (
    <section id="pricing" className="px-6 py-24 bg-muted/20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-serif text-foreground">Invest in your mind.</h2>
          <p className="text-muted-foreground">Choose the tool that fits your depth of exploration.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Free Tier */}
          <div className="p-8 rounded-2xl border border-border bg-background space-y-6">
            <div>
              <h3 className="text-xl font-medium text-foreground">Dreamer</h3>
              <div className="mt-4 flex items-baseline text-foreground">
                <span className="text-4xl font-serif tracking-tight">$0</span>
                <span className="ml-1 text-xl text-muted-foreground">/mo</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Perfect for casual journaling and basic recall.</p>
            </div>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-muted-foreground" /> Unlimited Dream Entries</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-muted-foreground" /> Voice Transcription</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-muted-foreground" /> Basic AI Analysis</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-muted-foreground" /> Export: JSON & Markdown (50 dreams)</li>
            </ul>
            <Link href="/login">
              <Button variant="outline" className="w-full mt-6">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="relative p-8 rounded-2xl border border-indigo-500/50 bg-card space-y-6 overflow-hidden">
            <div className="absolute top-0 right-0 p-3">
              <div className="px-3 py-1 rounded-full bg-indigo-500 text-white text-xs font-medium">Popular</div>
            </div>
            <div>
              <h3 className="text-xl font-medium text-foreground">Oneironaut</h3>
              <div className="mt-4 flex items-baseline text-foreground">
                <span className="text-4xl font-serif tracking-tight">$12</span>
                <span className="ml-1 text-xl text-muted-foreground">/mo</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">For deep divers seeking patterns and lucidity.</p>
            </div>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-indigo-500" /> Everything in Dreamer</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-indigo-500" /> Jungian & Freudian Analysis</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-indigo-500" /> Similar Dreams Detection</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-indigo-500" /> Unlimited Pattern Insights</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-indigo-500" /> Weekly AI Reports</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-indigo-500" /> Export: PDF (500), JSON/MD (5,000)</li>
            </ul>
            <Link href="/login">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white border-none mt-6">
                Start 14-Day Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

