"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import type { IProductOverview } from "../../types/product";
import ProductImage from "./product-image";
import ProductSlider from "./product-slider";

type ProductGalleryProps = {
  images: IProductOverview["gallery"];
};

export default function ProductGallery({ images }: ProductGalleryProps) {
  const t = useTranslations("Product");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const activeImage =
    selectedImage && images.includes(selectedImage)
      ? selectedImage
      : (images[0] ?? null);

  const handleSetActiveImage = (indx: number) => {
    const image = images[indx];
    if (image) setSelectedImage(image);
  };

  return (
    <section aria-label={t("galleryLabel")} className="min-w-0">
      <div className="bg-bg-soft relative aspect-[1.16] overflow-hidden rounded-2xl">
        {activeImage ? (
          <ProductImage image={activeImage} />
        ) : (
          <div className="text-text-muted grid size-full place-items-center">
            {t("imageUnavailable")}
          </div>
        )}
      </div>
      {images.length > 0 && (
        <ProductSlider
          images={images}
          activeImage={activeImage}
          onSetActiveImage={handleSetActiveImage}
        />
      )}
    </section>
  );
}
