"use client";

import { useState, useEffect, use, useRef } from "react";
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
import { useDreamStore, Dream } from "@/lib/store";
import { 
  ArrowLeft, 
  FileText, 
  Brain, 
  Moon, 
  Trash2, 
  Download,
  Link as LinkIcon,
  Loader2
} from "lucide-react";

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
  const [isExporting, setIsExporting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { dreams, deleteDream, updateDream } = useDreamStore();

  // Track if initial fetch is done
  const hasFetchedRef = useRef(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Try to get dream from store first (instant load) - only on mount
  useEffect(() => {
    const cachedDream = dreams.find((d) => d.id === id);
    if (cachedDream) {
      setDream(cachedDream);
      setIsLoading(false);
    }
    
    // Only fetch once on mount
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchDreamData();
    }
  }, [id]);

  useEffect(() => {
    if (dream?.analysis?.analysisStatus === "done") {
      fetchSimilarDreams();
      // Stop polling when done
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    }
  }, [dream?.analysis?.analysisStatus]);

  // Poll for analysis completion - only if pending
  useEffect(() => {
    const isPending = dream && (!dream.analysis || dream.analysis.analysisStatus === "pending");

    if (isPending && !pollingRef.current) {
      pollingRef.current = setInterval(fetchDreamData, 3000);
    }

    if (!isPending && pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [dream?.analysis?.analysisStatus]);

  const fetchDreamData = async () => {
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
      await deleteDream(id);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error deleting dream:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExport = async (format: "pdf" | "md") => {
    setIsExporting(true);
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
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-24 md:pt-28">
        <Navigation />
        <main className="max-w-4xl mx-auto px-6">
          <Skeleton className="h-8 w-48 mb-8 bg-card" />
          <div className="space-y-6">
             <Skeleton className="h-12 w-3/4 bg-card" />
             <div className="grid md:grid-cols-2 gap-6">
               <Skeleton className="h-64 bg-card" />
               <Skeleton className="h-64 bg-card" />
             </div>
          </div>
        </main>
      </div>
    );
  }

  if (!dream) return null;

  const isAnalyzing = !dream.analysis || dream.analysis.analysisStatus === "pending";

  return (
    <div className="min-h-screen bg-background pb-24 pt-24 md:pt-28 text-foreground transition-colors duration-300">
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
            className="text-muted-foreground hover:text-foreground pl-0 hover:bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dreams
          </Button>
          
          <div className="flex gap-2">
             <Button
                variant="outline"
                size="icon"
                onClick={() => handleExport("md")}
                disabled={isExporting}
                className="border-border bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-50"
             >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
             </Button>
             <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogTrigger asChild>
                   <Button
                      variant="outline"
                      size="icon"
                      className="border-border bg-transparent text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:border-rose-200 dark:hover:border-rose-900/50"
                   >
                      <Trash2 className="w-4 h-4" />
                   </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                   <DialogHeader>
                      <DialogTitle className="text-foreground">Delete Entry?</DialogTitle>
                   </DialogHeader>
                   <p className="text-muted-foreground">This action cannot be undone.</p>
                   <DialogFooter>
                      <Button variant="ghost" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting} className="text-muted-foreground">Cancel</Button>
                      <Button variant="destructive" onClick={handleDelete} disabled={isDeleting} className="bg-rose-600 hover:bg-rose-700">
                        {isDeleting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          "Delete"
                        )}
                      </Button>
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
                <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-3 leading-tight">
                  {dream.title || "Untitled Dream"}
                </h1>
                <div className="flex items-center gap-4 text-muted-foreground text-sm">
                   <span>{formatRelativeTime(new Date(dream.recordedAt))}</span>
                   
                   {/* Badges */}
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
                  <Brain className="w-4 h-4 text-muted-foreground" />
                  Dream Interpretation
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                 {isAnalyzing ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                       <Loader2 className="w-6 h-6 animate-spin mb-4" />
                       <p>Analyzing connections...</p>
                    </div>
                 ) : (
                    <div className="space-y-4">
                       {/* Summary */}
                       <p className="text-card-foreground/80 leading-relaxed font-light">
                          {dream.analysis?.summary}
                       </p>
                       
                       {/* Psychological Interpretations - Collapsible */}
                       {dream.analysis?.interpretation && (
                         <details className="group pt-2">
                           <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 select-none">
                             <span className="text-xs">▶</span>
                             <span className="group-open:hidden">Show psychological analysis</span>
                             <span className="hidden group-open:inline">Hide psychological analysis</span>
                           </summary>
                           <div className="mt-4 space-y-4 text-sm">
                             {/* Jungian */}
                             {dream.analysis.interpretation.jungian && (
                               <div>
                                 <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                                   Jungian
                                 </h4>
                                 <p className="text-muted-foreground leading-relaxed">
                                   {dream.analysis.interpretation.jungian}
                                 </p>
                               </div>
                             )}
                             
                             {/* Freudian */}
                             {dream.analysis.interpretation.freudian && (
                               <div>
                                 <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                                   Freudian
                                 </h4>
                                 <p className="text-muted-foreground leading-relaxed">
                                   {dream.analysis.interpretation.freudian}
                                 </p>
                               </div>
                             )}
                             
                             {/* Action Advice */}
                             {dream.analysis.interpretation.actionAdvice && (
                               <div className="pt-2 border-t border-border">
                                 <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                                   Reflection
                                 </h4>
                                 <p className="text-muted-foreground leading-relaxed">
                                   {dream.analysis.interpretation.actionAdvice}
                                 </p>
                               </div>
                             )}
                           </div>
                         </details>
                       )}
                       
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
                <Card className="bg-card border border-border shadow-none">
                   <CardHeader className="border-b border-border pb-4">
                      <CardTitle className="font-serif text-lg font-normal text-card-foreground flex items-center gap-2">
                         <Moon className="w-4 h-4 text-muted-foreground" />
                         Pre-Sleep State
                      </CardTitle>
                   </CardHeader>
                   <CardContent className="pt-6 grid grid-cols-3 gap-6">
                      {dream.moodBefore && (
                         <div className="text-center">
                            <div className="text-2xl mb-2">
                               {dream.moodBefore > 7 ? "😊" : dream.moodBefore > 4 ? "😐" : "😔"}
                            </div>
                            <div className="text-xl font-serif text-card-foreground">{dream.moodBefore}/10</div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Mood</div>
                         </div>
                      )}
                      {dream.stressLevel && (
                         <div className="text-center">
                            <div className="text-2xl mb-2">
                               {dream.stressLevel > 7 ? "😰" : dream.stressLevel > 4 ? "😐" : "😌"}
                            </div>
                            <div className="text-xl font-serif text-card-foreground">{dream.stressLevel}/10</div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Stress</div>
                         </div>
                      )}
                      {dream.sleepQuality && (
                         <div className="text-center">
                            <div className="text-2xl mb-2">
                               {dream.sleepQuality > 7 ? "😴" : dream.sleepQuality > 4 ? "😐" : "😫"}
                            </div>
                            <div className="text-xl font-serif text-card-foreground">{dream.sleepQuality}/10</div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Sleep</div>
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
                <Card className="bg-card border border-border shadow-none">
                   <CardHeader className="border-b border-border pb-4">
                      <CardTitle className="font-serif text-lg font-normal text-card-foreground flex items-center gap-2">
                         <LinkIcon className="w-4 h-4 text-muted-foreground" />
                         Related Dreams
                      </CardTitle>
                   </CardHeader>
                   <CardContent className="pt-6 space-y-3">
                      {similarDreams.map(similar => (
                         <div 
                            key={similar.id}
                            onClick={() => router.push(`/dreams/${similar.id}`)}
                            className="p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/50 transition-colors cursor-pointer group"
                         >
                            <div className="flex justify-between items-center mb-2">
                               <h4 className="text-foreground/90 font-medium group-hover:text-foreground transition-colors">
                                  {similar.title || "Untitled"}
                               </h4>
                               <Badge variant="secondary" className="bg-muted text-muted-foreground border border-border">
                                  {Math.round(similar.similarity * 100)}% match
                               </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm line-clamp-2">
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
