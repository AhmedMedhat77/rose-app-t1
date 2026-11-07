import BestSellingRose from "@/features/bestSelling/components/BestSellingRose";
import Companies from "@/features/companies/Companies";
import Gallery from "@/features/gallery/components/Gallery";
import MostPopular from "@/features/mostPopular/components/MostPopular";
import getAllProducts from "@/features/mostPopular/lib/api";
import Testimonials from "@/features/testimonials/components/Testimonials";

export default async function HomePage() {
  const data = await getAllProducts();
  return (
    <div>
      <div className="mx-auto w-[80rem]">
        <BestSellingRose />
        <MostPopular allProducts={data} />
        <Gallery />
      </div>
      <Testimonials />
      <div className="mx-auto w-[80rem]">
        <Companies />
      </div>
    </div>
  );
}
