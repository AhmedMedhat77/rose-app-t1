import { getTranslations } from "next-intl/server";
import CartSide from "@/features/cart/components/cart-side";
import { getProductsYouMayLike } from "@/features/products/lib/apis/products-you-may-like.api";
import Summary from "@/features/summary/components/summary";
import ProductsCarousel from "@/shared/components/products-carousel";

export default async function CartPage() {
  const t = await getTranslations("Cart");

  return (
    <section className="mx-auto flex w-full flex-col gap-12.5 px-4 py-8 lg:px-20 lg:py-30">
      <div className="flex flex-col gap-10 md:flex-row">
        <div className="flex-2">
          <CartSide />
        </div>
        <div className="flex">
          <Summary />
        </div>
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
