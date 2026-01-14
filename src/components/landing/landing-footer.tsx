"use client";

import Link from "next/link";
import { Moon } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="px-6 py-12 border-t border-zinc-900 bg-[#09090B]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-zinc-500">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <Moon className="w-3 h-3 text-black fill-current" />
          </div>
          <span className="font-serif text-zinc-300">Dream Journal</span>
        </div>
        <div className="flex gap-8">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
        </div>
        <div>
          &copy; {new Date().getFullYear()} Dream Journal AI.
        </div>
      </div>
    </footer>
  );
}
