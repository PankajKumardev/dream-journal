"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { DreamCard } from "@/components/dream-card";
import { DreamForm } from "@/components/dream-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getGreeting } from "@/lib/utils";
import { useDreamStore } from "@/lib/store";
import { Search, Mic, Plus, FileText, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Zustand store
  const {
    dreams,
    dreamsLoading,
    hasMoreDreams,
    fetchMoreDreams,
    user,
    fetchDreams,
    fetchUser,
    createDream,
  } = useDreamStore();

  useEffect(() => {
    fetchDreams();
    fetchUser();
  }, [fetchDreams, fetchUser]);

  // Poll to refresh dreams if any are still analyzing
  useEffect(() => {
    const hasAnalyzingDream = dreams.some(
      (d) => !d.analysis || d.analysis.analysisStatus === "pending"
    );

    if (hasAnalyzingDream) {
      const interval = setInterval(() => {
        fetchDreams(true); // Force refresh
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [dreams, fetchDreams]);

  // Infinite Scroll Observer
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreDreams && !dreamsLoading) {
          fetchMoreDreams();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMoreDreams, dreamsLoading, fetchMoreDreams]);

  const handleCreateDream = async (data: {
    transcript: string;
    moodBefore?: number;
    stressLevel?: number;
    sleepQuality?: number;
  }) => {
    await createDream(data);
    setIsDialogOpen(false);
  };

  const filteredDreams = dreams.filter(
    (dream) =>
      dream.transcript.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dream.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dream.analysis?.themes.some((t) =>
        t.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const todaysDream = dreams.find((d) => {
    const dreamDate = new Date(d.recordedAt);
    const today = new Date();
    return dreamDate.toDateString() === today.toDateString();
  });

  const userName = user?.name || "Dreamer";

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
          <div className="flex items-end justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-2 uppercase tracking-widest font-medium">Dashboard</p>
              <h1 className="font-serif text-4xl md:text-5xl text-foreground">
                {getGreeting()}, {userName}
              </h1>
            </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="hidden md:flex h-12 px-6 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2 transition-all shadow-sm">
                       <Plus className="w-5 h-5" /> New Entry
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border p-0 max-w-lg overflow-hidden gap-0">
                    <DialogHeader className="p-6 border-b border-border">
                      <DialogTitle className="font-serif text-2xl font-normal text-card-foreground">Record Dream</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-[80vh] overflow-y-auto">
                       <DreamForm onSubmit={handleCreateDream} />
                    </div>
                  </DialogContent>
               </Dialog>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
           <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                 placeholder="Search entries..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="pl-10 h-12 rounded-xl bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring/20"
              />
           </div>
           
           {/* Mobile FAB or Create Button */}
           <div className="md:hidden">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                 <DialogTrigger asChild>
                    <Button className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-xl flex items-center justify-center gap-2">
                       <Plus className="w-5 h-5" /> New Entry
                    </Button>
                 </DialogTrigger>
                 <DialogContent className="bg-card border-border p-0 max-w-lg overflow-hidden gap-0">
                    <DialogHeader className="p-6 border-b border-border">
                      <DialogTitle className="font-serif text-2xl font-normal text-card-foreground">Record Dream</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-[80vh] overflow-y-auto">
                       <DreamForm onSubmit={handleCreateDream} />
                    </div>
                 </DialogContent>
              </Dialog>
           </div>
        </div>

        {/* Quick Record Card (Empty State) */}
        {!todaysDream && !searchQuery && dreams.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12 cursor-pointer group"
            onClick={() => setIsDialogOpen(true)}
          >
             <div className="relative p-8 rounded-xl border border-dashed border-border bg-card/50 hover:bg-card hover:border-primary/30 transition-all flex flex-col items-center justify-center text-center gap-4 group-hover:shadow-lg">
                <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center group-hover:scale-110 transition-transform">
                   <Mic className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
                </div>
                <div>
                   <h3 className="font-serif text-xl text-card-foreground mb-1">Tell me about your dream</h3>
                   <p className="text-muted-foreground text-sm">Tap here to start recording</p>
                </div>
             </div>
          </motion.div>
        )}

        {/* Dreams List */}
        <div className="space-y-4 pb-20">
          <AnimatePresence mode="popLayout">
            {dreamsLoading && dreams.length === 0 ? (
              // Loading skeletons
              [...Array(3)].map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-40 bg-card rounded-xl border border-border animate-pulse"
                />
              ))
            ) : filteredDreams.length > 0 ? (
              filteredDreams.map((dream, index) => (
                <motion.div
                  key={dream.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <DreamCard
                    dream={{
                      ...dream,
                      recordedAt: new Date(dream.recordedAt),
                      analysis: dream.analysis
                        ? {
                            ...dream.analysis,
                            themes: dream.analysis.themes as string[],
                          }
                        : null,
                    }}
                  />
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
                  {searchQuery ? "No matches found" : "Your journal is empty"}
                </h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  {searchQuery
                    ? "Try adjusting your search terms."
                    : "Dreams are fleeting. Record your first one to start building your subconscious map."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Infinite Scroll Sentinel */}
          {!searchQuery && hasMoreDreams && (
             <div ref={observerTarget} className="py-8 flex justify-center w-full min-h-[50px]">
                {dreamsLoading && dreams.length > 0 && (
                   <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                )}
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
