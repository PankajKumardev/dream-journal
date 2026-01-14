"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Moon, FileText, Lightbulb, Settings, ArrowRight, Brain, BarChart3, Activity, Zap, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";

// Hardcoded demo stats
const DEMO_STATS = {
  totalDreams: 47,
  analyzedDreams: 45,
  nightmareCount: 6,
  lucidCount: 12,
  avgVividness: 7.2,
  themes: [
    { theme: "Flight", count: 8 },
    { theme: "Water", count: 7 },
    { theme: "Chase", count: 5 },
    { theme: "Family", count: 5 },
    { theme: "Nature", count: 4 },
    { theme: "Work", count: 3 },
  ],
  emotions: [
    { emotion: "Wonder", value: 0.32 },
    { emotion: "Anxiety", value: 0.24 },
    { emotion: "Joy", value: 0.18 },
    { emotion: "Fear", value: 0.14 },
    { emotion: "Peace", value: 0.12 },
  ],
};

const DEMO_PATTERNS = [
  {
    id: "pattern-1",
    patternType: "recurring_theme",
    patternData: { theme: "Flying", frequency: "Weekly", context: "Usually occurs during low-stress periods" },
    confidence: 0.87,
    occurrenceCount: 8,
  },
  {
    id: "pattern-2",
    patternType: "emotional_trigger",
    patternData: { trigger: "Work stress", result: "Chase dreams", correlation: "Strong" },
    confidence: 0.82,
    occurrenceCount: 5,
  },
  {
    id: "pattern-3",
    patternType: "sleep_correlation",
    patternData: { factor: "Late sleep", effect: "More vivid dreams", strength: "Moderate" },
    confidence: 0.74,
    occurrenceCount: 12,
  },
];

const DEMO_WEEKLY_REPORT = {
  weekStart: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  createdAt: new Date().toISOString(),
  content: `This week showed a fascinating shift in your dream patterns. Your subconscious has been actively processing themes of freedom and control, with flying dreams appearing three times—more than double your usual frequency.

The emotional landscape of your dreams has been predominantly positive. Wonder and curiosity dominated 65% of your recorded experiences, suggesting a period of openness to new possibilities in your waking life.

Notable observations:
• Your lucid dreaming success rate increased to 40% this week
• Water imagery appeared in 4 dreams, often associated with emotional clarity
• Pre-sleep mood correlated strongly with dream vividness (r=0.78)

Consider journaling about any recent life changes that may be influencing these patterns. The increased frequency of control-related themes suggests your subconscious is working through decisions or new responsibilities.`,
};

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

function ThemeChart({ data }: { data: typeof DEMO_STATS.themes }) {
  const maxCount = Math.max(...data.map(d => d.count));
  
  return (
    <Card className="bg-card border border-border shadow-none">
      <CardHeader className="border-b border-border pb-4">
        <CardTitle className="font-serif text-lg font-normal text-card-foreground flex items-center gap-2">
          <Brain className="w-4 h-4 text-muted-foreground" />
          Top Themes
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-3">
        {data.map((item, i) => (
          <div key={item.theme} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-foreground">{item.theme}</span>
              <span className="text-muted-foreground">{item.count} dreams</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(item.count / maxCount) * 100}%` }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="h-full bg-indigo-500 rounded-full"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function EmotionChart({ data }: { data: typeof DEMO_STATS.emotions }) {
  return (
    <Card className="bg-card border border-border shadow-none">
      <CardHeader className="border-b border-border pb-4">
        <CardTitle className="font-serif text-lg font-normal text-card-foreground flex items-center gap-2">
          <Activity className="w-4 h-4 text-muted-foreground" />
          Emotional Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex items-center justify-center gap-1 h-32 mb-4">
          {data.map((item, i) => (
            <motion.div
              key={item.emotion}
              initial={{ height: 0 }}
              animate={{ height: `${item.value * 100 * 2}%` }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="w-12 bg-indigo-500/80 rounded-t-md relative group"
              style={{ opacity: 1 - i * 0.15 }}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {Math.round(item.value * 100)}%
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-center gap-4 flex-wrap">
          {data.map((item, i) => (
            <div key={item.emotion} className="flex items-center gap-1.5 text-xs">
              <div className="w-2 h-2 rounded-full bg-indigo-500" style={{ opacity: 1 - i * 0.15 }} />
              <span className="text-muted-foreground">{item.emotion}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PatternCard({ pattern }: { pattern: typeof DEMO_PATTERNS[0] }) {
  const typeLabels: Record<string, string> = {
    recurring_theme: "Recurring Theme",
    emotional_trigger: "Emotional Trigger",
    sleep_correlation: "Sleep Correlation",
  };

  return (
    <Card className="bg-card border border-border shadow-none">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              {typeLabels[pattern.patternType] || pattern.patternType}
            </span>
            <h3 className="font-serif text-lg text-foreground mt-1">
              {Object.values(pattern.patternData)[0] as string}
            </h3>
          </div>
          <div className="text-right">
            <div className="text-2xl font-serif text-indigo-500">{Math.round(pattern.confidence * 100)}%</div>
            <div className="text-xs text-muted-foreground">confidence</div>
          </div>
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>Occurrences: {pattern.occurrenceCount}</span>
          {Object.entries(pattern.patternData).slice(1).map(([key, value]) => (
            <span key={key} className="capitalize">{key.replace('_', ' ')}: {value as string}</span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function DemoInsightsPage() {
  return (
    <div className="min-h-screen bg-background pb-24 pt-24 md:pt-28 text-foreground transition-colors duration-300">
      <DemoNavigation activePage="insights" />

      <main className="max-w-4xl mx-auto px-6">
        {/* Demo Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm"
        >
           <span className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
             <Lightbulb className="w-4 h-4 flex-shrink-0" />
             <span>This is a demo with sample data. Create an account to see your own insights.</span>
           </span>
           <Link href="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium flex items-center gap-1 flex-shrink-0">
             Get Started <ArrowRight className="w-3 h-3" />
           </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 border-b border-border pb-8"
        >
          <div className="flex flex-col gap-1">
             <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">Analytics</p>
             <h1 className="font-serif text-4xl md:text-5xl text-foreground">
               Dream Insights
             </h1>
          </div>
          <p className="text-muted-foreground mt-4 max-w-xl">
            Discover recurring patterns, emotional trends, and deep correlations within your dreamscape.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {[
             { label: "Total Dreams", value: DEMO_STATS.totalDreams, icon: <Brain className="w-4 h-4" /> },
             { label: "Analyzed", value: DEMO_STATS.analyzedDreams, icon: <Lightbulb className="w-4 h-4" /> },
             { label: "Nightmares", value: DEMO_STATS.nightmareCount, icon: <Activity className="w-4 h-4" /> },
             { label: "Lucid Dreams", value: DEMO_STATS.lucidCount, icon: <BarChart3 className="w-4 h-4" /> }
          ].map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="p-6 rounded-xl border border-border bg-card flex flex-col justify-between h-32 hover:border-primary/20 transition-colors"
              >
                 <div className="text-muted-foreground">{stat.icon}</div>
                 <div>
                    <div className="text-3xl font-serif text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">{stat.label}</div>
                 </div>
              </motion.div>
          ))}
        </motion.div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-card border border-border p-1 h-auto rounded-xl">
            {["overview", "patterns", "report"].map(tab => (
               <TabsTrigger 
                  key={tab} 
                  value={tab}
                  className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground capitalize px-6 py-2 transition-all"
               >
                  {tab}
               </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <ThemeChart data={DEMO_STATS.themes} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <EmotionChart data={DEMO_STATS.emotions} />
              </motion.div>
            </div>
          </TabsContent>

          {/* Patterns Tab */}
          <TabsContent value="patterns" className="space-y-4">
            {DEMO_PATTERNS.map((pattern, index) => (
              <motion.div
                key={pattern.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PatternCard pattern={pattern} />
              </motion.div>
            ))}
          </TabsContent>

          {/* Weekly Report Tab */}
          <TabsContent value="report" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-2xl text-foreground">
                Weekly Report
              </h2>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 opacity-50 cursor-not-allowed"
              >
                Generate New Report
              </Button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-card border border-border shadow-none">
                <CardHeader className="border-b border-border pb-6">
                  <CardTitle className="font-serif flex items-center gap-2 text-xl font-normal text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    Week of{" "}
                    <span className="text-foreground">
                      {new Date(DEMO_WEEKLY_REPORT.weekStart).toLocaleDateString(
                        "en-US",
                        { month: "long", day: "numeric" }
                      )}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-8">
                  <div className="prose dark:prose-invert prose-stone max-w-none">
                     <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-lg font-light">
                       {DEMO_WEEKLY_REPORT.content}
                     </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-8 pt-4 border-t border-border">
                    Generated on {new Date(DEMO_WEEKLY_REPORT.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-8 rounded-xl bg-card border border-border text-center"
        >
          <h3 className="font-serif text-2xl text-foreground mb-2">Unlock Your Dream Patterns</h3>
          <p className="text-muted-foreground mb-6">Sign up to discover insights from your own dreams.</p>
          <Link href="/login">
            <Button className="rounded-full px-8">Create Free Account</Button>
          </Link>
        </motion.div>
      </main>
      
      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-background pb-safe z-50">
         <div className="flex justify-around items-center h-16">
            <Link href="/demo" className="flex flex-col items-center gap-1 p-2 text-muted-foreground">
               <FileText className="w-5 h-5" />
               <span className="text-[10px] font-medium">Journal</span>
            </Link>
            <Link href="/demo/insights" className="flex flex-col items-center gap-1 p-2 text-foreground">
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
