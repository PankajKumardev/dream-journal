import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types
export interface Dream {
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

export interface Stats {
  totalDreams: number;
  analyzedDreams: number;
  nightmareCount: number;
  lucidCount: number;
  avgVividness: number;
  themes: { theme: string; count: number }[];
  emotions: { emotion: string; value: number }[];
  activity: { date: string; count: number }[];
  moodTrend: { date: string; mood: number; stress: number }[];
}

export interface Pattern {
  id: string;
  patternType: string;
  patternData: Record<string, unknown>;
  confidence: number;
  occurrenceCount: number;
}

export interface WeeklyReport {
  id: string;
  weekStart: string;
  content: string;
  stats: Record<string, unknown>;
  createdAt: string;
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

// Store State
interface DreamStore {
  // User
  user: User | null;
  userLoading: boolean;

  // Dreams
  dreams: Dream[];
  dreamsLoading: boolean;
  dreamsFetched: boolean;
  hasMoreDreams: boolean;
  dreamsOffset: number;

  // Stats
  stats: Stats | null;
  statsLoading: boolean;
  statsFetched: boolean;

  // Patterns
  patterns: Pattern[];
  patternsLoading: boolean;
  patternsFetched: boolean;

  // Weekly Report
  weeklyReport: WeeklyReport | null;
  reportLoading: boolean;

  // Cache timestamps
  lastFetchedAt: {
    dreams: number | null;
    stats: number | null;
    patterns: number | null;
    user: number | null;
  };

  // Actions
  setUser: (user: User | null) => void;
  setDreams: (dreams: Dream[]) => void;
  addDream: (dream: Dream) => void;
  updateDream: (id: string, updates: Partial<Dream>) => void;
  removeDream: (id: string) => void;
  setStats: (stats: Stats | null) => void;
  setPatterns: (patterns: Pattern[]) => void;
  setWeeklyReport: (report: WeeklyReport | null) => void;

  // Async actions
  fetchUser: () => Promise<void>;
  fetchDreams: (force?: boolean) => Promise<void>;
  fetchMoreDreams: () => Promise<void>;
  fetchStats: (force?: boolean) => Promise<void>;
  fetchPatterns: (force?: boolean) => Promise<void>;
  fetchWeeklyReport: () => Promise<void>;
  createDream: (data: {
    transcript: string;
    moodBefore?: number;
    stressLevel?: number;
    sleepQuality?: number;
  }) => Promise<Dream>;
  deleteDream: (id: string) => Promise<void>;
  generateReport: () => Promise<WeeklyReport | null>;

  // Reset
  reset: () => void;
}

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

const isCacheValid = (timestamp: number | null): boolean => {
  if (!timestamp) return false;
  return Date.now() - timestamp < CACHE_DURATION;
};

export const useDreamStore = create<DreamStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      userLoading: false,

      dreams: [],
      dreamsLoading: false,
      dreamsFetched: false,
      hasMoreDreams: true,
      dreamsOffset: 0,

      stats: null,
      statsLoading: false,
      statsFetched: false,

      patterns: [],
      patternsLoading: false,
      patternsFetched: false,

      weeklyReport: null,
      reportLoading: false,

      lastFetchedAt: {
        dreams: null,
        stats: null,
        patterns: null,
        user: null,
      },

      // Setters
      setUser: (user) => set({ user }),
      setDreams: (dreams) => set({ dreams, dreamsFetched: true }),
      addDream: (dream) =>
        set((state) => ({
          dreams: [dream, ...state.dreams],
          // Invalidate stats and patterns cache when new dream is added
          lastFetchedAt: { ...state.lastFetchedAt, stats: null, patterns: null },
        })),
      updateDream: (id, updates) =>
        set((state) => ({
          dreams: state.dreams.map((d) =>
            d.id === id ? { ...d, ...updates } : d
          ),
        })),
      removeDream: (id) =>
        set((state) => ({
          dreams: state.dreams.filter((d) => d.id !== id),
          // Invalidate stats cache when dream is deleted
          lastFetchedAt: { ...state.lastFetchedAt, stats: null },
        })),
      setStats: (stats) => set({ stats, statsFetched: true }),
      setPatterns: (patterns) => set({ patterns, patternsFetched: true }),
      setWeeklyReport: (weeklyReport) => set({ weeklyReport }),

      // Async actions
      fetchUser: async () => {
        const state = get();
        // Prevent duplicate calls
        if (state.userLoading) return;
        if (isCacheValid(state.lastFetchedAt.user) && state.user) return;

        set({ userLoading: true });
        try {
          const res = await fetch("/api/user");
          if (res.ok) {
            const data = await res.json();
            set({
              user: data,
              lastFetchedAt: { ...get().lastFetchedAt, user: Date.now() },
            });
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        } finally {
          set({ userLoading: false });
        }
      },

      fetchDreams: async (force = false) => {
        const state = get();
        // Prevent duplicate calls
        if (state.dreamsLoading) return;
        // Reset pagination if forcing refresh or if not fetched
        if (!force && isCacheValid(state.lastFetchedAt.dreams) && state.dreamsFetched)
          return;

        set({ dreamsLoading: true, dreamsOffset: 0 });
        try {
          // Fetch first 20 dreams
          const res = await fetch("/api/dreams?limit=20&offset=0");
          if (res.ok) {
            const data = await res.json();
            set({
              dreams: data,
              dreamsFetched: true,
              hasMoreDreams: data.length === 20,
              dreamsOffset: 20,
              lastFetchedAt: { ...get().lastFetchedAt, dreams: Date.now() },
            });
          }
        } catch (error) {
          console.error("Error fetching dreams:", error);
        } finally {
          set({ dreamsLoading: false });
        }
      },

      fetchMoreDreams: async () => {
        const state = get();
        if (state.dreamsLoading || !state.hasMoreDreams) return;

        set({ dreamsLoading: true });
        try {
          const limit = 20;
          const offset = state.dreamsOffset;
          const res = await fetch(`/api/dreams?limit=${limit}&offset=${offset}`);
          
          if (res.ok) {
            const newDreams = await res.json();
            set({
              dreams: [...state.dreams, ...newDreams],
              hasMoreDreams: newDreams.length === limit,
              dreamsOffset: offset + limit,
            });
          }
        } catch (error) {
          console.error("Error fetching more dreams:", error);
        } finally {
          set({ dreamsLoading: false });
        }
      },

      fetchStats: async (force = false) => {
        const state = get();
        if (!force && isCacheValid(state.lastFetchedAt.stats) && state.statsFetched)
          return;

        set({ statsLoading: true });
        try {
          const res = await fetch("/api/stats");
          if (res.ok) {
            const data = await res.json();
            set({
              stats: data,
              statsFetched: true,
              lastFetchedAt: { ...get().lastFetchedAt, stats: Date.now() },
            });
          }
        } catch (error) {
          console.error("Error fetching stats:", error);
        } finally {
          set({ statsLoading: false });
        }
      },

      fetchPatterns: async (force = false) => {
        const state = get();
        if (
          !force &&
          isCacheValid(state.lastFetchedAt.patterns) &&
          state.patternsFetched
        )
          return;

        set({ patternsLoading: true });
        try {
          const res = await fetch("/api/patterns");
          if (res.ok) {
            const data = await res.json();
            set({
              patterns: data,
              patternsFetched: true,
              lastFetchedAt: { ...get().lastFetchedAt, patterns: Date.now() },
            });
          }
        } catch (error) {
          console.error("Error fetching patterns:", error);
        } finally {
          set({ patternsLoading: false });
        }
      },

      fetchWeeklyReport: async () => {
        set({ reportLoading: true });
        try {
          const res = await fetch("/api/reports/latest");
          if (res.ok) {
            const data = await res.json();
            set({ weeklyReport: data });
          }
        } catch (error) {
          console.error("Error fetching weekly report:", error);
        } finally {
          set({ reportLoading: false });
        }
      },

      createDream: async (data) => {
        const res = await fetch("/api/dreams", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error("Failed to create dream");

        const newDream = await res.json();
        get().addDream(newDream);

        // Trigger async analysis
        fetch(`/api/dreams/${newDream.id}/analyze`, { method: "POST" });

        return newDream;
      },

      deleteDream: async (id) => {
        const res = await fetch(`/api/dreams/${id}`, { method: "DELETE" });
        if (res.ok) {
          get().removeDream(id);
        }
      },

      generateReport: async () => {
        set({ reportLoading: true });
        try {
          const res = await fetch("/api/reports/generate", { method: "POST" });
          if (res.ok) {
            const report = await res.json();
            set({ weeklyReport: report });
            return report;
          }
          return null;
        } catch (error) {
          console.error("Error generating report:", error);
          return null;
        } finally {
          set({ reportLoading: false });
        }
      },

      reset: () =>
        set({
          user: null,
          dreams: [],
          dreamsFetched: false,
          stats: null,
          statsFetched: false,
          patterns: [],
          patternsFetched: false,
          weeklyReport: null,
          lastFetchedAt: {
            dreams: null,
            stats: null,
            patterns: null,
            user: null,
          },
        }),
    }),
    {
      name: "dream-store",
      partialize: (state) => ({
        // Only persist these fields
        dreams: state.dreams,
        stats: state.stats,
        patterns: state.patterns,
        user: state.user,
        lastFetchedAt: state.lastFetchedAt,
      }),
    }
  )
);
