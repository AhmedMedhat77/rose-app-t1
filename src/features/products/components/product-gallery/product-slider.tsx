import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui/carousel";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { IProductOverview } from "../../types/product";

type ProductSliderProps = {
  images: IProductOverview["gallery"];
  activeImage: string | null;
  onSetActiveImage: (indx: number) => void;
};

export default function ProductSlider({
  images,
  activeImage,
  onSetActiveImage,
}: ProductSliderProps) {
  const t = useTranslations("Product");

  return (
    <Carousel opts={{ align: "start" }} className="mt-3 px-1">
      <CarouselContent className="-ms-2">
        {images.map((image, idx) => (
          <CarouselItem
            key={`${image}-${idx}`}
            className="basis-1/4 ps-2 sm:basis-1/5"
          >
            <button
              type="button"
              onClick={() => onSetActiveImage(idx)}
              onMouseEnter={() => onSetActiveImage(idx)}
              aria-label={t("viewImage", { number: idx + 1 })}
              aria-pressed={image === activeImage}
              className={`relative block aspect-square w-full overflow-hidden rounded-xl border-2 transition ${image === activeImage ? "border-bg-primary" : "hover:border-border-primary border-transparent"}`}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="100px"
                className="object-cover"
              />
            </button>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="start-0" aria-label={t("previousImages")} />
      <CarouselNext className="end-0" aria-label={t("nextImages")} />
    </Carousel>
  );
}
