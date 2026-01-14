import {
  LandingNavbar,
  HeroSection,
  InterfaceShowcase,
  FeaturesSection,
  QuoteSection,
  WorkflowSection,
  IntegrationsSection,
  TestimonialsSection,
  PricingSection,
  CTASection,
  LandingFooter,
} from "@/components/landing";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-50 overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      <LandingNavbar />

      <main className="pt-32">
        <HeroSection />
        <InterfaceShowcase />
        <FeaturesSection />
        <QuoteSection />
        <WorkflowSection />
        <IntegrationsSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
        <LandingFooter />
      </main>
    </div>
  );
}
