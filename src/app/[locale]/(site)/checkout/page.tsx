import { getTranslations } from "next-intl/server";
import Summary from "@/features/summary/components/summary";
import ProductsCarousel from "@/shared/components/products-carousel";
import { getProductsYouMayLike } from "@/features/products/lib/apis/products-you-may-like.api";

export default async function CheckoutPage() {
  const t = await getTranslations("Cart");

  return (
    <section className="mx-auto flex w-full flex-col gap-12.5 px-20 py-30">
      <div className="flex gap-10">
        <div className="flex-2">
          {/* Checkout Stepper */}
          <h1 className="text-text-plain text-2xl font-semibold">
            Shipping Address
          </h1>
        </div>
        <Summary />
      </div>
      <div className="flex flex-col gap-6 p-2.5">
        {/* Product you may like */}
        <ProductsCarousel
          title={t("productYouMayLike")}
          productsList={getProductsYouMayLike()}
        />
      </div>
    </section>
  );
}
