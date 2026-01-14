"use client";

import React from 'react';
import Link from "next/link";
import { motion } from 'framer-motion';
import { 
  Mic, Brain, Lock, ArrowRight, Activity, TrendingUp, 
  Watch, Smartphone, Quote, Check, Star 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LandingSleepChart } from '@/components/landing-sleep-chart';
import { cn } from '@/lib/utils';

// Animation variants for consistency
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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-50 overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Navbar - Minimal Sticky */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#09090B]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-indigo-500" />
            <span className="font-serif text-lg tracking-wide">Dream Journal</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#workflow" className="hover:text-white transition-colors">Method</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block">Log in</Link>
            <Link href="/dashboard">
              <Button size="sm" className="hidden sm:inline-flex bg-white text-black hover:bg-zinc-200 rounded-full px-6">Get Access</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32">
        <section className="relative px-6 pb-24 md:pb-32 flex flex-col items-center text-center overflow-hidden mt-8">


          <motion.div
            initial="visible"
            animate="visible"
            variants={containerVariants}
            className="relative max-w-4xl mx-auto space-y-8 z-10"
          >
            
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl lg:text-8xl leading-[0.9] font-serif font-medium tracking-tight text-white mb-6"
            >
              Make sense of your <br className="hidden md:block"/>
              <span className="italic text-zinc-400">subconscious.</span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-light tracking-wide"
            >
              The voice-first dream journal powered by AI. <br className="hidden md:block" />
              Record in seconds, understand forever.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
            >
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto h-11 px-8 rounded-full bg-white text-black hover:bg-zinc-200 transition-all hover:scale-105">
                  Start Journaling
                </Button>
              </Link>
              <Link href="/demo">
                 <Button size="lg" variant="outline" className="w-full sm:w-auto group h-11 px-8 rounded-full border-zinc-800 bg-transparent hover:bg-zinc-900 text-zinc-300 transition-all hover:border-zinc-700">
                   View Demo <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                 </Button>
              </Link>
            </motion.div>

          </motion.div>
        </section>

        {/* Section 2: The Interface Showcase */}
        <section className="px-6 py-12 md:py-24 border-t border-zinc-900 bg-gradient-to-b from-transparent to-zinc-900/30">
          <div className="max-w-6xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative rounded-xl border border-zinc-800 bg-[#09090B] shadow-2xl shadow-indigo-500/5 overflow-hidden">
               {/* Faux Browser UI */}
               <div className="h-10 border-b border-zinc-800 bg-zinc-900 flex items-center px-4 gap-2">
                 <div className="flex gap-1.5">
                   <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                   <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                 </div>
                 <div className="mx-auto text-xs text-zinc-500 font-medium">dreamjournal.ai/dashboard</div>
               </div>
               
               {/* Dashboard Content Mockup */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-0 h-[600px]">
                 {/* Sidebar */}
                 <div className="hidden md:flex flex-col border-r border-[#27272A] bg-[#18181B]/50 p-4 space-y-6">
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Today</div>
                      <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-200 text-sm font-medium border border-indigo-500/20">
                        Flying over Cities
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Recent</div>
                      {['Lost in Library', 'Underwater Breath', 'Meeting an Old Friend'].map((item) => (
                        <div key={item} className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 text-sm cursor-pointer transition-colors">
                          {item}
                        </div>
                      ))}
                    </div>
                 </div>
                 
                 {/* Main Content */}
                 <div className="md:col-span-2 p-8 space-y-8 bg-[#09090B] relative">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-zinc-500 text-sm">
                        <span>Oct 24, 2026</span>
                        <span>•</span>
                        <span>06:42 AM</span>
                      </div>
                      <h2 className="text-3xl font-serif text-white">Flying over the marble city</h2>
                      <div className="flex gap-2">
                         <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs border border-indigo-500/20">Lucid</span>
                         <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-xs border border-zinc-700">High Clarity</span>
                      </div>
                    </div>
                    
                    <div className="prose prose-invert prose-zinc max-w-none">
                       <p className="text-zinc-300 leading-relaxed">
                         I started on a balcony made of pure white marble. The air was crisp, like early autumn. I looked down and saw a city that stretched infinitely, but instead of roads, there were canals of light. I pushed off the railing and... floated.
                       </p>
                       <p className="text-zinc-300 leading-relaxed mt-4">
                         The sensation was weightless. I could control my direction by simply leaning my thoughts.
                       </p>
                    </div>

                    <div className="pt-8 border-t border-zinc-800">
                      <h3 className="text-sm font-medium text-zinc-400 mb-4 flex items-center gap-2">
                        <Brain className="w-4 h-4 text-indigo-500" /> AI Analysis
                      </h3>
                      <div className="bg-[#18181B] rounded-lg p-4 border border-[#27272A] text-sm text-zinc-300 space-y-2">
                         <p>The theme of <span className="text-white font-medium">flight</span> suggests a desire for freedom or a recent release from a burden. The <span className="text-white font-medium">marble city</span> represents structure and stability in your waking life.</p>
                      </div>
                    </div>
                    
                    {/* Live Demo Badge */}
                    <div className="absolute top-8 right-8 bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs px-2 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      Live Demo
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* Section 3: The Features (Bento Grid) */}
        <section id="features" className="px-6 py-24 md:py-32 max-w-7xl mx-auto">
          <div className="mb-16 md:text-center max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif mb-6 text-white">Designed for the subconscious mind.</h2>
            <p className="text-zinc-400 text-lg">Every feature is crafted to help you capture the fleeting nature of dreams without friction.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="md:col-span-1 group hover:border-zinc-700 transition-colors bg-[#18181B] border-[#27272A]">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 group-hover:bg-zinc-800 transition-colors">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl mb-2 text-white">Whisper Transcription</CardTitle>
                <CardDescription className="text-base text-zinc-400">
                  Don't type. Just speak. Even if you're half-asleep, our engine captures every detail instantly with 99% accuracy.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="md:col-span-1 group hover:border-zinc-700 transition-colors bg-[#18181B] border-[#27272A]">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 group-hover:bg-zinc-800 transition-colors">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl mb-2 text-white">Psychological Patterns</CardTitle>
                <CardDescription className="text-base text-zinc-400">
                  Our AI detects recurring symbols like 'Falling' or 'Water' and correlates them with your daily mood.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="md:col-span-1 group hover:border-zinc-700 transition-colors bg-[#18181B] border-[#27272A]">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 group-hover:bg-zinc-800 transition-colors">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl mb-2 text-white">Encrypted Vault</CardTitle>
                <CardDescription className="text-base text-zinc-400">
                  Your dreams are personal. Data is encrypted at rest and you hold the keys. Private by design.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="md:col-span-2 group hover:border-zinc-700 transition-colors bg-[#18181B] border-[#27272A]">
               <div className="flex flex-col md:flex-row h-full">
                 <CardHeader className="flex-1">
                    <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 group-hover:bg-zinc-800 transition-colors">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl mb-2 text-white">Weekly Insights</CardTitle>
                    <CardDescription className="text-base mb-6 text-zinc-400">
                      Visualize your sleep quality and dream clarity over time. Spot trends in your subconscious activity.
                    </CardDescription>
                    <div className="flex gap-4">
                      <div className="flex flex-col">
                        <span className="text-2xl font-serif text-white">8.4</span>
                        <span className="text-xs text-zinc-500 uppercase tracking-wider">Avg Clarity</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-2xl font-serif text-white">+12%</span>
                        <span className="text-xs text-zinc-500 uppercase tracking-wider">Lucidity</span>
                      </div>
                    </div>
                 </CardHeader>
                 <div className="flex-1 p-6 flex items-end justify-center min-h-[200px]">
                    <LandingSleepChart />
                 </div>
               </div>
            </Card>

            <Card className="md:col-span-1 group hover:border-zinc-700 transition-colors bg-gradient-to-br from-zinc-900 to-indigo-950/20 border-[#27272A]">
              <CardHeader>
                 <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 group-hover:bg-zinc-800 transition-colors">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl mb-2 text-white">Interpretation</CardTitle>
                <CardDescription className="text-base text-zinc-400">
                  "What does it mean to lose teeth?" Get instant Jungian and Freudian interpretations.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Section 4: Philosophy Quote */}
        <section className="px-6 py-32 bg-zinc-950 flex items-center justify-center border-y border-zinc-900">
           <div className="max-w-3xl mx-auto text-center space-y-8">
              <Quote className="w-12 h-12 text-zinc-800 mx-auto" />
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight">
                 "Until you make the unconscious conscious, it will direct your life and you will call it fate."
              </h2>
              <p className="text-zinc-500 font-medium tracking-wide uppercase">— Carl Jung</p>
           </div>
        </section>

        {/* Section 5: The Workflow */}
        <section id="workflow" className="px-6 py-24 md:py-32 bg-zinc-900/20 border-b border-zinc-900">
           <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="lg:sticky lg:top-32 h-fit space-y-6">
                 <h2 className="text-4xl md:text-5xl font-serif text-white">From subconcious to structured data.</h2>
                 <p className="text-zinc-400 text-lg leading-relaxed">
                   The Dream Journal transforms the chaotic nature of dreams into a clear, searchable database of your inner life.
                 </p>
                 <Link href="/about">
                   <Button variant="outline" className="mt-4 border-zinc-700 bg-transparent hover:bg-zinc-800 text-white rounded-full">Read the Manifesto</Button>
                 </Link>
              </div>

              <div className="space-y-12">
                 {[
                   {
                     step: "01",
                     title: "Record",
                     desc: "Wake up. Press one button. Speak. The app listens to your voice, filtering out background noise, capturing the raw narrative while the memory is fresh."
                   },
                   {
                     step: "02",
                     title: "Transcribe",
                     desc: "Within seconds, your voice is converted to text. Our custom model is trained on dream logic, understanding non-linear narratives and emotional nuance."
                   },
                   {
                     step: "03",
                     title: "Analyze",
                     desc: "The system tags emotions, characters, and settings automatically. It cross-references this dream with your history to find hidden connections."
                   }
                 ].map((item) => (
                   <div key={item.step} className="flex gap-6 group">
                      <div className="text-4xl md:text-5xl font-serif text-zinc-800 group-hover:text-zinc-600 transition-colors select-none">
                        {item.step}
                      </div>
                      <div className="pt-2">
                        <h3 className="text-xl font-medium text-white mb-2">{item.title}</h3>
                        <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Section 6: Integrations */}
        <section className="px-6 py-24 border-b border-zinc-900 bg-[#09090B]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
               <div className="md:w-1/2 space-y-6">
                  <h2 className="text-4xl font-serif text-white">Sync with your <br/> biological rhythm.</h2>
                  <p className="text-zinc-400 text-lg leading-relaxed">
                    Dream Journal connects with your sleep tracker to overlay dream vividness on top of your REM cycles. Understand how your physiology affects your psychology.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                     <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-300 text-sm">
                        <Watch className="w-4 h-4" /> Apple Health
                     </div>
                     <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-300 text-sm">
                        <Activity className="w-4 h-4" /> Oura Ring
                     </div>
                     <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-300 text-sm">
                        <Smartphone className="w-4 h-4" /> Android Sleep
                     </div>
                  </div>
               </div>
               <div className="md:w-1/2 relative">
                  <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full opacity-20"></div>
                  <div className="relative z-10 grid grid-cols-2 gap-4">
                     <div className="space-y-4 translate-y-8">
                        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col items-center text-center space-y-3">
                           <span className="text-2xl font-serif text-white">02h 14m</span>
                           <span className="text-xs text-zinc-500 uppercase tracking-widest">REM Sleep</span>
                        </div>
                        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col items-center text-center space-y-3">
                           <span className="text-2xl font-serif text-white">47 bpm</span>
                           <span className="text-xs text-zinc-500 uppercase tracking-widest">Resting HR</span>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col items-center text-center space-y-3 bg-gradient-to-b from-zinc-800 to-zinc-900">
                           <span className="text-2xl font-serif text-indigo-300">High</span>
                           <span className="text-xs text-zinc-500 uppercase tracking-widest">Recall Score</span>
                        </div>
                         <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col items-center text-center space-y-3">
                           <span className="text-2xl font-serif text-white">89%</span>
                           <span className="text-xs text-zinc-500 uppercase tracking-widest">Sleep Quality</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Section 7: Testimonials */}
        <section className="px-6 py-24 bg-[#09090B] border-b border-zinc-900">
          <div className="max-w-7xl mx-auto">
             <h2 className="text-3xl font-serif text-white mb-12 text-center">Voices from the lucid.</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    text: "I used to forget my dreams instantly. Now I have a searchable library of my own subconscious. It's like unlocking a second life.",
                    author: "Elena R.",
                    role: "Visual Artist"
                  },
                  {
                    text: "The pattern recognition found a recurring theme of 'tides' before my creative bursts. I've never felt more in tune with my process.",
                    author: "Marcus K.",
                    role: "Writer"
                  },
                  {
                    text: "Privacy was my main concern. Knowing my entries are encrypted locally gives me the freedom to be completely honest.",
                    author: "Sarah L.",
                    role: "Therapist"
                  }
                ].map((t, i) => (
                  <div key={i} className="p-8 rounded-xl bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 transition-colors">
                     <div className="flex gap-1 mb-4">
                        {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 text-indigo-500 fill-indigo-500" />)}
                     </div>
                     <p className="text-zinc-300 text-lg mb-6 leading-relaxed">"{t.text}"</p>
                     <div>
                        <div className="text-white font-medium">{t.author}</div>
                        <div className="text-zinc-500 text-sm">{t.role}</div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* Section 8: Pricing */}
        <section id="pricing" className="px-6 py-24 bg-zinc-900/20">
           <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16 space-y-4">
                <h2 className="text-4xl font-serif text-white">Invest in your mind.</h2>
                <p className="text-zinc-400">Choose the tool that fits your depth of exploration.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                 {/* Free Tier */}
                 <div className="p-8 rounded-2xl border border-zinc-800 bg-[#09090B] space-y-6">
                    <div>
                       <h3 className="text-xl font-medium text-white">Dreamer</h3>
                       <div className="mt-4 flex items-baseline text-zinc-900 dark:text-white">
                          <span className="text-4xl font-serif tracking-tight">$0</span>
                          <span className="ml-1 text-xl text-zinc-500">/mo</span>
                       </div>
                       <p className="mt-4 text-sm text-zinc-400">Perfect for casual journaling and basic recall.</p>
                    </div>
                    <ul className="space-y-4 text-sm text-zinc-300">
                       <li className="flex items-center gap-3"><Check className="w-4 h-4 text-zinc-500" /> Unlimited Text Entries</li>
                       <li className="flex items-center gap-3"><Check className="w-4 h-4 text-zinc-500" /> Basic AI Transcription</li>
                       <li className="flex items-center gap-3"><Check className="w-4 h-4 text-zinc-500" /> 7-Day Insight History</li>
                       <li className="flex items-center gap-3"><Check className="w-4 h-4 text-zinc-500" /> Local Encryption</li>
                    </ul>
                    <Link href="/login">
                       <Button variant="outline" className="w-full mt-6 bg-transparent hover:bg-zinc-800 text-white border-zinc-700">Get Started</Button>
                    </Link>
                 </div>

                 {/* Pro Tier */}
                 <div className="relative p-8 rounded-2xl border border-indigo-500/50 bg-zinc-900/50 space-y-6 overflow-hidden">
                    <div className="absolute top-0 right-0 p-3">
                       <div className="px-3 py-1 rounded-full bg-indigo-500 text-white text-xs font-medium">Popular</div>
                    </div>
                    <div>
                       <h3 className="text-xl font-medium text-white">Oneironaut</h3>
                       <div className="mt-4 flex items-baseline text-zinc-900 dark:text-white">
                          <span className="text-4xl font-serif tracking-tight">$12</span>
                          <span className="ml-1 text-xl text-zinc-500">/mo</span>
                       </div>
                       <p className="mt-4 text-sm text-zinc-400">For deep divers seeking patterns and lucidity.</p>
                    </div>
                    <ul className="space-y-4 text-sm text-zinc-300">
                       <li className="flex items-center gap-3"><Check className="w-4 h-4 text-indigo-400" /> Everything in Dreamer</li>
                       <li className="flex items-center gap-3"><Check className="w-4 h-4 text-indigo-400" /> Advanced Jungian Analysis</li>
                       <li className="flex items-center gap-3"><Check className="w-4 h-4 text-indigo-400" /> Image Generation (Dream-to-Art)</li>
                       <li className="flex items-center gap-3"><Check className="w-4 h-4 text-indigo-400" /> Long-term Trend Reports</li>
                       <li className="flex items-center gap-3"><Check className="w-4 h-4 text-indigo-400" /> Sleep Tracker Integrations</li>
                    </ul>
                    <Link href="/login">
                       <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white border-none mt-6">Start 14-Day Free Trial</Button>
                    </Link>
                 </div>
              </div>
           </div>
        </section>

        {/* Section 9: CTA Footer */}
        <section className="px-6 py-32 text-center bg-[#09090B]">
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-5xl md:text-6xl font-serif text-white">Start your journey tonight.</h2>
            <p className="text-zinc-400 text-lg">Join the community of lucid dreamers and explorers.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                 <Button size="lg" className="w-full sm:w-auto px-12 h-12 rounded-full bg-white text-black hover:bg-zinc-200">Get Started for Free</Button>
              </Link>
            </div>
            <p className="text-xs text-zinc-600 pt-8">No credit card required • Cancel anytime</p>
          </div>
        </section>
        
        {/* Simple Footer Links */}
        <footer className="px-6 py-12 border-t border-zinc-900 bg-[#09090B]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-zinc-800" />
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

      </main>
    </div>
  );
}
