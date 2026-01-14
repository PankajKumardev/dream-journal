"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PricingSection() {
  return (
    <section id="pricing" className="px-6 py-24 bg-zinc-900/20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-serif text-white">Invest in your mind.</h2>
          <p className="text-zinc-400">Choose the tool that fits your depth of exploration.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Free Tier */}
          <div className="p-8 rounded-2xl border border-zinc-800 bg-[#09090B] space-y-6">
            <div>
              <h3 className="text-xl font-medium text-white">Dreamer</h3>
              <div className="mt-4 flex items-baseline text-white">
                <span className="text-4xl font-serif tracking-tight">$0</span>
                <span className="ml-1 text-xl text-zinc-500">/mo</span>
              </div>
              <p className="mt-4 text-sm text-zinc-400">Perfect for casual journaling and basic recall.</p>
            </div>
            <ul className="space-y-4 text-sm text-zinc-300">
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-zinc-500" /> Unlimited Text Entries</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-zinc-500" /> Basic AI Transcription</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-zinc-500" /> 7-Day Insight History</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-zinc-500" /> Local Encryption</li>
            </ul>
            <Link href="/login">
              <Button variant="outline" className="w-full mt-6 bg-transparent hover:bg-zinc-800 text-white border-zinc-700">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="relative p-8 rounded-2xl border border-indigo-500/50 bg-zinc-900/50 space-y-6 overflow-hidden">
            <div className="absolute top-0 right-0 p-3">
              <div className="px-3 py-1 rounded-full bg-indigo-500 text-white text-xs font-medium">Popular</div>
            </div>
            <div>
              <h3 className="text-xl font-medium text-white">Oneironaut</h3>
              <div className="mt-4 flex items-baseline text-white">
                <span className="text-4xl font-serif tracking-tight">$12</span>
                <span className="ml-1 text-xl text-zinc-500">/mo</span>
              </div>
              <p className="mt-4 text-sm text-zinc-400">For deep divers seeking patterns and lucidity.</p>
            </div>
            <ul className="space-y-4 text-sm text-zinc-300">
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-indigo-400" /> Everything in Dreamer</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-indigo-400" /> Advanced Jungian Analysis</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-indigo-400" /> Image Generation (Dream-to-Art)</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-indigo-400" /> Long-term Trend Reports</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-indigo-400" /> Sleep Tracker Integrations</li>
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
