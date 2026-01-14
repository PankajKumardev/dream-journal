"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};

export function HeroSection() {
  return (
    <section className="relative px-6 pb-32 md:pb-48 flex flex-col items-center text-center overflow-hidden mb-12 mt-8">
      <motion.div
        initial="visible"
        animate="visible"
        variants={containerVariants}
        className="relative max-w-4xl mx-auto space-y-8 z-10"
      >
        <motion.div variants={itemVariants} className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border text-secondary-foreground text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Journaling Reimagined
          </div>
        </motion.div>

        <motion.h1 
          variants={itemVariants}
          className="text-5xl md:text-7xl lg:text-8xl leading-[0.9] font-serif font-medium tracking-tight text-foreground mb-6"
        >
          Make sense of your <br className="hidden md:block"/>
          <span className="italic text-muted-foreground">subconscious.</span>
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light tracking-wide"
        >
          The voice-first dream journal powered by AI. <br className="hidden md:block" />
          Record in seconds, understand forever.
        </motion.p>

        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
        >
          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-auto h-11 px-8 rounded-full transition-all hover:scale-105">
              Start Journaling
            </Button>
          </Link>
          <Link href="/demo">
            <Button size="lg" variant="outline" className="w-full sm:w-auto group h-11 px-8 rounded-full transition-all">
              View Demo <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
