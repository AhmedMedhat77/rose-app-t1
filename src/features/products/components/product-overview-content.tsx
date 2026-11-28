import { getTranslations } from "next-intl/server";

import ProductsCarousel from "@/shared/components/products-carousel";
import { getProducts } from "@/shared/lib/apis/products.api";
import type { IProductOverview, IProduct } from "../types/product";
import { ProductDetails } from "./product-description";
import ProductGallery from "./product-gallery/product-gallery";
import ProductReview from "./product-reviews/product-review";

const RELATED_PRODUCTS_LIMIT = 9;

interface ProductOverviewContentProps {
  product: IProductOverview;
  isAuthenticated: boolean;
  reviewsSlot: React.ReactNode;
}

export default async function ProductOverviewContent({
  product,
  isAuthenticated,
  reviewsSlot,
}: ProductOverviewContentProps) {
  const t = await getTranslations("Product");
  const relatedProductsQuery = new URLSearchParams({
    categoryId: product.categoryId,
    limit: String(RELATED_PRODUCTS_LIMIT),
  }).toString();

  const products: IProduct[] = await getProducts(relatedProductsQuery);
  const relatedProducts = products.filter((p) => p.id !== product.id);

  return (
    <div className="container mx-auto flex flex-col justify-between px-4 py-8 lg:py-12">
      <section className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-17.5">
        <ProductGallery
          title={product.title}
          images={product.gallery.length ? product.gallery : [product.cover]}
        />

        <ProductDetails product={product} />
      </section>

      <ProductReview
        productId={product.id}
        isAuthenticated={isAuthenticated}
        reviewsSlot={reviewsSlot}
      />

      <section className="mt-42 mb-72 flex flex-col">
        <ProductsCarousel
          productsList={Promise.resolve(relatedProducts)}
          title={t("relatedProducts")}
        />
      </section>
    </div>
  );
}
