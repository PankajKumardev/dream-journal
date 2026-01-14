"use client";

import Link from "next/link";
import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function LandingNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Moon className="w-4 h-4 text-primary-foreground fill-current" />
          </div>
          <span className="font-serif font-medium text-lg tracking-tight text-foreground">Dream Journal</span>
        </button>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#workflow" className="hover:text-foreground transition-colors">Method</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            Log in
          </Link>
          <Link href="/dashboard">
            <Button size="sm" className="hidden sm:inline-flex rounded-full px-6">
              Get Access
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
