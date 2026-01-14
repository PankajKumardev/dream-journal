"use client";

import { use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Moon, FileText, Lightbulb, Settings, ArrowLeft, Sparkles, Brain, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { formatRelativeTime } from "@/lib/utils";
import { DEMO_DREAMS } from "../../page";

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

export default function DemoDreamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  
  const dream = DEMO_DREAMS.find(d => d.id === id);
  
  if (!dream) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pb-24 pt-24 md:pt-28 text-foreground transition-colors duration-300">
      <DemoNavigation activePage="journal" />

      <main className="max-w-4xl mx-auto px-6">
        {/* Navigation & Actions */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Link href="/demo">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground pl-0 hover:bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dreams
            </Button>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col gap-4">
             <div>
                <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-3 leading-tight">
                  {dream.title}
                </h1>
                <div className="flex items-center gap-4 text-muted-foreground text-sm">
                   <span>{formatRelativeTime(new Date(dream.recordedAt))}</span>
                   
                   {dream.analysis?.isLucid && (
                      <Badge variant="outline" className="border-indigo-500/30 text-indigo-500 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 font-normal">
                         Lucid Dream
                      </Badge>
                   )}
                   {dream.analysis?.isNightmare && (
                      <Badge variant="outline" className="border-rose-500/30 text-rose-500 dark:text-rose-300 bg-rose-50 dark:bg-rose-500/10 font-normal">
                         Nightmare
                      </Badge>
                   )}
                </div>
             </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Transcript */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-card border border-border shadow-none h-full">
              <CardHeader className="border-b border-border pb-4">
                <CardTitle className="font-serif text-lg font-normal text-card-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  Dream Transcript
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-card-foreground/80 leading-relaxed whitespace-pre-wrap font-light text-lg">
                  {dream.transcript}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Interpretation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
             <Card className="bg-card border border-border shadow-none h-full">
              <CardHeader className="border-b border-border pb-4">
                <CardTitle className="font-serif text-lg font-normal text-card-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-muted-foreground" />
                  Dream Interpretation
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                 <div className="space-y-6">
                    <p className="text-card-foreground/80 leading-relaxed font-light text-lg">
                       {dream.analysis?.summary}
                    </p>
                    
                    {/* Themes Tags */}
                    {dream.analysis?.themes && (
                       <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                          {dream.analysis.themes.map(theme => (
                             <span key={theme} className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground border border-border">
                                #{theme}
                             </span>
                          ))}
                       </div>
                    )}
                 </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pre-Sleep State */}
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
          >
             <Card className="bg-card border border-border shadow-none">
                <CardHeader className="border-b border-border pb-4">
                   <CardTitle className="font-serif text-lg font-normal text-card-foreground flex items-center gap-2">
                      <Moon className="w-4 h-4 text-muted-foreground" />
                      Pre-Sleep State
                   </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 grid grid-cols-3 gap-6">
                   <div className="text-center">
                      <div className="text-2xl mb-2">
                         {dream.moodBefore > 7 ? "😊" : dream.moodBefore > 4 ? "😐" : "😔"}
                      </div>
                      <div className="text-xl font-serif text-card-foreground">{dream.moodBefore}/10</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Mood</div>
                   </div>
                   <div className="text-center">
                      <div className="text-2xl mb-2">
                         {dream.stressLevel > 7 ? "😰" : dream.stressLevel > 4 ? "😐" : "😌"}
                      </div>
                      <div className="text-xl font-serif text-card-foreground">{dream.stressLevel}/10</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Stress</div>
                   </div>
                   <div className="text-center">
                      <div className="text-2xl mb-2">
                         {dream.sleepQuality > 7 ? "😴" : dream.sleepQuality > 4 ? "😐" : "😫"}
                      </div>
                      <div className="text-xl font-serif text-card-foreground">{dream.sleepQuality}/10</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Sleep</div>
                   </div>
                </CardContent>
             </Card>
          </motion.div>

          {/* Symbols & Settings */}
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 }}
          >
             <Card className="bg-card border border-border shadow-none">
                <CardHeader className="border-b border-border pb-4">
                   <CardTitle className="font-serif text-lg font-normal text-card-foreground flex items-center gap-2">
                      <Brain className="w-4 h-4 text-muted-foreground" />
                      Dream Elements
                   </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                   <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Symbols</p>
                      <div className="flex flex-wrap gap-2">
                         {dream.analysis?.symbols.map(symbol => (
                            <span key={symbol} className="text-xs px-2 py-1 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                               {symbol}
                            </span>
                         ))}
                      </div>
                   </div>
                   <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Settings</p>
                      <div className="flex flex-wrap gap-2">
                         {dream.analysis?.settings.map(setting => (
                            <span key={setting} className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground border border-border">
                               {setting}
                            </span>
                         ))}
                      </div>
                   </div>
                </CardContent>
             </Card>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-8 rounded-xl bg-card border border-border text-center"
        >
          <h3 className="font-serif text-2xl text-foreground mb-2">Start Your Dream Journal</h3>
          <p className="text-muted-foreground mb-6">Record and analyze your own dreams with AI-powered insights.</p>
          <Link href="/login">
            <Button className="rounded-full px-8">Create Free Account</Button>
          </Link>
        </motion.div>
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
