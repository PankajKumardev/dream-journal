"use client";

import { Watch, Activity, Smartphone } from "lucide-react";

export function IntegrationsSection() {
  return (
    <section className="px-6 py-24 border-b border-zinc-900 bg-[#09090B]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-4xl font-serif text-white">Sync with your <br/> biological rhythm.</h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Dream Journal connects with your sleep tracker to overlay dream vividness on top of your REM cycles. Understand how your physiology affects your psychology.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-300 text-sm">
                <Watch className="w-4 h-4" /> Apple Health
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-300 text-sm">
                <Activity className="w-4 h-4" /> Oura Ring
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-300 text-sm">
                <Smartphone className="w-4 h-4" /> Android Sleep
              </div>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full opacity-20" />
            <div className="relative z-10 grid grid-cols-2 gap-4">
              <div className="space-y-4 translate-y-8">
                <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col items-center text-center space-y-3">
                  <span className="text-2xl font-serif text-white">02h 14m</span>
                  <span className="text-xs text-zinc-500 uppercase tracking-widest">REM Sleep</span>
                </div>
                <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col items-center text-center space-y-3">
                  <span className="text-2xl font-serif text-white">47 bpm</span>
                  <span className="text-xs text-zinc-500 uppercase tracking-widest">Resting HR</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col items-center text-center space-y-3 bg-gradient-to-b from-zinc-800 to-zinc-900">
                  <span className="text-2xl font-serif text-indigo-300">High</span>
                  <span className="text-xs text-zinc-500 uppercase tracking-widest">Recall Score</span>
                </div>
                <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col items-center text-center space-y-3">
                  <span className="text-2xl font-serif text-white">89%</span>
                  <span className="text-xs text-zinc-500 uppercase tracking-widest">Sleep Quality</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
