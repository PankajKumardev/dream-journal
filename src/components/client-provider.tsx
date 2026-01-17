"use client";

import { ReactNode } from "react";
import { ErrorBoundary } from "@/components/error-boundary";

export function ClientProvider({ children }: { children: ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
