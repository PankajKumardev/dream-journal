"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Scale, AlertTriangle, UserCheck, Gavel } from "lucide-react";

export default function TermsPage() {
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
               <Scale className="w-6 h-6 text-zinc-400" />
            </div>
            <h1 className="font-serif text-5xl md:text-6xl text-[#FAFAFA] leading-tight">
              Terms of Service
            </h1>
            <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl">
              By using Dream Journal, you agree to these terms. They are designed to ensure a safe, private, and respectful environment for self-reflection.
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
                <UserCheck className="w-5 h-5 text-zinc-500" />
                Acceptable Use
              </h2>
              <div className="text-zinc-400 leading-7 space-y-4">
                <p>
                  You agree to use Dream Journal primarily for personal documentation and self-reflection. You are responsible for maintaining the confidentiality of your account credentials.
                </p>
                <p>
                  You must not use the service to store illegal content, harass others, or attempt to compromise the integrity of our systems.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="font-serif text-2xl text-[#FAFAFA] flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-zinc-500" />
                AI & Medical Disclaimer
              </h2>
              <div className="text-zinc-400 leading-7 space-y-4">
                <p>
                  **Dream Journal is NOT a medical device/service.** The insights, patterns, and interpretations provided by our AI are for entertainment and self-reflection purposes only.
                </p>
                <p>
                  We do not diagnose or treat mental health conditions. If you are experiencing psychological distress, nightmares, or sleep disorders, please consult a qualified healthcare professional.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="font-serif text-2xl text-[#FAFAFA] flex items-center gap-2">
                <Gavel className="w-5 h-5 text-zinc-500" />
                Limitation of Liability
              </h2>
              <div className="text-zinc-400 leading-7 space-y-4">
                <p>
                  Dream Journal is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the service, including but not limited to loss of data or service interruptions.
                </p>
              </div>
            </section>

             <section className="pt-8 border-t border-[#27272A]">
               <h2 className="font-serif text-2xl text-[#FAFAFA] mb-4">Questions?</h2>
               <p className="text-zinc-400 leading-relaxed">
                  For legal inquiries, please contact <a href="mailto:legal@dreamjournal.ai" className="text-white hover:underline decoration-zinc-500 underline-offset-4">legal@dreamjournal.ai</a>.
               </p>
            </section>

          </motion.div>
        </div>
      </main>
    </div>
  );
}
