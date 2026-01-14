"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Moon, Sparkles, Settings, FileText } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Journal", icon: FileText },
  { href: "/insights", label: "Insights", icon: Sparkles },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#27272A] bg-[#09090B]/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <Moon className="w-4 h-4 text-black fill-current" />
          </div>
          <span className="font-serif font-medium text-lg tracking-tight text-[#FAFAFA]">
            Dream Journal
          </span>
        </Link>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-zinc-500")} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile Nav - Bottom Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-[#27272A] bg-[#09090B] pb-safe z-50">
           <div className="flex justify-around items-center h-16">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex flex-col items-center gap-1 p-2",
                      isActive ? "text-white" : "text-zinc-500"
                    )}
                  >
                    <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-zinc-500")} />
                    <span className="text-[10px] font-medium">{item.label}</span>
                  </Link>
                );
              })}
           </div>
        </div>
      </div>
    </nav>
  );
}
