"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import {
  ThemeChart,
  EmotionChart,
  DreamActivityChart,
  MoodTrendChart,
  PatternCard,
} from "@/components/pattern-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, BarChart3, Brain, Activity, Clock, Loader2 } from "lucide-react";

interface Pattern {
  id: string;
  patternType: string;
  patternData: Record<string, unknown>;
  confidence: number;
  occurrenceCount: number;
}

interface Stats {
  totalDreams: number;
  analyzedDreams: number;
  nightmareCount: number;
  lucidCount: number;
  avgVividness: number;
  themes: { theme: string; count: number }[];
  emotions: { emotion: string; value: number }[];
  activity: { date: string; count: number }[];
  moodTrend: { date: string; mood: number; stress: number }[];
}

interface WeeklyReport {
  id: string;
  weekStart: string;
  content: string;
  stats: Record<string, unknown>;
  createdAt: string;
}

export default function InsightsPage() {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [patternsRes, statsRes, reportRes] = await Promise.all([
        fetch("/api/patterns"),
        fetch("/api/stats"),
        fetch("/api/reports/latest"),
      ]);

      if (patternsRes.ok) {
        const patternsData = await patternsRes.json();
        setPatterns(patternsData);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (reportRes.ok) {
        const reportData = await reportRes.json();
        setWeeklyReport(reportData);
      }
    } catch (error) {
      console.error("Error fetching insights:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateReport = async () => {
    setIsGeneratingReport(true);
    try {
      const res = await fetch("/api/reports/generate", { method: "POST" });
      if (res.ok) {
        const report = await res.json();
        setWeeklyReport(report);
      }
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090B] pb-24 md:pt-28">
        <Navigation />
        <main className="max-w-4xl mx-auto px-6">
          <Skeleton className="h-8 w-48 mb-8 bg-[#18181B]" />
          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-64 bg-[#18181B]" />
            <Skeleton className="h-64 bg-[#18181B]" />
            <Skeleton className="h-48 bg-[#18181B]" />
            <Skeleton className="h-48 bg-[#18181B]" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090B] pb-24 pt-24 md:pt-28 text-[#FAFAFA]">
      <Navigation />

      <main className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 border-b border-[#27272A] pb-8"
        >
          <div className="flex flex-col gap-1">
             <p className="text-zinc-500 text-sm uppercase tracking-widest font-medium">Analytics</p>
             <h1 className="font-serif text-4xl md:text-5xl text-[#FAFAFA]">
               Dream Insights
             </h1>
          </div>
          <p className="text-zinc-400 mt-4 max-w-xl">
            Discover recurring patterns, emotional trends, and deep correlations within your dreamscape.
          </p>
        </motion.div>

        {/* Quick Stats */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {[
               { label: "Total Dreams", value: stats.totalDreams, icon: <Brain className="w-4 h-4" /> },
               { label: "Analyzed", value: stats.analyzedDreams, icon: <Sparkles className="w-4 h-4" /> },
               { label: "Nightmares", value: stats.nightmareCount, icon: <Activity className="w-4 h-4" /> },
               { label: "Lucid Dreams", value: stats.lucidCount, icon: <BarChart3 className="w-4 h-4" /> }
            ].map((stat, i) => (
                <div key={i} className="p-6 rounded-xl border border-[#27272A] bg-[#18181B] flex flex-col justify-between h-32">
                   <div className="text-zinc-500">{stat.icon}</div>
                   <div>
                      <div className="text-3xl font-serif text-[#FAFAFA]">{stat.value}</div>
                      <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider mt-1">{stat.label}</div>
                   </div>
                </div>
            ))}
          </motion.div>
        )}

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-[#18181B] border border-[#27272A] p-1 h-auto rounded-xl">
            {["overview", "patterns", "report"].map(tab => (
               <TabsTrigger 
                  key={tab} 
                  value={tab}
                  className="rounded-lg data-[state=active]:bg-[#27272A] data-[state=active]:text-white text-zinc-400 capitalize px-6 py-2"
               >
                  {tab}
               </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {stats && stats.totalDreams > 0 ? (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  {stats.themes.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <ThemeChart data={stats.themes} />
                    </motion.div>
                  )}
                  {stats.emotions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <EmotionChart data={stats.emotions} />
                    </motion.div>
                  )}
                </div>

                {stats.activity.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <DreamActivityChart data={stats.activity} />
                  </motion.div>
                )}

                {stats.moodTrend.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <MoodTrendChart data={stats.moodTrend} />
                  </motion.div>
                )}
              </>
            ) : (
              <div className="py-24 text-center border border-dashed border-[#27272A] rounded-xl bg-[#18181B]/50">
                 <div className="w-16 h-16 mx-auto bg-[#18181B] rounded-full flex items-center justify-center mb-4 border border-[#27272A]">
                    <BarChart3 className="w-6 h-6 text-zinc-500" />
                 </div>
                 <h3 className="font-serif text-xl text-[#FAFAFA] mb-2">No data available</h3>
                 <p className="text-zinc-500">Record more dreams to unlock insights.</p>
              </div>
            )}
          </TabsContent>

          {/* Patterns Tab */}
          <TabsContent value="patterns" className="space-y-4">
            {patterns.length > 0 ? (
              patterns.map((pattern, index) => (
                <motion.div
                  key={pattern.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PatternCard pattern={pattern} />
                </motion.div>
              ))
            ) : (
              <div className="py-24 text-center border border-dashed border-[#27272A] rounded-xl bg-[#18181B]/50">
                 <div className="w-16 h-16 mx-auto bg-[#18181B] rounded-full flex items-center justify-center mb-4 border border-[#27272A]">
                    <Sparkles className="w-6 h-6 text-zinc-500" />
                 </div>
                 <h3 className="font-serif text-xl text-[#FAFAFA] mb-2">No patterns detected</h3>
                 <p className="text-zinc-500">We need more entries to find connections.</p>
              </div>
            )}
          </TabsContent>

          {/* Weekly Report Tab */}
          <TabsContent value="report" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-2xl text-[#FAFAFA]">
                Weekly Report
              </h2>
              <Button
                onClick={generateReport}
                disabled={isGeneratingReport}
                className="bg-[#FAFAFA] text-black hover:bg-zinc-200 rounded-full px-6"
              >
                {isGeneratingReport ? (
                   <>
                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                     Generating...
                   </>
                ) : (
                  "Generate New Report"
                )}
              </Button>
            </div>

            {weeklyReport ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-[#18181B] border border-[#27272A] shadow-none">
                  <CardHeader className="border-b border-[#27272A] pb-6">
                    <CardTitle className="font-serif flex items-center gap-2 text-xl font-normal text-zinc-400">
                      <Clock className="w-4 h-4" />
                      Week of{" "}
                      <span className="text-[#FAFAFA]">
                        {new Date(weeklyReport.weekStart).toLocaleDateString(
                          "en-US",
                          { month: "long", day: "numeric" }
                        )}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-8">
                    <div className="prose prose-invert max-w-none">
                       <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap text-lg font-light">
                         {weeklyReport.content}
                       </p>
                    </div>
                    <p className="text-xs text-zinc-600 mt-8 pt-4 border-t border-[#27272A]">
                      Generated on {new Date(weeklyReport.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="py-24 text-center border border-dashed border-[#27272A] rounded-xl bg-[#18181B]/50">
                 <div className="w-16 h-16 mx-auto bg-[#18181B] rounded-full flex items-center justify-center mb-4 border border-[#27272A]">
                    <Activity className="w-6 h-6 text-zinc-500" />
                 </div>
                 <h3 className="font-serif text-xl text-[#FAFAFA] mb-2">No active report</h3>
                 <p className="text-zinc-500 mb-6">Generate a weekly summary of your dream life.</p>
                 <Button
                    onClick={generateReport}
                    disabled={isGeneratingReport}
                    className="bg-white text-black hover:bg-zinc-200 rounded-full"
                  >
                    Generate Report
                  </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
