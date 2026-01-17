"use client";

import Link from "next/link";
import { formatRelativeTime, truncate } from "@/lib/utils";
import { AlertCircle, Loader2, Eye, Clock, ArrowRight } from "lucide-react";

interface DreamCardProps {
  dream: {
    id: string;
    title?: string | null;
    transcript: string;
    recordedAt: Date;
    moodBefore?: number | null;
    analysis?: {
      analysisStatus: string;
      themes: string[];
      isNightmare: boolean;
      isLucid: boolean;
      vividness: number;
      summary: string;
    } | null;
  };
  disableLink?: boolean;
}

export function DreamCard({ dream, disableLink = false }: DreamCardProps) {
  const isAnalyzing = !dream.analysis || dream.analysis.analysisStatus === "pending";
  const themes = dream.analysis?.themes || [];

  const cardContent = (
     <div className="relative rounded-xl border border-border bg-card transition-all duration-200 hover:border-accent hover:bg-accent/50 overflow-hidden">
        
        <div className="p-6 space-y-4">
           {/* Header */}
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                 <Clock className="w-3 h-3" />
                 {formatRelativeTime(new Date(dream.recordedAt))}
              </div>
              
              <div className="flex gap-2">
                 {isAnalyzing && (
                    <span className="flex items-center gap-1 text-xs text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
                       <Loader2 className="w-3 h-3 animate-spin" /> Analyzing
                    </span>
                 )}
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
           
           {/* Footer Information */}
           <div className="pt-4 border-t border-border flex items-center justify-between">
              {/* Themes */}
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

        {/* Vividness Bar (Subtle) */}
        {dream.analysis?.vividness && (
           <div className="absolute bottom-0 left-0 w-full h-0.5 bg-muted">
              <div 
                 className="h-full bg-indigo-500 opacity-50" 
                 style={{ width: `${dream.analysis.vividness * 10}%` }} 
              />
           </div>
        )}
     </div>
  );

  if (disableLink) {
    return <div className="block group cursor-pointer">{cardContent}</div>;
  }

  return (
    <Link href={`/dreams/${dream.id}`} className="block group">
       {cardContent}
    </Link>
  );
}

