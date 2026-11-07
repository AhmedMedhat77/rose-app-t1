import getAllProducts from "../lib/api";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Image from "next/image";
import { ShoppingCart, Star } from "lucide-react";
import { getLocale } from "next-intl/server";

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
          {data.map(
            (ele) =>
              Number(ele.ratings) > 1 && (
                <CarouselItem key={ele.id} className="basis-[320px] pl-4">
                  <div className="w-full space-y-2">
                    {/* Product Image */}
                    <div className="relative h-[220px] w-full overflow-hidden rounded-xl">
                      {ele.cover && (
                        <Image
                          src={ele.cover}
                          alt={ele.title}
                          fill
                          sizes="302px"
                          className="object-cover"
                        />
                      )}

                      {/* Product Badges */}
                      <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
                        {ele.stock <= 0 && (
                          <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-medium text-white">
                            OUT OF STOCK
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-1">
                      {/* Product Title */}
                      <p className="font-primary text-text-primary truncate text-[16px] leading-none font-semibold">
                        {ele.title}
                      </p>

                      {/* Rating & Cart */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 4 }, (_, i) => (
                            <Star
                              key={i}
                              size={17}
                              strokeWidth={1.5}
                              fill={
                                i < Math.round(ele.rating ?? 0)
                                  ? "#F9A825"
                                  : "none"
                              }
                              className={
                                i < Math.round(ele.rating ?? 0)
                                  ? "text-[#F9A825]"
                                  : "text-[#F9A825]"
                              }
                            />
                          ))}
                        </div>

                        <div className="bg-bg-maron flex size-9 items-center justify-center rounded-full text-white">
                          <ShoppingCart size={19} />
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2">
                        <span className="font-primary text-bg-primary text-[14px] font-medium">
                          {ele.price} EGP
                        </span>
                        <span className="font-primary text-text-muted align-bottom text-base leading-none font-medium tracking-normal line-through">
                          {ele.discountValue &&
                            Number(ele.price) -
                              (Number(ele.price) * Number(ele.discountValue)) /
                                100}{" "}
                          {ele.discountValue && "EGP"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ),
          )}
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
