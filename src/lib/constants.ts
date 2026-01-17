/**
 * Application-wide constants
 * Extract magic numbers and configuration values here
 */

// Pagination
export const PAGINATION = {
  DREAMS_PER_PAGE: 20,
  PATTERNS_LIMIT: 20,
  THEMES_LIMIT: 10,
  EMOTIONS_LIMIT: 10,
} as const;

// Polling & Timing
export const TIMING = {
  ANALYSIS_POLL_INTERVAL: 5000, // 5 seconds
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  DEBOUNCE_DELAY: 300, // 300ms
} as const;

// Cache Revalidation (seconds)
export const CACHE_REVALIDATION = {
  DREAMS: 60, // 1 minute
  STATS: 120, // 2 minutes
  PATTERNS: 300, // 5 minutes
  SINGLE_DREAM: 60, // 1 minute
} as const;

// Rate Limiting
export const RATE_LIMITS = {
  DREAMS_CREATE: { requests: 10, window: 60 }, // 10 dreams per minute
  TRANSCRIBE: { requests: 20, window: 60 }, // 20 transcriptions per minute
  ANALYZE: { requests: 10, window: 60 }, // 10 analyses per minute
  REPORT_GENERATE: { requests: 5, window: 300 }, // 5 reports per 5 minutes
  DEFAULT: { requests: 100, window: 60 }, // 100 requests per minute
} as const;

// AI Configuration
export const AI_CONFIG = {
  GROQ_MODEL: "llama-3.3-70b-versatile",
  MAX_RETRIES: 3,
  ANALYSIS_MAX_TOKENS: 1000,
  REPORT_MAX_TOKENS: 500,
  ANALYSIS_TEMPERATURE: 0.3,
  REPORT_TEMPERATURE: 0.7,
} as const;

// Pattern Detection
export const PATTERN_CONFIG = {
  MIN_THEME_OCCURRENCES: 2,
  MIN_DREAMS_FOR_TEMPORAL: 5,
  MIN_DREAMS_FOR_CORRELATION: 5,
  STRESS_THRESHOLD: 7,
  TEMPORAL_NIGHTMARE_THRESHOLD: 0.5,
  TEMPORAL_CONFIDENCE_THRESHOLD: 0.4,
} as const;

// UI Configuration
export const UI_CONFIG = {
  SKELETON_COUNT: 3,
  ANIMATION_STAGGER_DELAY: 0.05,
  TOAST_DURATION: 5000,
  MAX_DREAM_TITLE_LENGTH: 50,
} as const;
