"use client";

import { Star } from "lucide-react";

const testimonials = [
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
];

export function TestimonialsSection() {
  return (
    <section className="px-6 py-24 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-serif text-foreground mb-12 text-center">Voices from the lucid.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="p-8 rounded-xl bg-card/30 border border-border hover:border-primary/50 transition-colors">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 text-indigo-500 fill-indigo-500" />)}
              </div>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">&quot;{t.text}&quot;</p>
              <div>
                <div className="text-foreground font-medium">{t.author}</div>
                <div className="text-muted-foreground text-sm">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
