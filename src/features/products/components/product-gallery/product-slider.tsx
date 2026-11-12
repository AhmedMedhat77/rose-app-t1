import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { IProductOverview } from "../../types/product";

type ProductSliderProps = {
  images: IProductOverview["gallery"];
  onSetActiveImage: (indx: number) => void;
};

export default function ProductSlider({
  images,
  onSetActiveImage,
}: ProductSliderProps) {
  return (
    <Carousel>
      <CarouselContent>
        {images.map((image, idx) => (
          <CarouselItem key={image}>
            <CarouselItem onClick={() => onSetActiveImage(idx)}>
              <Image src={image || ""} alt={image || ""} />
            </CarouselItem>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
