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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
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
