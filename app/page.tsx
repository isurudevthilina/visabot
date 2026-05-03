import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { VisaChecker } from "@/components/visa-checker";
import { Features } from "@/components/features";
import { Stats } from "@/components/stats";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <HowItWorks />
      <VisaChecker />
      <Features />
      <Stats />
      <Footer />
    </main>
  );
}
