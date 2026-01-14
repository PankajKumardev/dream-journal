"use client";

import Link from "next/link";
import { Moon } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="px-6 py-12 border-t border-border bg-background">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <Moon className="w-3 h-3 text-primary-foreground fill-current" />
          </div>
          <span className="font-serif text-foreground">Dream Journal</span>
        </div>
        <div className="flex gap-8">
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
        </div>
        <div>
          &copy; {new Date().getFullYear()} Dream Journal AI.
        </div>
      </div>
    </footer>
  );
}
