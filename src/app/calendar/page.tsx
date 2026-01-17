"use client";

import { useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { DreamCalendar } from "@/components/dream-calendar";
import { useDreamStore } from "@/lib/store";
import { motion } from "framer-motion";

export default function CalendarPage() {
  const dreams = useDreamStore((state) => state.dreams);
  const dreamsLoading = useDreamStore((state) => state.dreamsLoading);
  const fetchDreams = useDreamStore((state) => state.fetchDreams);

  useEffect(() => {
    // Fetch all dreams for calendar view (need full history)
    fetchDreams(true);
  }, [fetchDreams]);

  return (
    <div className="min-h-screen bg-background pt-20 pb-24">
      <Navigation />

      <main className="max-w-5xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-2">
              Dream Calendar
            </h1>
            <p className="text-muted-foreground">
              Visualize your dream activity over time
            </p>
          </div>

          {/* Calendar */}
          {dreamsLoading ? (
            <div className="rounded-xl border border-border bg-card p-8 animate-pulse">
              <div className="h-8 bg-muted rounded w-48 mb-6" />
              <div className="grid grid-cols-7 gap-2">
                {[...Array(35)].map((_, i) => (
                  <div key={i} className="aspect-square bg-muted rounded" />
                ))}
              </div>
            </div>
          ) : (
            <DreamCalendar
              dreams={dreams.map((d) => ({
                ...d,
                recordedAt: new Date(d.recordedAt),
                analysis: d.analysis
                  ? {
                      isNightmare: d.analysis.isNightmare,
                      isLucid: d.analysis.isLucid,
                      themes: d.analysis.themes as string[],
                    }
                  : null,
              }))}
            />
          )}
        </motion.div>
      </main>
    </div>
  );
}
