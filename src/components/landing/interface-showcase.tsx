"use client";

import { Brain } from "lucide-react";

export function InterfaceShowcase() {
  return (
    <section className="px-6 py-12 md:py-24 border-t border-border bg-gradient-to-b from-transparent to-muted/30">
      <div className="max-w-6xl mx-auto relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
        <div className="relative rounded-xl border border-border bg-background shadow-2xl shadow-indigo-500/5 overflow-hidden">
          {/* Faux Browser UI */}
          <div className="h-10 border-b border-border bg-muted flex items-center px-4 gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
            </div>
            <div className="mx-auto text-xs text-muted-foreground font-medium">dreamjournal.ai/dashboard</div>
          </div>
          
          {/* Dashboard Content Mockup */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 h-[600px]">
            {/* Sidebar */}
            <div className="hidden md:flex flex-col border-r border-border bg-card/50 p-4 space-y-6">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Today</div>
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-200 text-sm font-medium border border-indigo-500/20">
                  Flying over Cities
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Recent</div>
                {['Lost in Library', 'Underwater Breath', 'Meeting an Old Friend'].map((item) => (
                  <div key={item} className="p-2 rounded-lg hover:bg-accent text-muted-foreground text-sm cursor-pointer transition-colors">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-2 p-8 space-y-8 bg-background relative">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <span>Oct 24, 2026</span>
                  <span>•</span>
                  <span>06:42 AM</span>
                </div>
                <h2 className="text-3xl font-serif text-foreground">Flying over the marble city</h2>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs border border-indigo-500/20">Lucid</span>
                  <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs border border-border">High Clarity</span>
                </div>
              </div>
              
              <div className="prose prose-zinc dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  I started on a balcony made of pure white marble. The air was crisp, like early autumn. I looked down and saw a city that stretched infinitely, but instead of roads, there were canals of light. I pushed off the railing and... floated.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  The sensation was weightless. I could control my direction by simply leaning my thoughts.
                </p>
              </div>

              <div className="pt-8 border-t border-border">
                <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-indigo-500" /> AI Analysis
                </h3>
                <div className="bg-card rounded-lg p-4 border border-border text-sm text-muted-foreground space-y-2">
                  <p>The theme of <span className="text-foreground font-medium">flight</span> suggests a desire for freedom or a recent release from a burden. The <span className="text-foreground font-medium">marble city</span> represents structure and stability in your waking life.</p>
                </div>
              </div>
              
              {/* Live Demo Badge */}
              <div className="absolute top-8 right-8 bg-muted border border-border text-muted-foreground text-xs px-2 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Live Demo
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
