"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Moon, FileText, Lightbulb, ArrowRight, Search, Plus, Mic, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { formatRelativeTime, truncate, getGreeting } from "@/lib/utils";
import { AlertCircle, Eye, Clock } from "lucide-react";

// Hardcoded Demo Data
export const DEMO_DREAMS = [
  {
    id: "demo-1",
    title: "Flying over the marble city",
    transcript: "I started on a balcony made of pure white marble. The air was crisp, like early autumn. I looked down and saw a city that stretched infinitely, but instead of roads, there were canals of light. I pushed off the railing and... floated. The sensation was weightless. I could control my direction by simply leaning my thoughts. Below me, people moved like colorful dots, unaware of my presence above them.",
    recordedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    moodBefore: 7,
    stressLevel: 3,
    sleepQuality: 8,
    analysis: {
      analysisStatus: "done",
      themes: ["Flight", "Freedom", "Cityscape", "Light", "Control"],
      emotions: { joy: 0.8, wonder: 0.9, peace: 0.7 },
      symbols: ["Marble", "Canals of light", "Floating"],
      people: [],
      settings: ["City", "Balcony", "Sky"],
      isNightmare: false,
      isLucid: true,
      vividness: 9,
      summary: "A highly lucid flying dream set in an infinite marble city. Themes of liberation and control suggest a simplified perspective on complex waking-life structural problems. The canals of light may represent pathways of opportunity or clarity in decision-making.",
    },
  },
  {
    id: "demo-2",
    title: "The Underwater Tea Party",
    transcript: "I was breathing underwater without any equipment. It felt completely natural. I swam into a sunken greenhouse where my third-grade teacher was serving tea to a group of jellyfish. The tea tasted like static electricity. She looked at me and said 'You're late, but that's okay. The important thing is you're here now.' The jellyfish nodded in agreement.",
    recordedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    moodBefore: 5,
    stressLevel: 6,
    sleepQuality: 6,
    analysis: {
      analysisStatus: "done",
      themes: ["Underwater", "Nostalgia", "Absurdist", "Social", "Acceptance"],
      emotions: { curiosity: 0.8, comfort: 0.6, confusion: 0.4 },
      symbols: ["Underwater breathing", "Tea", "Jellyfish", "Greenhouse"],
      people: ["Third-grade teacher"],
      settings: ["Ocean", "Sunken greenhouse"],
      isNightmare: false,
      isLucid: false,
      vividness: 7,
      summary: "Surreal imagery involving past authority figures in a pressurized environment. The ability to breathe underwater often symbolizes coping well with heavy emotions. The teacher's message about being 'here now' suggests themes of self-acceptance and releasing past regrets.",
    },
  },
  {
    id: "demo-3",
    title: "Lost in the Library of Mirrors",
    transcript: "I was running through hallways lined with books, but every time I pulled a book out, it was just a mirror reflecting my own eye. I was looking for a specific page that contained a secret code, but I couldn't stop looking at my own reflection. The more I searched, the more mirrors appeared. Eventually I realized the code was written in my own iris.",
    recordedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    moodBefore: 4,
    stressLevel: 7,
    sleepQuality: 5,
    analysis: {
      analysisStatus: "done",
      themes: ["Self-reflection", "Search", "Confusion", "Mirrors", "Identity"],
      emotions: { anxiety: 0.6, curiosity: 0.5, revelation: 0.7 },
      symbols: ["Library", "Mirrors", "Books", "Secret code", "Eye/Iris"],
      people: [],
      settings: ["Library", "Endless hallways"],
      isNightmare: false,
      isLucid: false,
      vividness: 6,
      summary: "A classic anxiety dream focusing on self-identity and the search for external answers that only leads back to the self. The revelation that the code was in your iris suggests the answers you seek are already within you.",
    },
  },
  {
    id: "demo-4",
    title: "The Clockwork Forest",
    transcript: "Every tree in the forest was made of gears and springs. When the wind blew, they would tick and chime like a thousand pocket watches. I found a clearing where time had stopped completely - a deer made of brass stood frozen mid-leap. I touched it and felt warmth, as if it were still alive somehow, just... paused.",
    recordedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    moodBefore: 6,
    stressLevel: 4,
    sleepQuality: 7,
    analysis: {
      analysisStatus: "done",
      themes: ["Time", "Nature", "Mechanical", "Stillness", "Wonder"],
      emotions: { awe: 0.9, peace: 0.7, melancholy: 0.4 },
      symbols: ["Clockwork trees", "Brass deer", "Frozen time", "Gears"],
      people: [],
      settings: ["Mechanical forest", "Clearing"],
      isNightmare: false,
      isLucid: false,
      vividness: 8,
      summary: "A dream exploring the relationship between nature and technology, with themes of time and preservation. The frozen deer may represent a desire to pause and appreciate moments before they pass. The warmth in the mechanical creature suggests finding life and meaning in unexpected places.",
    },
  },
];

function DemoNavigation({ activePage = "journal" }: { activePage?: string }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link href="/demo" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Moon className="w-4 h-4 text-primary-foreground fill-current" />
          </div>
          <span className="font-serif font-medium text-lg tracking-tight text-foreground">
            Dream Journal
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="/demo" className={activePage === "journal" ? "text-foreground flex items-center gap-2" : "hover:text-foreground transition-colors flex items-center gap-2"}>
            <FileText className="w-4 h-4" /> Journal
          </Link>
          <Link href="/demo/insights" className={activePage === "insights" ? "text-foreground flex items-center gap-2" : "hover:text-foreground transition-colors flex items-center gap-2"}>
            <Lightbulb className="w-4 h-4" /> Insights
          </Link>
          <span className="opacity-50 cursor-not-allowed flex items-center gap-2">
            <Settings className="w-4 h-4" /> Settings
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login">
            <Button size="sm" className="hidden sm:inline-flex rounded-full px-6">
              Sign Up Free
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

// Demo Dream Card (no link, just display)
function DemoDreamCard({ dream }: { dream: typeof DEMO_DREAMS[0] }) {
  const themes = dream.analysis?.themes || [];

  return (
    <Link href={`/demo/dreams/${dream.id}`} className="block group">
       <div className="relative rounded-xl border border-border bg-card transition-all duration-200 hover:border-accent hover:bg-accent/50 overflow-hidden">
          
          <div className="p-6 space-y-4">
             {/* Header */}
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                   <Clock className="w-3 h-3" />
                   {formatRelativeTime(new Date(dream.recordedAt))}
                </div>
                
                <div className="flex gap-2">
                   {dream.analysis?.isNightmare && (
                      <span className="flex items-center gap-1 text-xs text-rose-500 bg-rose-500/10 px-2 py-1 rounded-full border border-rose-500/20">
                         <AlertCircle className="w-3 h-3" /> Nightmare
                      </span>
                   )}
                   {dream.analysis?.isLucid && (
                      <span className="flex items-center gap-1 text-xs text-indigo-500 bg-indigo-500/10 px-2 py-1 rounded-full border border-indigo-500/20">
                         <Eye className="w-3 h-3" /> Lucid
                      </span>
                   )}
                </div>
             </div>
             
             {/* Content */}
             <div>
                <h3 className="font-serif text-2xl text-card-foreground mb-2 group-hover:underline decoration-muted-foreground/30 decoration-1 underline-offset-4 transition-all">
                   {dream.title || "Untitled Dream"}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                   {dream.analysis?.summary 
                      ? truncate(dream.analysis.summary, 160)
                      : truncate(dream.transcript, 160)
                   }
                </p>
             </div>
             
             {/* Footer */}
             <div className="pt-4 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden">
                   {themes.slice(0, 3).map((theme) => (
                      <span key={theme} className="text-xs text-muted-foreground px-2 py-1 rounded-md bg-muted/50 border border-border">
                         #{theme}
                      </span>
                   ))}
                   {themes.length > 3 && (
                      <span className="text-xs text-muted-foreground">+{themes.length - 3}</span>
                   )}
                </div>
                
                <ArrowRight className="w-4 h-4 text-muted-foreground -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
             </div>
          </div>

          {/* Vividness Bar */}
          {dream.analysis?.vividness && (
             <div className="absolute bottom-0 left-0 w-full h-0.5 bg-muted">
                <div 
                   className="h-full bg-indigo-500 opacity-50" 
                   style={{ width: `${dream.analysis.vividness * 10}%` }} 
                />
             </div>
          )}
       </div>
    </Link>
  );
}

export default function DemoPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDreams = DEMO_DREAMS.filter(
    (dream) =>
      dream.transcript.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dream.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dream.analysis?.themes.some((t) =>
        t.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-background pb-24 pt-24 md:pt-28 text-foreground transition-colors duration-300">
      <DemoNavigation activePage="journal" />

      <main className="max-w-4xl mx-auto px-6">
        {/* Demo Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm"
        >
           <span className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
             <Lightbulb className="w-4 h-4 flex-shrink-0" />
             <span>This is a demo with sample dreams. Create an account to start your own journal.</span>
           </span>
           <Link href="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium flex items-center gap-1 flex-shrink-0">
             Get Started <ArrowRight className="w-3 h-3" />
           </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 border-b border-border pb-8"
        >
          <div className="flex items-end justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-2 uppercase tracking-widest font-medium">Dashboard</p>
              <h1 className="font-serif text-4xl md:text-5xl text-foreground">
                {getGreeting()}, Sarah
              </h1>
            </div>
            <Button className="hidden md:flex h-12 px-6 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2 transition-all shadow-sm opacity-50 cursor-not-allowed">
               <Plus className="w-5 h-5" /> New Entry
            </Button>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
           <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                 placeholder="Search entries..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="pl-10 h-12 rounded-xl bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring/20"
              />
           </div>
        </motion.div>

        {/* Dreams List */}
        <div className="space-y-4 pb-20">
          <AnimatePresence mode="popLayout">
            {filteredDreams.length > 0 ? (
              filteredDreams.map((dream, index) => (
                <motion.div
                  key={dream.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <DemoDreamCard dream={dream} />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24 border border-border rounded-xl bg-card/30"
              >
                <div className="w-16 h-16 mx-auto bg-card rounded-full flex items-center justify-center mb-6 border border-border">
                   <FileText className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-serif text-2xl text-card-foreground mb-2">
                  No matches found
                </h3>
                <p className="text-muted-foreground">Try a different search term</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      
      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-background pb-safe z-50">
         <div className="flex justify-around items-center h-16">
            <Link href="/demo" className="flex flex-col items-center gap-1 p-2 text-foreground">
               <FileText className="w-5 h-5" />
               <span className="text-[10px] font-medium">Journal</span>
            </Link>
            <Link href="/demo/insights" className="flex flex-col items-center gap-1 p-2 text-muted-foreground">
               <Lightbulb className="w-5 h-5" />
               <span className="text-[10px] font-medium">Insights</span>
            </Link>
            <div className="flex flex-col items-center gap-1 p-2 text-muted-foreground opacity-50">
               <Settings className="w-5 h-5" />
               <span className="text-[10px] font-medium">Settings</span>
            </div>
         </div>
      </div>
    </div>
  );
}

export { DemoNavigation, DEMO_DREAMS as demoDreams };
