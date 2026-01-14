"use client";

import { Mic, Brain, Lock, Activity, TrendingUp } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LandingSleepChart } from "@/components/landing-sleep-chart";

export function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-24 md:py-32 max-w-7xl mx-auto">
      <div className="mb-16 md:text-center max-w-2xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-serif mb-6 text-foreground">Designed for the subconscious mind.</h2>
        <p className="text-muted-foreground text-lg">Every feature is crafted to help you capture the fleeting nature of dreams without friction.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-1 group hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-muted border border-border flex items-center justify-center mb-4 group-hover:bg-accent transition-colors">
              <Mic className="w-6 h-6 text-foreground" />
            </div>
            <CardTitle className="text-xl mb-2">Whisper Transcription</CardTitle>
            <CardDescription className="text-base">
              Don&apos;t type. Just speak. Even if you&apos;re half-asleep, our engine captures every detail instantly with 99% accuracy.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="md:col-span-1 group hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-muted border border-border flex items-center justify-center mb-4 group-hover:bg-accent transition-colors">
              <Brain className="w-6 h-6 text-foreground" />
            </div>
            <CardTitle className="text-xl mb-2">Psychological Patterns</CardTitle>
            <CardDescription className="text-base">
              Our AI detects recurring symbols like &apos;Falling&apos; or &apos;Water&apos; and correlates them with your daily mood.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="md:col-span-1 group hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-muted border border-border flex items-center justify-center mb-4 group-hover:bg-accent transition-colors">
              <Lock className="w-6 h-6 text-foreground" />
            </div>
            <CardTitle className="text-xl mb-2">Encrypted Vault</CardTitle>
            <CardDescription className="text-base">
              Your dreams are personal. Data is encrypted at rest and you hold the keys. Private by design.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="md:col-span-2 group hover:border-primary/50 transition-colors">
          <div className="flex flex-col md:flex-row h-full">
            <CardHeader className="flex-1">
              <div className="w-12 h-12 rounded-lg bg-muted border border-border flex items-center justify-center mb-4 group-hover:bg-accent transition-colors">
                <Activity className="w-6 h-6 text-foreground" />
              </div>
              <CardTitle className="text-xl mb-2">Weekly Insights</CardTitle>
              <CardDescription className="text-base mb-6">
                Visualize your sleep quality and dream clarity over time. Spot trends in your subconscious activity.
              </CardDescription>
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <span className="text-2xl font-serif text-foreground">8.4</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Avg Clarity</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-serif text-foreground">+12%</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Lucidity</span>
                </div>
              </div>
            </CardHeader>
            <div className="flex-1 p-6 flex items-end justify-center min-h-[200px]">
              <LandingSleepChart />
            </div>
          </div>
        </Card>

        <Card className="md:col-span-1 group hover:border-primary/50 transition-colors bg-gradient-to-br from-muted to-indigo-950/20 dark:from-muted dark:to-indigo-950/20">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-muted border border-border flex items-center justify-center mb-4 group-hover:bg-accent transition-colors">
              <TrendingUp className="w-6 h-6 text-foreground" />
            </div>
            <CardTitle className="text-xl mb-2">Interpretation</CardTitle>
            <CardDescription className="text-base">
              &quot;What does it mean to lose teeth?&quot; Get instant Jungian and Freudian interpretations.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </section>
  );
}
