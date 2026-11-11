import getAllProducts from "../lib/api";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getLocale } from "next-intl/server";
import ProductCard from "@/shared/components/ProductCard";

export default async function BestSellingSoldCarussel() {
  const { data } = await getAllProducts();

  const locale = await getLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div dir={dir} className="relative w-full min-w-0">
      <Carousel
        dir={dir}
        opts={{
          direction: dir,
          align: "start",
          loop: true,
          slidesToScroll: 1,
        }}
        className="relativeabsolute w-full min-w-0"
      >
        <CarouselContent className="-ml-4">
          {data.map((ele) => (
            <CarouselItem key={ele.id} className="basis-[320px] pl-4">
              <ProductCard product={ele} variant="bestSelling" />
            </CarouselItem>
          ))}
        </CarouselContent>

        {dir === "ltr" ? (
          <>
            <CarouselPrevious className="bg-bg-maron text-text-inverse hover:bg-bg-maron text-text-inverse hover:text-text-inverse dark:bg-bg-maron dark:hover:dark:bg-bg-maron absolute right-auto left-[-15px] z-20 border-0 dark:text-white dark:hover:text-white" />
            <CarouselNext className="bg-bg-maron text-text-inverse hover:bg-bg-maron text-text-inverse hover:text-text-inverse dark:bg-bg-maron dark:hover:dark:bg-bg-maron absolute right-[-15px] left-auto z-20 border-0 dark:text-white dark:hover:text-white" />
          </>
        ) : (
          <>
            <CarouselNext className="bg-bg-maron text-text-inverse hover:bg-bg-maron text-text-inverse hover:text-text-inverse dark:bg-bg-maron dark:hover:dark:bg-bg-maron absolute right-auto left-[98%] z-20 border-0 dark:text-white dark:hover:text-white" />
            <CarouselPrevious className="bg-bg-maron text-text-inverse hover:bg-bg-maron text-text-inverse hover:text-text-inverse dark:bg-bg-maron dark:hover:dark:bg-bg-maron absolute right-[98%] left-auto z-20 border-0 dark:text-white dark:hover:text-white" />
          </>
        )}
      </Carousel>
    </div>
  );
}
