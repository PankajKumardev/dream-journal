"use client";

import { useState, useEffect } from "react";
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
import { Search, Mic, Plus, FileText } from "lucide-react";

interface Dream {
  id: string;
  title: string | null;
  transcript: string;
  recordedAt: string;
  moodBefore: number | null;
  analysis: {
    analysisStatus: string;
    themes: string[];
    isNightmare: boolean;
    isLucid: boolean;
    vividness: number;
    summary: string;
  } | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    fetchDreams();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/user");
      if (res.ok) {
        const data = await res.json();
        setUserName(data.name || "Dreamer");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchDreams = async () => {
    try {
      const res = await fetch("/api/dreams");
      if (res.ok) {
        const data = await res.json();
        setDreams(data);
      }
    } catch (error) {
      console.error("Error fetching dreams:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDream = async (data: {
    transcript: string;
    moodBefore?: number;
    stressLevel?: number;
    sleepQuality?: number;
  }) => {
    const res = await fetch("/api/dreams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to create dream");

    const newDream = await res.json();
    setDreams((prev) => [newDream, ...prev]);
    setIsDialogOpen(false);

    // Trigger async analysis
    fetch(`/api/dreams/${newDream.id}/analyze`, { method: "POST" });
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
          <div className="flex items-end justify-between">
            <div>
              <p className="text-zinc-500 text-sm mb-2 uppercase tracking-widest font-medium">Dashboard</p>
              <h1 className="font-serif text-4xl md:text-5xl text-[#FAFAFA]">
                {getGreeting()}, {userName}
              </h1>
            </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="hidden md:flex h-12 px-6 rounded-full bg-white text-black hover:bg-zinc-200 gap-2 transition-all">
                       <Plus className="w-5 h-5" /> New Entry
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#18181B] border-[#27272A] p-0 max-w-lg overflow-hidden gap-0">
                    <DialogHeader className="p-6 border-b border-[#27272A]">
                      <DialogTitle className="font-serif text-2xl font-normal text-[#FAFAFA]">Record Dream</DialogTitle>
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
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                 placeholder="Search entries..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="pl-10 h-12 rounded-xl bg-[#18181B] border-[#27272A] text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-indigo-500/20"
              />
           </div>
           
           {/* Mobile FAB or Create Button */}
           <div className="md:hidden">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                 <DialogTrigger asChild>
                    <Button className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-medium rounded-xl flex items-center justify-center gap-2">
                       <Plus className="w-5 h-5" /> New Entry
                    </Button>
                 </DialogTrigger>
                 <DialogContent className="bg-[#18181B] border-[#27272A] p-0 max-w-lg overflow-hidden gap-0">
                    <DialogHeader className="p-6 border-b border-[#27272A]">
                      <DialogTitle className="font-serif text-2xl font-normal text-[#FAFAFA]">Record Dream</DialogTitle>
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
             <div className="relative p-8 rounded-xl border border-dashed border-[#27272A] bg-[#18181B]/50 hover:bg-[#18181B] hover:border-indigo-500/30 transition-all flex flex-col items-center justify-center text-center gap-4 group-hover:shadow-lg">
                <div className="w-16 h-16 rounded-full bg-[#18181B] border border-[#27272A] flex items-center justify-center group-hover:scale-110 transition-transform">
                   <Mic className="w-6 h-6 text-zinc-400 group-hover:text-indigo-400" />
                </div>
                <div>
                   <h3 className="font-serif text-xl text-[#FAFAFA] mb-1">Tell me about your dream</h3>
                   <p className="text-zinc-500 text-sm">Tap here to start recording</p>
                </div>
             </div>
          </motion.div>
        )}

        {/* Dreams List */}
        <div className="space-y-4 pb-20">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              // Loading skeletons
              [...Array(3)].map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-40 bg-[#18181B] rounded-xl border border-[#27272A] animate-pulse"
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
                className="text-center py-24 border border-[#27272A] rounded-xl bg-[#18181B]/30"
              >
                <div className="w-16 h-16 mx-auto bg-[#18181B] rounded-full flex items-center justify-center mb-6 border border-[#27272A]">
                   <FileText className="w-6 h-6 text-zinc-500" />
                </div>
                <h3 className="font-serif text-2xl text-[#FAFAFA] mb-2">
                  {searchQuery ? "No matches found" : "Your journal is empty"}
                </h3>
                <p className="text-zinc-500 max-w-sm mx-auto">
                  {searchQuery
                    ? "Try adjusting your search terms."
                    : "Dreams are fleeting. Record your first one to start building your subconscious map."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
