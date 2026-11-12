import getAllProducts from "../lib/api";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ProductCard from "@/shared/components/product-card";

export default async function BestSellingSoldCarousel() {
  const { data } = await getAllProducts();

  return (
    <div className="relative w-full min-w-0">
      <Carousel className="absolute w-full min-w-0">
        <CarouselContent>
          {data.map((ele) => (
            <CarouselItem key={ele.id} className="basis-[320px] pl-4">
              <ProductCard product={ele} variant="bestSelling" />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="bg-bg-maron-secondary text-text-inverse hover:bg-bg-maron hover:text-text-inverse dark:bg-bg-maron dark:hover:dark:bg-bg-maron absolute right-auto left-[-15px] z-20 border-0 dark:text-white dark:hover:text-white" />
        <CarouselNext className="bg-bg-maron-secondary text-text-inverse hover:bg-bg-maron hover:text-text-inverse dark:bg-bg-maron dark:hover:dark:bg-bg-maron absolute right-[-15px] left-auto z-20 border-0 dark:text-white dark:hover:text-white" />
      </Carousel>
    </div>
  );
}
