import AboutSection from "@/features/home/components/about-section/about-section";
import { FeaturesStrip } from "@/features/home/components/hero-section/FeaturesStrip";
import { Hero } from "@/features/home/components/hero-section/Hero";

export default async function HomePage() {
  return (
    <div>
      <Hero />
      <FeaturesStrip />
      <AboutSection />
    </div>
  );
}
