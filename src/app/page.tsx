import { auth } from "@/lib/auth";
import {
  LandingNavbar,
  HeroSection,
  InterfaceShowcase,
  FeaturesSection,
  QuoteSection,
  WorkflowSection,
  TestimonialsSection,
  PricingSection,
  CTASection,
  LandingFooter,
} from "@/components/landing";

export default async function LandingPage() {
  const session = await auth();
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <LandingNavbar session={session} />

      <main className="pt-24 md:pt-32">
        <HeroSection />
        <InterfaceShowcase />
        <FeaturesSection />
        <QuoteSection />
        <WorkflowSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
        <LandingFooter />
      </main>
    </div>
  );
}
