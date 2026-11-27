import { FeaturesStrip } from "@/features/home/components/hero-section/features-strip";
import MostPopular from "@/features/mostPopular/components/most-popular";
import AboutSection from "@/features/home/components/about-section/about-section";
import Gallery from "@/features/gallery/components/Gallery";
import Testimonials from "@/features/testimonials/components/Testimonials";
import Companies from "@/features/companies/Companies";
import { Hero } from "@/features/home/components/hero-section/hero";
import BestSelling from "@/features/bestSelling/components/best-selling";

type Props = {
  searchParams: Promise<{
    occasionId?: string;
  }>;
};

export default async function HomePage({ searchParams }: Props) {
  const { occasionId } = await searchParams;

  return (
    <div>
      <Hero />

      <FeaturesStrip />

      <div className="mx-auto w-full max-w-7xl">
        <BestSelling />

        <MostPopular occasionId={occasionId} />

        <AboutSection />

        <Gallery />
      </div>

      <Testimonials />

      <div className="mx-auto w-full max-w-7xl">
        <Companies />
      </div>
    </div>
  );
}
