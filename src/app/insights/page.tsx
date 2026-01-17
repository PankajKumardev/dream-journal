"use client";

import { useEffect } from "react";
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
import { useDreamStore } from "@/lib/store";
import { Lightbulb, BarChart3, Brain, Activity, Clock, Loader2, Zap } from "lucide-react";

export default function InsightsPage() {
  const {
    patterns,
    patternsLoading,
    stats,
    statsLoading,
    weeklyReport,
    reportLoading,
    fetchPatterns,
    fetchStats,
    fetchWeeklyReport,
    generateReport,
  } = useDreamStore();

  useEffect(() => {
    fetchStats();
    fetchPatterns();
    fetchWeeklyReport();
  }, [fetchStats, fetchPatterns, fetchWeeklyReport]);

  const isLoading = statsLoading && !stats;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-24 md:pt-28">
        <Navigation />
        <main className="max-w-4xl mx-auto px-6">
          <Skeleton className="h-8 w-48 mb-8 bg-card" />
          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-64 bg-card" />
            <Skeleton className="h-64 bg-card" />
            <Skeleton className="h-48 bg-card" />
            <Skeleton className="h-48 bg-card" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 pt-24 md:pt-28 text-foreground transition-colors duration-300">
      <Navigation />

      <main className="max-w-4xl mx-auto px-6">
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
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {[
               { label: "Total Dreams", value: stats.totalDreams, icon: <Brain className="w-4 h-4" /> },
               { label: "Analyzed", value: stats.analyzedDreams, icon: <Lightbulb className="w-4 h-4" /> },
               { label: "Nightmares", value: stats.nightmareCount, icon: <Activity className="w-4 h-4" /> },
               { label: "Lucid Dreams", value: stats.lucidCount, icon: <BarChart3 className="w-4 h-4" /> }
            ].map((stat, i) => (
                <div key={i} className="p-6 rounded-xl border border-border bg-card flex flex-col justify-between h-32 hover:border-primary/20 transition-colors">
                   <div className="text-muted-foreground">{stat.icon}</div>
                   <div>
                      <div className="text-3xl font-serif text-foreground">{stat.value}</div>
                      <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">{stat.label}</div>
                   </div>
                </div>
            ))}
          </motion.div>
        )}

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

                {stats.activity && stats.activity.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <DreamActivityChart data={stats.activity} />
                  </motion.div>
                )}

                {stats.moodTrend && stats.moodTrend.length > 0 && (
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
              <div className="py-24 text-center border border-dashed border-border rounded-xl bg-card/50">
                 <div className="w-16 h-16 mx-auto bg-card rounded-full flex items-center justify-center mb-4 border border-border">
                    <BarChart3 className="w-6 h-6 text-muted-foreground" />
                 </div>
                 <h3 className="font-serif text-xl text-foreground mb-2">No data available</h3>
                 <p className="text-muted-foreground">Record more dreams to unlock insights.</p>
              </div>
            )}
          </TabsContent>

          {/* Patterns Tab */}
          <TabsContent value="patterns" className="space-y-4">
            {patternsLoading && patterns.length === 0 ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-24 bg-card" />
                ))}
              </div>
            ) : patterns.length > 0 ? (
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
              <div className="py-24 text-center border border-dashed border-border rounded-xl bg-card/50">
                 <div className="w-16 h-16 mx-auto bg-card rounded-full flex items-center justify-center mb-4 border border-border">
                    <Zap className="w-6 h-6 text-muted-foreground" />
                 </div>
                 <h3 className="font-serif text-xl text-foreground mb-2">No patterns detected</h3>
                 <p className="text-muted-foreground">We need more entries to find connections.</p>
              </div>
            )}
          </TabsContent>

          {/* Weekly Report Tab */}
          <TabsContent value="report" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-2xl text-foreground">
                Weekly Report
              </h2>
              <Button
                onClick={() => generateReport()}
                disabled={reportLoading}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6"
              >
                {reportLoading ? (
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
                <Card className="bg-card border border-border shadow-none">
                  <CardHeader className="border-b border-border pb-6">
                    <CardTitle className="font-serif flex items-center gap-2 text-xl font-normal text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      Week of{" "}
                      <span className="text-foreground">
                        {new Date(weeklyReport.weekStart).toLocaleDateString(
                          "en-US",
                          { month: "long", day: "numeric" }
                        )}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-8">
                    <div className="prose dark:prose-invert prose-stone max-w-none">
                       <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-lg font-light">
                         {weeklyReport.content}
                       </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-8 pt-4 border-t border-border">
                      Generated on {new Date(weeklyReport.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="py-24 text-center border border-dashed border-border rounded-xl bg-card/50">
                 <div className="w-16 h-16 mx-auto bg-card rounded-full flex items-center justify-center mb-4 border border-border">
                    <Activity className="w-6 h-6 text-muted-foreground" />
                 </div>
                 <h3 className="font-serif text-xl text-foreground mb-2">No active report</h3>
                 <p className="text-muted-foreground mb-6">Generate a weekly summary of your dream life.</p>
                 <Button
                    onClick={() => generateReport()}
                    disabled={reportLoading}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
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
