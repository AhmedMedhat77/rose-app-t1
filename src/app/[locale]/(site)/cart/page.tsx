import { getTranslations } from "next-intl/server";
import SectionsTitle from "@/shared/components/SectionsTitle";
import ProductsCarousel from "@/shared/components/products-carousel";
import { Button } from "@/shared/ui/button";
import { MoveRightIcon, TicketPercent } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { getProductsYouMayLike } from "@/features/cart/lib/apis/products-you-may-like.api";
import { ICoupon } from "@/features/coupon/lib/types/coupon";

const couponList: ICoupon[] = [];

export default async function CartPage() {
  const t = await getTranslations("Cart");

  const content =
    couponList.length > 0 ? (
      couponList.map((coupon) => (
        <div key={coupon.id}>
          <span>{coupon.code}</span>
        </div>
      ))
    ) : (
      <span className="text-text-muted items-center justify-center text-center italic">
        {t("no-coupons")}
      </span>
    );

  return (
    <section className="mx-auto flex w-full flex-col gap-12.5 px-20 py-30">
      <div className="flex gap-10">
        <div className="flex-2">
          {/* cart */}
          <h1 className="text-text-plain text-5xl font-bold">{t("title")}</h1>
        </div>
        <div className="flex h-151.25 w-114.5 flex-col gap-6 rounded-md">
          {/* summary */}
          <h2 className="text-text-plain text-2xl font-semibold">
            {t("summary")}
          </h2>
          <div className="bg-bg-subtle flex min-h-0 flex-1 flex-col gap-2.5 rounded-sm p-4">
            <div className="flex gap-2.5">
              <Input
                type="text"
                placeholder={t("coupon-placeholder")}
                className="w-full shadow-none"
              />
              <Button className="bg-bg-maroon-secondary flex-1">
                <TicketPercent className="size-5" />
                {t("apply")}
              </Button>
            </div>
            {/* coupon list */}
            <div className="border-border-soft flex min-h-0 flex-1 flex-col items-center justify-center gap-2.5 overflow-y-auto rounded-md border p-2.5">
              {content}
            </div>
            {/* subtotal & total */}
            <div className="flex flex-col gap-4">
              {/* subtotal */}
              <div className="flex justify-between">
                <span className="text-text-plain text-sm font-medium">
                  {t("subtotal")}
                </span>
                <span className="text-text-plain text-sm font-medium">
                  250 EGP
                </span>
              </div>
              {/* horizontal divider */}
              <hr className="border-border-soft border" />
              {/* total */}
              <div className="flex justify-between">
                <span className="text-text-maroon text-sm font-medium">
                  {t("total")}
                </span>
                <span className="text-text-maroon text-sm font-medium">
                  1250 EGP
                </span>
              </div>
            </div>
            {/* checkout button */}
            <Button className="bg-bg-maroon-secondary">
              {t("checkout")}
              <MoveRightIcon className="h-2 w-5 rtl:rotate-180" />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6 p-2.5">
        {/* Product you may like */}
        <div className="flex justify-start">
          <SectionsTitle className="" mainTitle={t("productYouMayLike")} />
        </div>
        <ProductsCarousel productsList={getProductsYouMayLike()} />
      </div>
    </section>
  );
}
