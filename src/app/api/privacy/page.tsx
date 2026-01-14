"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Lock, Eye, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] font-sans selection:bg-zinc-800 selection:text-white">
      <nav className="fixed top-0 w-full z-50 border-b border-[#27272A] bg-[#09090B]/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link 
            href="/"
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <span className="font-serif text-lg">Dream Journal</span>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto space-y-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="w-12 h-12 rounded-full bg-[#18181B] border border-[#27272A] flex items-center justify-center mb-6">
               <Shield className="w-6 h-6 text-zinc-400" />
            </div>
            <h1 className="font-serif text-5xl md:text-6xl text-[#FAFAFA] leading-tight">
              Privacy Policy
            </h1>
            <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl">
              Your dreams are the most intimate part of your consciousness. 
              We believe they deserve the highest standard of privacy and protection.
            </p>
            <div className="flex gap-4 text-sm text-zinc-500 pt-4 border-t border-[#27272A]">
               <span>Last updated: October 24, 2026</span>
               <span>•</span>
               <span>Version 1.0</span>
            </div>
          </motion.div>

          {/* Content Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-12"
          >
            <section className="space-y-4">
              <h2 className="font-serif text-2xl text-[#FAFAFA] flex items-center gap-2">
                <Lock className="w-5 h-5 text-zinc-500" />
                Data Ownership & Encryption
              </h2>
              <div className="text-zinc-400 leading-7 space-y-4">
                <p>
                  You own your data completely. All dream entries, voice recordings, and generated insights are encrypted at rest using industry-standard AES-256 encryption.
                </p>
                <p>
                  We do not sell, rent, or trade your personal information to third parties. Your dream journal is a private sanctuary, and we intend to keep it that way.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="font-serif text-2xl text-[#FAFAFA] flex items-center gap-2">
                <Eye className="w-5 h-5 text-zinc-500" />
                AI Processing & Anonymity
              </h2>
              <div className="text-zinc-400 leading-7 space-y-4">
                <p>
                  To provide insights and patterns, your dream text is processed by our AI partners (partners like Groq/OpenAI). We send only the necessary text data for analysis.
                </p>
                <p>
                  We prioritize using zero-retention policies where possible, ensuring that your dream content is not used to train public AI models without your explicit consent.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="font-serif text-2xl text-[#FAFAFA] flex items-center gap-2">
                <FileText className="w-5 h-5 text-zinc-500" />
                Your Rights
              </h2>
              <ul className="grid gap-3 text-zinc-400">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-2.5" />
                  <span><strong>Right to Access:</strong> You can export your entire journal at any time.</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-2.5" />
                  <span><strong>Right to Erasure:</strong> You can permanently delete your account and all associated data instantly.</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-2.5" />
                  <span><strong>Right to Rectify:</strong> You can edit or update your entries as you see fit.</span>
                </li>
              </ul>
            </section>

            <section className="pt-8 border-t border-[#27272A]">
               <h2 className="font-serif text-2xl text-[#FAFAFA] mb-4">Contact Us</h2>
               <p className="text-zinc-400 leading-relaxed">
                  If you have any questions about our privacy practices, please contact us at <a href="mailto:privacy@dreamjournal.ai" className="text-white hover:underline decoration-zinc-500 underline-offset-4">privacy@dreamjournal.ai</a>.
               </p>
            </section>

          </motion.div>
        </div>
      </main>
    </div>
  );
}
