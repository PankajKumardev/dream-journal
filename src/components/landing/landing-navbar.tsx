"use client";

import Link from "next/link";
import { Moon, LogOut, LayoutDashboard, User } from "lucide-react";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function LandingNavbar({ session }: { session: Session | null }) {
  const user = session?.user;

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
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 flex items-center gap-2 pl-2 pr-4 rounded-full hover:bg-muted/50 transition-colors">
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                    <AvatarFallback>{user.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-sm hidden md:flex">
                    <span className="font-medium text-foreground text-xs leading-none">{user.name?.split(' ')[0]}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-background/80 backdrop-blur-xl border-border/50 shadow-xl rounded-xl p-2" align="end" forceMount>
                <div className="flex items-center justify-start gap-3 p-2 mb-1">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                    <AvatarFallback>{user.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-0.5 leading-none">
                    {user.name && <p className="font-medium text-sm">{user.name}</p>}
                    {user.email && (
                      <p className="w-[140px] truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem asChild className="rounded-lg cursor-pointer focus:bg-muted/70">
                  <Link href="/dashboard" className="flex items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-lg cursor-pointer focus:bg-muted/70">
                  <Link href="/settings" className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem
                  className="rounded-lg text-red-500 focus:text-red-600 focus:bg-red-500/10 cursor-pointer"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
                Log in
              </Link>
              <Link href="/login">
                <Button size="sm" className="hidden sm:inline-flex rounded-full px-6">
                  Get Access
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
