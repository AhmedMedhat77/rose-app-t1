"use client";
import { useState } from "react";
import { IProductOverview } from "../../types/product";
import ProductImage from "./product-image";
import ProductSlider from "./product-slider";

type ProductGalleryProps = {
  images: IProductOverview["gallery"];
};

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState<string>(images[0]);

  const handleSetActiveImage = (indx: number) => {
    const image = images[indx];
    setActiveImage(image);
  };

  return (
    <div>
      <ProductImage image={activeImage} />
      <ProductSlider
        images={images}
        onSetActiveImage={(indx) => handleSetActiveImage(indx)}
      />
    </div>
  );
}
