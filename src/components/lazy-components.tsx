"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Loading fallbacks
const ChartSkeleton = () => (
  <div className="w-full h-[300px] bg-card rounded-xl border border-border animate-pulse flex items-center justify-center">
    <div className="text-muted-foreground text-sm">Loading chart...</div>
  </div>
);

const PatternSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <Skeleton key={i} className="h-24 bg-card" />
    ))}
  </div>
);

// Lazy load chart components
export const LazyThemeChart = dynamic(
  () => import("@/components/pattern-chart").then((mod) => mod.ThemeChart),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
);

export const LazyEmotionChart = dynamic(
  () => import("@/components/pattern-chart").then((mod) => mod.EmotionChart),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
);

export const LazyDreamActivityChart = dynamic(
  () => import("@/components/pattern-chart").then((mod) => mod.DreamActivityChart),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
);

export const LazyMoodTrendChart = dynamic(
  () => import("@/components/pattern-chart").then((mod) => mod.MoodTrendChart),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
);

export const LazyPatternCard = dynamic(
  () => import("@/components/pattern-chart").then((mod) => mod.PatternCard),
  {
    loading: () => <Skeleton className="h-24 bg-card" />,
    ssr: false,
  }
);

// Lazy load PDF export functionality
export const LazyPDFExport = dynamic(
  () => import("jspdf").then((mod) => {
    // Return a wrapper component that exposes jsPDF
    const jsPDF = mod.default;
    return function PDFExportWrapper({ onReady }: { onReady: (pdf: typeof jsPDF) => void }) {
      onReady(jsPDF);
      return null;
    };
  }),
  {
    loading: () => null,
    ssr: false,
  }
);

// Export all lazy components
export const LazyCharts = {
  ThemeChart: LazyThemeChart,
  EmotionChart: LazyEmotionChart,
  DreamActivityChart: LazyDreamActivityChart,
  MoodTrendChart: LazyMoodTrendChart,
  PatternCard: LazyPatternCard,
};
