import { getTranslations } from "next-intl/server";

import ProductsCarousel from "@/shared/components/products-carousel";
import { getProductsByCategory } from "../lib/apis/products.api";
import type { IProductOverview } from "../types/product";
import { ProductDetails } from "./product-description";
import ProductGallery from "./product-gallery/product-gallery";

interface ProductOverviewContentProps {
  product: IProductOverview;
}

export default async function ProductOverviewContent({
  product,
}: ProductOverviewContentProps) {
  const t = await getTranslations("Product");
  const relatedProducts = getProductsByCategory(product.categoryId);

  return (
    <div className="container mx-auto flex flex-col justify-between px-4 py-8 lg:py-12">
      <section className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-17.5">
        <ProductGallery
          title={product.title}
          images={product.gallery.length ? product.gallery : [product.cover]}
        />

        <ProductDetails product={product} />
      </section>

      <section className="mt-42 mb-72 flex flex-col">
        <ProductsCarousel
          productsList={relatedProducts}
          title={t("relatedProducts")}
        />
      </section>
    </div>
  );
}
