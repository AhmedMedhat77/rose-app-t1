import { FeaturesStrip } from "@/features/home/components/hero-section/features-strip";
import BestSelling from "@/features/bestSelling/components/best-selling";
import MostPopular from "@/features/mostPopular/components/most-popular";
import AboutSection from "@/features/home/components/about-section/about-section";
import Gallery from "@/features/gallery/components/Gallery";
import Testimonials from "@/features/testimonials/components/Testimonials";
import Companies from "@/features/companies/Companies";
import { Hero } from "@/features/home/components/hero-section/hero";

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
      <div>
        <FeaturesStrip />
        <BestSelling />
        <MostPopular
          occasions={occasions}
          initialProducts={initialProducts}
          initialOccasionId={initialOccasionId}
        />

        <AboutSection />

        <Gallery />
      </div>

      <Testimonials />

      <div className="mx-auto w-full max-w-[80rem]">
        <Companies />
      </div>
    </div>
  );
}
