import { getTranslations } from "next-intl/server";

import { getProductsYouMayLike } from "@/features/products/lib/apis/products-you-may-like.api";
import ProductsCarousel from "@/shared/components/products-carousel";

import CartSection from "../../../../features/summary/components/cart-section";

export default async function CartPage() {
  const t = await getTranslations("Cart");

  return (
    <section className="mx-auto flex w-full flex-col gap-12.5 px-20 py-30">
      <div className="flex gap-10">
        <CartSection />
      </div>
      <div className="flex flex-col gap-6 p-2.5">
        <ProductsCarousel
          title={t("productYouMayLike")}
          productsList={getProductsYouMayLike()}
        />
      </div>
    </section>
  );
}
