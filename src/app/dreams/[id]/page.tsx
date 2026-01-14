"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatRelativeTime } from "@/lib/utils";
import { 
  ArrowLeft, 
  Clock, 
  FileText, 
  Sparkles, 
  Brain, 
  Activity, 
  Moon, 
  Share2, 
  Trash2, 
  Download,
  AlertCircle,
  Eye,
  Link as LinkIcon
} from "lucide-react";

interface Dream {
  id: string;
  title: string | null;
  transcript: string;
  recordedAt: string;
  moodBefore: number | null;
  stressLevel: number | null;
  sleepQuality: number | null;
  embeddingStatus: string;
  analysis: {
    analysisStatus: string;
    themes: string[];
    emotions: Record<string, number>;
    symbols: string[];
    people: string[];
    settings: string[];
    isNightmare: boolean;
    isLucid: boolean;
    vividness: number;
    summary: string;
  } | null;
}

interface SimilarDream {
  id: string;
  title: string | null;
  transcript: string;
  recordedAt: string;
  similarity: number;
}

export default function DreamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [dream, setDream] = useState<Dream | null>(null);
  const [similarDreams, setSimilarDreams] = useState<SimilarDream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    fetchDream();
  }, [id]);

  useEffect(() => {
    if (dream?.analysis?.analysisStatus === "done") {
      fetchSimilarDreams();
    }
  }, [dream?.analysis?.analysisStatus]);

  // Poll for analysis completion
  useEffect(() => {
    if (dream && (!dream.analysis || dream.analysis.analysisStatus === "pending")) {
      const interval = setInterval(fetchDream, 3000);
      return () => clearInterval(interval);
    }
  }, [dream]);

  const fetchDream = async () => {
    try {
      const res = await fetch(`/api/dreams/${id}`);
      if (res.ok) {
        const data = await res.json();
        setDream(data);
      } else if (res.status === 404) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error fetching dream:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSimilarDreams = async () => {
    try {
      const res = await fetch(`/api/dreams/${id}/similar`);
      if (res.ok) {
        const data = await res.json();
        setSimilarDreams(data);
      }
    } catch (error) {
      console.error("Error fetching similar dreams:", error);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/dreams/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error deleting dream:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExport = async (format: "pdf" | "md") => {
    try {
      const res = await fetch(`/api/export/${format}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dreamIds: [id] }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `dream-${id}.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error exporting dream:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090B] pb-24 md:pt-28">
        <Navigation />
        <main className="max-w-4xl mx-auto px-6">
          <Skeleton className="h-8 w-48 mb-8 bg-[#18181B]" />
          <div className="space-y-6">
             <Skeleton className="h-12 w-3/4 bg-[#18181B]" />
             <div className="grid md:grid-cols-2 gap-6">
               <Skeleton className="h-64 bg-[#18181B]" />
               <Skeleton className="h-64 bg-[#18181B]" />
             </div>
          </div>
        </main>
      </div>
    );
  }

  if (!dream) return null;

  const isAnalyzing = !dream.analysis || dream.analysis.analysisStatus === "pending";

  return (
    <div className="min-h-screen bg-[#09090B] pb-24 pt-24 md:pt-28 text-[#FAFAFA]">
      <Navigation />

      <main className="max-w-4xl mx-auto px-6">
        {/* Navigation & Actions */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="text-zinc-500 hover:text-white pl-0 hover:bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dreams
          </Button>
          
          <div className="flex gap-2">
             <Button
                variant="outline"
                size="icon"
                onClick={() => handleExport("md")}
                className="border-[#27272A] bg-transparent text-zinc-400 hover:text-white hover:bg-[#27272A]"
             >
                <Download className="w-4 h-4" />
             </Button>
             <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogTrigger asChild>
                   <Button
                      variant="outline"
                      size="icon"
                      className="border-[#27272A] bg-transparent text-zinc-400 hover:text-rose-400 hover:bg-rose-950/20 hover:border-rose-900/50"
                   >
                      <Trash2 className="w-4 h-4" />
                   </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#18181B] border-[#27272A]">
                   <DialogHeader>
                      <DialogTitle className="text-[#FAFAFA]">Delete Entry?</DialogTitle>
                   </DialogHeader>
                   <p className="text-zinc-400">This action cannot be undone.</p>
                   <DialogFooter>
                      <Button variant="ghost" onClick={() => setShowDeleteDialog(false)} className="text-zinc-400">Cancel</Button>
                      <Button variant="destructive" onClick={handleDelete} className="bg-rose-600">Delete</Button>
                   </DialogFooter>
                </DialogContent>
             </Dialog>
          </div>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col gap-4">
             <div>
                <h1 className="font-serif text-4xl md:text-5xl text-[#FAFAFA] mb-3 leading-tight">
                  {dream.title || "Untitled Dream"}
                </h1>
                <div className="flex items-center gap-4 text-zinc-500 text-sm">
                   <span>{formatRelativeTime(new Date(dream.recordedAt))}</span>
                   
                   {/* Badges */}
                   {dream.analysis?.isLucid && (
                      <Badge variant="outline" className="border-indigo-500/30 text-indigo-300 bg-indigo-500/10 font-normal">
                         Lucid Dream
                      </Badge>
                   )}
                   {dream.analysis?.isNightmare && (
                      <Badge variant="outline" className="border-rose-500/30 text-rose-300 bg-rose-500/10 font-normal">
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
            <Card className="bg-[#18181B] border border-[#27272A] shadow-none h-full">
              <CardHeader className="border-b border-[#27272A] pb-4">
                <CardTitle className="font-serif text-lg font-normal text-[#FAFAFA] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-zinc-500" />
                  Dream Transcript
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap font-light text-lg">
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
             <Card className="bg-[#18181B] border border-[#27272A] shadow-none h-full">
              <CardHeader className="border-b border-[#27272A] pb-4">
                <CardTitle className="font-serif text-lg font-normal text-[#FAFAFA] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-zinc-500" />
                  Dream Interpretation
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                 {isAnalyzing ? (
                    <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                       <Sparkles className="w-6 h-6 animate-spin mb-4" />
                       <p>Analyzing connections...</p>
                    </div>
                 ) : (
                    <div className="space-y-6">
                       <p className="text-zinc-300 leading-relaxed font-light text-lg">
                          {dream.analysis?.summary}
                       </p>
                       
                       {/* Themes Tags */}
                       {dream.analysis?.themes && (
                          <div className="flex flex-wrap gap-2 pt-4 border-t border-[#27272A]">
                             {dream.analysis.themes.map(theme => (
                                <span key={theme} className="text-xs px-2 py-1 rounded-md bg-[#27272A] text-zinc-300 border border-zinc-700">
                                   #{theme}
                                </span>
                             ))}
                          </div>
                       )}
                    </div>
                 )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Pre-Sleep State */}
          {(dream.moodBefore || dream.stressLevel || dream.sleepQuality) && (
             <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
             >
                <Card className="bg-[#18181B] border border-[#27272A] shadow-none">
                   <CardHeader className="border-b border-[#27272A] pb-4">
                      <CardTitle className="font-serif text-lg font-normal text-[#FAFAFA] flex items-center gap-2">
                         <Moon className="w-4 h-4 text-zinc-500" />
                         Pre-Sleep State
                      </CardTitle>
                   </CardHeader>
                   <CardContent className="pt-6 grid grid-cols-3 gap-6">
                      {dream.moodBefore && (
                         <div className="text-center">
                            <div className="text-2xl mb-2">
                               {dream.moodBefore > 7 ? "😊" : dream.moodBefore > 4 ? "😐" : "😔"}
                            </div>
                            <div className="text-xl font-serif text-[#FAFAFA]">{dream.moodBefore}/10</div>
                            <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Mood</div>
                         </div>
                      )}
                      {dream.stressLevel && (
                         <div className="text-center">
                            <div className="text-2xl mb-2">
                               {dream.stressLevel > 7 ? "😰" : dream.stressLevel > 4 ? "😐" : "😌"}
                            </div>
                            <div className="text-xl font-serif text-[#FAFAFA]">{dream.stressLevel}/10</div>
                            <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Stress</div>
                         </div>
                      )}
                      {dream.sleepQuality && (
                         <div className="text-center">
                            <div className="text-2xl mb-2">
                               {dream.sleepQuality > 7 ? "😴" : dream.sleepQuality > 4 ? "😐" : "😫"}
                            </div>
                            <div className="text-xl font-serif text-[#FAFAFA]">{dream.sleepQuality}/10</div>
                            <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Sleep</div>
                         </div>
                      )}
                   </CardContent>
                </Card>
             </motion.div>
          )}

          {/* Similar Dreams */}
          {similarDreams.length > 0 && (
             <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
             >
                <Card className="bg-[#18181B] border border-[#27272A] shadow-none">
                   <CardHeader className="border-b border-[#27272A] pb-4">
                      <CardTitle className="font-serif text-lg font-normal text-[#FAFAFA] flex items-center gap-2">
                         <LinkIcon className="w-4 h-4 text-zinc-500" />
                         Related Dreams
                      </CardTitle>
                   </CardHeader>
                   <CardContent className="pt-6 space-y-3">
                      {similarDreams.map(similar => (
                         <div 
                            key={similar.id}
                            onClick={() => router.push(`/dreams/${similar.id}`)}
                            className="p-4 rounded-lg bg-[#09090B] border border-[#27272A] hover:border-zinc-500 transition-colors cursor-pointer group"
                         >
                            <div className="flex justify-between items-center mb-2">
                               <h4 className="text-zinc-200 font-medium group-hover:text-white transition-colors">
                                  {similar.title || "Untitled"}
                               </h4>
                               <Badge variant="secondary" className="bg-[#18181B] text-zinc-500 border border-[#27272A]">
                                  {Math.round(similar.similarity * 100)}% match
                               </Badge>
                            </div>
                            <p className="text-zinc-500 text-sm line-clamp-2">
                               {similar.transcript}
                            </p>
                         </div>
                      ))}
                   </CardContent>
                </Card>
             </motion.div>
          )}

        </div>
      </main>
    </div>
  );
}
