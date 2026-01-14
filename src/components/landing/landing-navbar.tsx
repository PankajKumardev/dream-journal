"use client";

import Link from "next/link";
import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#09090B]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <Moon className="w-4 h-4 text-black fill-current" />
          </div>
          <span className="font-serif text-lg tracking-wide">Dream Journal</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#workflow" className="hover:text-white transition-colors">Method</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block">
            Log in
          </Link>
          <Link href="/dashboard">
            <Button size="sm" className="hidden sm:inline-flex bg-white text-black hover:bg-zinc-200 rounded-full px-6">
              Get Access
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
