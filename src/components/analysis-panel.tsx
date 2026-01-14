"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AnalysisPanelProps {
  analysis: {
    themes: string[];
    emotions: Record<string, number>;
    symbols: string[];
    people: string[];
    settings: string[];
    isNightmare: boolean;
    isLucid: boolean;
    vividness: number;
    summary: string;
  };
}

export function AnalysisPanel({ analysis }: AnalysisPanelProps) {
  const emotions = Object.entries(analysis.emotions).sort(
    ([, a], [, b]) => b - a
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {/* Summary Card */}
      <motion.div variants={item}>
        <Card className="bg-slate-950/50 backdrop-blur-xl border border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <span>✨</span>
              <span className="bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                Dream Interpretation
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 leading-relaxed">{analysis.summary}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={item} className="grid grid-cols-3 gap-3">
        <Card className="bg-slate-950/50 backdrop-blur-xl border border-white/10 p-4 text-center">
          <div className="text-2xl mb-1">
            {analysis.isNightmare ? "😱" : analysis.isLucid ? "🌟" : "💭"}
          </div>
          <div className="text-xs text-slate-400">
            {analysis.isNightmare
              ? "Nightmare"
              : analysis.isLucid
              ? "Lucid"
              : "Regular"}
          </div>
        </Card>
        <Card className="bg-slate-950/50 backdrop-blur-xl border border-white/10 p-4 text-center">
          <div className="text-2xl font-bold text-indigo-400 mb-1">
            {analysis.vividness}
          </div>
          <div className="text-xs text-slate-400">Vividness</div>
        </Card>
        <Card className="bg-slate-950/50 backdrop-blur-xl border border-white/10 p-4 text-center">
          <div className="text-2xl font-bold text-purple-400 mb-1">
            {analysis.themes.length}
          </div>
          <div className="text-xs text-slate-400">Themes</div>
        </Card>
      </motion.div>

      {/* Emotions */}
      {emotions.length > 0 && (
        <motion.div variants={item}>
          <Card className="bg-slate-950/50 backdrop-blur-xl border border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-serif flex items-center gap-2">
                <span>💫</span>
                <span className="bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                  Emotions
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {emotions.slice(0, 5).map(([emotion, intensity], index) => (
                <div key={emotion} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300 capitalize">{emotion}</span>
                    <span className="text-slate-500">
                      {Math.round(intensity * 100)}%
                    </span>
                  </div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <Progress
                      value={intensity * 100}
                      className="h-2 bg-slate-800"
                    />
                  </motion.div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Themes */}
      {analysis.themes.length > 0 && (
        <motion.div variants={item}>
          <Card className="bg-slate-950/50 backdrop-blur-xl border border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-serif flex items-center gap-2">
                <span>🎭</span>
                <span className="bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                  Themes
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis.themes.map((theme) => (
                  <Badge
                    key={theme}
                    variant="outline"
                    className="border-indigo-500/30 text-indigo-300 bg-indigo-500/10 px-3 py-1"
                  >
                    {theme}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Details Accordion */}
      <motion.div variants={item}>
        <Accordion type="single" collapsible className="space-y-2">
          {analysis.symbols.length > 0 && (
            <AccordionItem
              value="symbols"
              className="bg-slate-950/50 backdrop-blur-xl border border-white/10 rounded-lg px-4"
            >
              <AccordionTrigger className="text-slate-300 hover:text-white">
                <span className="flex items-center gap-2">
                  <span>🔮</span> Symbols ({analysis.symbols.length})
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2 pb-2">
                  {analysis.symbols.map((symbol) => (
                    <Badge
                      key={symbol}
                      variant="outline"
                      className="border-purple-500/30 text-purple-300 bg-purple-500/10"
                    >
                      {symbol}
                    </Badge>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {analysis.people.length > 0 && (
            <AccordionItem
              value="people"
              className="bg-slate-950/50 backdrop-blur-xl border border-white/10 rounded-lg px-4"
            >
              <AccordionTrigger className="text-slate-300 hover:text-white">
                <span className="flex items-center gap-2">
                  <span>👥</span> People ({analysis.people.length})
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2 pb-2">
                  {analysis.people.map((person) => (
                    <Badge
                      key={person}
                      variant="outline"
                      className="border-teal-500/30 text-teal-300 bg-teal-500/10"
                    >
                      {person}
                    </Badge>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {analysis.settings.length > 0 && (
            <AccordionItem
              value="settings"
              className="bg-slate-950/50 backdrop-blur-xl border border-white/10 rounded-lg px-4"
            >
              <AccordionTrigger className="text-slate-300 hover:text-white">
                <span className="flex items-center gap-2">
                  <span>🏞️</span> Settings ({analysis.settings.length})
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2 pb-2">
                  {analysis.settings.map((setting) => (
                    <Badge
                      key={setting}
                      variant="outline"
                      className="border-amber-500/30 text-amber-300 bg-amber-500/10"
                    >
                      {setting}
                    </Badge>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </motion.div>
    </motion.div>
  );
}
