"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Repeat, Calendar, Link as LinkIcon, Sparkles } from "lucide-react";

// Updated Palette using CSS variables would be ideal, but for now we keep a neutral palette 
// that works decently on both, or we could use specific hexes.
// Let's us CSS variables where possible.
const COLORS = [
  "var(--foreground)",
  "var(--muted-foreground)",
  "var(--primary)",
  "#71717A",
  "#3F3F46", 
  "#A1A1AA",
];

interface ThemeChartProps {
  data: { theme: string; count: number }[];
}

export function ThemeChart({ data }: ThemeChartProps) {
  return (
    <Card className="bg-card border border-border shadow-none">
      <CardHeader className="pb-6 border-b border-border">
        <CardTitle className="text-lg font-serif font-normal text-card-foreground flex items-center gap-2">
           Recurring Themes
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.slice(0, 6)} layout="vertical">
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="theme"
                width={80}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12, fontFamily: "var(--font-sans)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "var(--accent)" }}
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--card-foreground)",
                }}
                labelStyle={{ color: "var(--muted-foreground)" }}
              />
              <Bar
                dataKey="count"
                fill="var(--foreground)"
                radius={[0, 4, 4, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

interface EmotionChartProps {
  data: { emotion: string; value: number }[];
}

export function EmotionChart({ data }: EmotionChartProps) {
  return (
    <Card className="bg-card border border-border shadow-none">
      <CardHeader className="pb-6 border-b border-border">
        <CardTitle className="text-lg font-serif font-normal text-card-foreground flex items-center gap-2">
           Emotion Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[200px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.slice(0, 6)}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                nameKey="emotion"
                stroke="none"
              >
                {data.slice(0, 6).map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--card-foreground)",
                }}
                formatter={(value) => `${Math.round((value as number) * 100)}%`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {data.slice(0, 6).map((item, index) => (
            <div key={item.emotion} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-xs text-muted-foreground capitalize">
                {item.emotion}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface DreamActivityProps {
  data: { date: string; count: number }[];
}

export function DreamActivityChart({ data }: DreamActivityProps) {
  return (
    <Card className="bg-card border border-border shadow-none">
      <CardHeader className="pb-6 border-b border-border">
        <CardTitle className="text-lg font-serif font-normal text-card-foreground flex items-center gap-2">
           Dream Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="areaStroke" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="var(--foreground)" stopOpacity={0.8} />
                   <stop offset="100%" stopColor="var(--foreground)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "var(--font-sans)" }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--card-foreground)",
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="var(--foreground)"
                strokeWidth={1.5}
                fill="url(#areaStroke)"
                fillOpacity={0.1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

interface MoodTrendProps {
  data: { date: string; mood: number; stress: number }[];
}

export function MoodTrendChart({ data }: MoodTrendProps) {
  return (
    <Card className="bg-card border border-border shadow-none">
      <CardHeader className="pb-6 border-b border-border">
        <CardTitle className="text-lg font-serif font-normal text-card-foreground flex items-center gap-2">
           Mood & Stress Trends
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis
                dataKey="date"
                tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "var(--font-sans)" }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis hide domain={[0, 10]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--card-foreground)",
                }}
              />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="var(--foreground)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "var(--foreground)" }}
                name="Mood"
              />
              <Line
                type="monotone"
                dataKey="stress"
                stroke="var(--muted-foreground)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "var(--muted-foreground)" }}
                name="Stress"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Legend */}
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-foreground" />
            <span className="text-xs text-muted-foreground uppercase tracking-widest">Mood</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-muted-foreground" />
            <span className="text-xs text-muted-foreground uppercase tracking-widest">Stress</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface PatternCardProps {
  pattern: {
    patternType: string;
    patternData: Record<string, unknown>;
    confidence: number;
    occurrenceCount: number;
  };
}

export function PatternCard({ pattern }: PatternCardProps) {
  const getPatternIcon = () => {
    switch (pattern.patternType) {
      case "recurring_theme":
        return <Repeat className="w-5 h-5" />;
      case "temporal":
        return <Calendar className="w-5 h-5" />;
      case "correlation":
        return <LinkIcon className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getPatternTitle = () => {
    switch (pattern.patternType) {
      case "recurring_theme":
        return `Recurring: ${(pattern.patternData as { theme?: string }).theme}`;
      case "temporal":
        return `${(pattern.patternData as { day?: string }).day} Pattern`;
      case "correlation":
        return "Stress-Nightmare Link";
      default:
        return "Pattern Detected";
    }
  };

  const getPatternDescription = () => {
    switch (pattern.patternType) {
      case "recurring_theme":
        return `This theme appears in ${pattern.occurrenceCount} of your dreams`;
      case "temporal":
        return `${Math.round(
          ((pattern.patternData as { nightmareRate?: number }).nightmareRate || 0) * 100
        )}% nightmare rate on this day`;
      case "correlation":
        return (pattern.patternData as { message?: string }).message || "";
      default:
        return "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-muted/50 border border-border rounded-lg text-muted-foreground">
          {getPatternIcon()}
        </div>
        <div className="flex-1">
          <h4 className="font-serif text-lg text-card-foreground font-light">{getPatternTitle()}</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            {getPatternDescription()}
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pattern.confidence * 100}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-foreground opacity-80"
              />
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {Math.round(pattern.confidence * 100)}% confidence
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
