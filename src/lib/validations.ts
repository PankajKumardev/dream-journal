/**
 * API Input Validation Schemas using Zod
 * Provides type-safe validation for all API endpoints
 */

import { z } from "zod";

// Dream creation schema
export const createDreamSchema = z.object({
  transcript: z
    .string()
    .min(10, "Dream description must be at least 10 characters")
    .max(10000, "Dream description must be less than 10,000 characters"),
  moodBefore: z
    .number()
    .int()
    .min(1, "Mood must be between 1-10")
    .max(10, "Mood must be between 1-10")
    .optional()
    .nullable(),
  stressLevel: z
    .number()
    .int()
    .min(1, "Stress level must be between 1-10")
    .max(10, "Stress level must be between 1-10")
    .optional()
    .nullable(),
  sleepQuality: z
    .number()
    .int()
    .min(1, "Sleep quality must be between 1-10")
    .max(10, "Sleep quality must be between 1-10")
    .optional()
    .nullable(),
});

// Dream update schema
export const updateDreamSchema = z.object({
  title: z
    .string()
    .max(100, "Title must be less than 100 characters")
    .optional(),
  moodBefore: z.number().int().min(1).max(10).optional().nullable(),
  stressLevel: z.number().int().min(1).max(10).optional().nullable(),
  sleepQuality: z.number().int().min(1).max(10).optional().nullable(),
});

// Audio transcription schema
export const transcribeAudioSchema = z.object({
  audio: z
    .string()
    .min(50, "Audio data is required")
    .refine(
      (val) => val.startsWith("data:audio/") || val.startsWith("data:application/"),
      "Invalid audio format"
    ),
});

// Report generation schema (for weekly report request)
export const generateReportSchema = z.object({
  weekStartDate: z
    .string()
    .datetime()
    .optional(),
});

// Pagination schema (for query params which are always strings)
export const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

// Theme query schema
export const themeQuerySchema = z.object({
  theme: z
    .string()
    .min(1, "Theme is required")
    .max(100, "Theme must be less than 100 characters"),
});

// Types inferred from schemas
export type CreateDreamInput = z.infer<typeof createDreamSchema>;
export type UpdateDreamInput = z.infer<typeof updateDreamSchema>;
export type TranscribeAudioInput = z.infer<typeof transcribeAudioSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type ThemeQueryInput = z.infer<typeof themeQuerySchema>;

// Validation helper
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  // Format error message (use .issues instead of .errors)
  const errorMessage = result.error.issues
    .map((e: z.ZodIssue) => `${e.path.join(".")}: ${e.message}`)
    .join(", ");
  
  return { success: false, error: errorMessage };
}

