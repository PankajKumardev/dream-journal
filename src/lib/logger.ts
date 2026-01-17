/**
 * Simple logging utility
 * Replaces console.error with structured logging
 * Can be extended to send to external services (Sentry, LogRocket, etc.)
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

const isDev = process.env.NODE_ENV === "development";

function formatMessage(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` | ${JSON.stringify(context)}` : "";
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
}

export const logger = {
  debug: (message: string, context?: LogContext) => {
    if (isDev) {
      console.log(formatMessage("debug", message, context));
    }
  },

  info: (message: string, context?: LogContext) => {
    console.log(formatMessage("info", message, context));
  },

  warn: (message: string, context?: LogContext) => {
    console.warn(formatMessage("warn", message, context));
  },

  error: (message: string, error?: unknown, context?: LogContext) => {
    const errorContext = {
      ...context,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: isDev ? error.stack : undefined,
      } : error,
    };
    console.error(formatMessage("error", message, errorContext));

    // TODO: Send to external error tracking service
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(error);
    // }
  },

  // API route specific logging
  api: {
    request: (method: string, path: string, userId?: string) => {
      if (isDev) {
        console.log(formatMessage("info", `API ${method} ${path}`, { userId }));
      }
    },
    
    error: (path: string, error: unknown, context?: LogContext) => {
      logger.error(`API Error: ${path}`, error, context);
    },
  },
};

export default logger;
