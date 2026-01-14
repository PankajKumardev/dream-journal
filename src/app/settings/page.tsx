"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { User as UserIcon, LogOut, Trash2, Download, Info, Shield, FileText } from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: string;
}

interface ExportStats {
  totalDreams: number;
  analyzedDreams: number;
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [exportStats, setExportStats] = useState<ExportStats | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUser();
    fetchExportStats();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/user");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchExportStats = async () => {
    try {
      const res = await fetch("/api/stats");
      if (res.ok) {
        const data = await res.json();
        setExportStats({
          totalDreams: data.totalDreams,
          analyzedDreams: data.analyzedDreams,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleExportAll = async (format: "pdf" | "md" | "json") => {
    setIsExporting(true);
    try {
      const res = await fetch(`/api/export/${format}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `dream-journal-export.${format === "json" ? "json" : format}`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error exporting:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/user", { method: "DELETE" });
      if (res.ok) {
        signOut({ callbackUrl: "/" });
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] pb-24 pt-24 md:pt-28 text-[#FAFAFA]">
      <Navigation />

      <main className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 border-b border-[#27272A] pb-8"
        >
          <div className="flex flex-col gap-1">
             <p className="text-zinc-500 text-sm uppercase tracking-widest font-medium">Preferences</p>
             <h1 className="font-serif text-4xl md:text-5xl text-[#FAFAFA]">
               Settings
             </h1>
          </div>
          <p className="text-zinc-400 mt-4 max-w-xl">
            Manage your account, export your data, and privacy controls.
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Profile Card */}
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-[#18181B] border border-[#27272A] shadow-none">
                <CardHeader className="border-b border-[#27272A] pb-4">
                  <CardTitle className="font-serif text-lg font-normal text-[#FAFAFA] flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-zinc-500" />
                    Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="w-16 h-16 border border-[#27272A]">
                      <AvatarImage src={user.image || undefined} />
                      <AvatarFallback className="bg-[#27272A] text-white text-xl">
                        {user.name?.[0] || user.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-[#FAFAFA] text-lg">
                        {user.name || "Dreamer"}
                      </h3>
                      <p className="text-zinc-400 text-sm">{user.email}</p>
                      <p className="text-zinc-600 text-xs mt-2 uppercase tracking-wide">
                        Member since{" "}
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Export Data */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-[#18181B] border border-[#27272A] shadow-none">
              <CardHeader className="border-b border-[#27272A] pb-4">
                <CardTitle className="font-serif text-lg font-normal text-[#FAFAFA] flex items-center gap-2">
                  <Download className="w-4 h-4 text-zinc-500" />
                  Export Data
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Download a copy of your journal. Your data belongs to you.
                  {exportStats && (
                    <span className="text-zinc-500 block mt-1">
                      Currently storing {exportStats.totalDreams} dreams ({exportStats.analyzedDreams} analyzed).
                    </span>
                  )}
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => handleExportAll("pdf")}
                    disabled={isExporting}
                    className="border-[#27272A] bg-[#09090B] hover:bg-[#27272A] text-zinc-300"
                  >
                    Export PDF
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleExportAll("md")}
                    disabled={isExporting}
                    className="border-[#27272A] bg-[#09090B] hover:bg-[#27272A] text-zinc-300"
                  >
                    Export Markdown
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleExportAll("json")}
                    disabled={isExporting}
                    className="border-[#27272A] bg-[#09090B] hover:bg-[#27272A] text-zinc-300"
                  >
                    Export JSON
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-[#18181B] border border-[#27272A] shadow-none">
              <CardHeader className="border-b border-[#27272A] pb-4">
                <CardTitle className="font-serif text-lg font-normal text-[#FAFAFA] flex items-center gap-2">
                  <Info className="w-4 h-4 text-zinc-500" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-8 h-8 bg-[#27272A] rounded-full flex items-center justify-center">
                      <span className="text-sm">🌙</span>
                   </div>
                  <div>
                    <h3 className="font-serif text-lg text-[#FAFAFA]">
                      Dream Journal
                    </h3>
                    <p className="text-zinc-500 text-xs">Version 1.0.0</p>
                  </div>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  An intelligent companion for your subconscious. Built with privacy and design in mind.
                </p>
                <div className="flex gap-6 text-sm pt-4 border-t border-[#27272A] mt-4">
                  <Link href="/privacy" className="text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-2">
                     <Shield className="w-3 h-3" /> Privacy Policy
                  </Link>
                  <Link href="/terms" className="text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-2">
                     <FileText className="w-3 h-3" /> Terms of Service
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Account Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-[#18181B] border border-[#27272A] shadow-none">
              <CardHeader className="border-b border-[#27272A] pb-4">
                <CardTitle className="font-serif text-lg font-normal text-[#FAFAFA] flex items-center gap-2">
                  <LogOut className="w-4 h-4 text-zinc-500" />
                  Account Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <Button
                  variant="outline"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full border-[#27272A] hover:bg-[#27272A] text-zinc-300 justify-start"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </Button>

                <div className="pt-6 border-t border-[#27272A]">
                  <h4 className="text-rose-400 font-medium mb-2 text-sm">Danger Zone</h4>
                  <p className="text-zinc-500 text-sm mb-4">
                    Permanently delete your account and all associated data.
                  </p>
                  <Dialog
                    open={showDeleteDialog}
                    onOpenChange={setShowDeleteDialog}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 px-0"
                      >
                         <Trash2 className="w-4 h-4 mr-2" /> Delete Account
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#18181B] border-[#27272A]">
                      <DialogHeader>
                        <DialogTitle className="text-[#FAFAFA]">Delete Account?</DialogTitle>
                      </DialogHeader>
                      <p className="text-zinc-400">
                        This will permanently delete your account and all your
                        dreams. This action cannot be undone.
                      </p>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setShowDeleteDialog(false)}
                          className="border-[#27272A] text-zinc-300 hover:bg-[#27272A]"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleDeleteAccount}
                          disabled={isDeleting}
                          className="bg-rose-600 hover:bg-rose-700 text-white"
                        >
                          {isDeleting ? "Deleting..." : "Delete Account"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
