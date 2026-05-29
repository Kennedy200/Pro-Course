import { HeaderSection } from "@/components/landing/HeaderSection/HeaderSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection/FeaturesSection";
import { CoursesSection } from "@/components/landing/CoursesSection/CoursesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection/HowItWorksSection";
import { CTASection } from "@/components/landing/CTASection/CTASection";
import { Footer } from "@/components/layout/Footer/Footer";

export default function Home() {
  return (
    <main style={{ backgroundColor: "#ffffff", overflowX: "hidden" }}>
      <HeaderSection />
      <FeaturesSection />
      <CoursesSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </main>
  );
}