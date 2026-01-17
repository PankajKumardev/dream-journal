"use client";

import { useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Dream {
  id: string;
  title: string | null;
  recordedAt: Date;
  analysis?: {
    isNightmare: boolean;
    isLucid: boolean;
    themes: string[];
  } | null;
}

interface DreamCalendarProps {
  dreams: Dream[];
}

export function DreamCalendar({ dreams }: DreamCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  // Get all days to display in calendar grid (including padding days)
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  // Group dreams by date
  const dreamsByDate = useMemo(() => {
    const map = new Map<string, Dream[]>();
    dreams.forEach((dream) => {
      const dateKey = format(new Date(dream.recordedAt), "yyyy-MM-dd");
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(dream);
    });
    return map;
  }, [dreams]);

  // Get dreams for selected day
  const selectedDayDreams = useMemo(() => {
    if (!selectedDay) return [];
    const dateKey = format(selectedDay, "yyyy-MM-dd");
    return dreamsByDate.get(dateKey) || [];
  }, [selectedDay, dreamsByDate]);

  // Navigation handlers
  const goToPreviousMonth = () => setCurrentMonth((m) => subMonths(m, 1));
  const goToNextMonth = () => setCurrentMonth((m) => addMonths(m, 1));
  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDay(new Date());
  };

  // Get dream count for a day
  const getDayDreamCount = (day: Date) => {
    const dateKey = format(day, "yyyy-MM-dd");
    return dreamsByDate.get(dateKey)?.length || 0;
  };

  // Week day headers
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="font-serif text-2xl text-foreground">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="text-xs rounded-full"
          >
            Today
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPreviousMonth}
            className="rounded-full h-8 w-8"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextMonth}
            className="rounded-full h-8 w-8"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Week day headers */}
        <div className="grid grid-cols-7 border-b border-border">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isSelected = selectedDay && isSameDay(day, selectedDay);
            const dreamCount = getDayDreamCount(day);
            const isCurrentDay = isToday(day);

            return (
              <motion.button
                key={day.toISOString()}
                onClick={() => setSelectedDay(day)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  relative p-2 min-h-[80px] md:min-h-[100px] border-b border-r border-border
                  transition-colors text-left flex flex-col
                  ${index % 7 === 6 ? "border-r-0" : ""}
                  ${index >= calendarDays.length - 7 ? "border-b-0" : ""}
                  ${isCurrentMonth ? "bg-card" : "bg-muted/30"}
                  ${isSelected ? "bg-primary/10 ring-1 ring-primary ring-inset" : ""}
                  ${isCurrentDay && !isSelected ? "bg-secondary/50" : ""}
                  hover:bg-accent/50
                `}
              >
                {/* Date number */}
                <span
                  className={`
                    text-sm font-medium
                    ${isCurrentMonth ? "text-foreground" : "text-muted-foreground/50"}
                    ${isCurrentDay ? "text-primary font-bold" : ""}
                  `}
                >
                  {format(day, "d")}
                </span>

                {/* Dream indicator - simple dots */}
                {dreamCount > 0 && (
                  <div className="mt-auto flex items-center gap-1">
                    {/* Show up to 3 dots, then number */}
                    {dreamCount <= 3 ? (
                      [...Array(dreamCount)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-primary/70"
                        />
                      ))
                    ) : (
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                        <span>{dreamCount}</span>
                      </div>
                    )}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Dreams */}
      <AnimatePresence mode="wait">
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <h3 className="font-serif text-lg text-foreground mb-4">
              {format(selectedDay, "EEEE, MMMM d, yyyy")}
            </h3>

            {selectedDayDreams.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No dreams recorded on this day.
              </p>
            ) : (
              <div className="space-y-3">
                {selectedDayDreams.map((dream) => (
                  <Link
                    key={dream.id}
                    href={`/dreams/${dream.id}`}
                    className="block p-4 rounded-lg border border-border bg-background hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Moon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {dream.title || "Untitled Dream"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(dream.recordedAt), "h:mm a")}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {dream.analysis?.isLucid && (
                          <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs border border-border">
                            Lucid
                          </span>
                        )}
                        {dream.analysis?.isNightmare && (
                          <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs border border-border">
                            Nightmare
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
        <span>= 1 dream recorded</span>
      </div>
    </div>
  );
}
