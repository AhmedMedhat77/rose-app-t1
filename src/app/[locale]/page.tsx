import { FeaturesStrip } from "@/features/home/components/FeaturesStrip";
import { Hero } from "@/features/home/components/Hero";

export default async function HomePage() {
  return (
    <div>
      <Hero />
      <FeaturesStrip />
    </div>
  );
}
