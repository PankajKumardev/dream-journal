"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const steps = [
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
];

export function WorkflowSection() {
  return (
    <section id="workflow" className="px-6 py-24 md:py-32 bg-muted/20 border-b border-border">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="lg:sticky lg:top-32 h-fit space-y-6">
          <h2 className="text-4xl md:text-5xl font-serif text-foreground">From subconcious to structured data.</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            The Dream Journal transforms the chaotic nature of dreams into a clear, searchable database of your inner life.
          </p>
          <Link href="/about">
            <Button variant="outline" className="mt-4 rounded-full">
              Read the Manifesto
            </Button>
          </Link>
        </div>

        <div className="space-y-12">
          {steps.map((item) => (
            <div key={item.step} className="flex gap-6 group">
              <div className="text-4xl md:text-5xl font-serif text-border group-hover:text-muted-foreground transition-colors select-none">
                {item.step}
              </div>
              <div className="pt-2">
                <h3 className="text-xl font-medium text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
