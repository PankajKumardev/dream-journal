"use client";

import { Quote } from "lucide-react";

export function QuoteSection() {
  return (
    <section className="px-6 py-32 bg-muted flex items-center justify-center border-y border-border">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <Quote className="w-12 h-12 text-border mx-auto" />
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground leading-tight">
          &quot;Until you make the unconscious conscious, it will direct your life and you will call it fate.&quot;
        </h2>
        <p className="text-muted-foreground font-medium tracking-wide uppercase">— Carl Jung</p>
      </div>
    </section>
  );
}
