"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Field } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { TicketPercent, X, MoveRightIcon } from "lucide-react";
import { ICoupon } from "@/features/coupon/lib/types/coupon";

const couponList: ICoupon[] = [
  {
    id: "49549cae-777a-4f39-b213-14cebd993a58",
    code: "SAVE20",
    type: "PERCENT",
    value: "20",
    minPurchase: "50",
    maxDiscount: "25",
    usageLimit: 100,
    usedCount: 100,
    validFrom: "2026-07-11T00:00:00.000Z",
    validUntil: "2026-12-31T23:59:59.000Z",
    isActive: true,
    immutable: false,
    createdAt: "2026-07-11T11:08:40.021Z",
    updatedAt: "2026-11-15T10:46:01.771Z",
    count: {
      orders: 100,
    },
  },
  {
    id: "49549cae-777a-4f39-b213-14cebd993a59",
    code: "SAVE30",
    type: "PERCENT",
    value: "30",
    minPurchase: "50",
    maxDiscount: "30",
    usageLimit: 100,
    usedCount: 50,
    validFrom: "2026-07-11T00:00:00.000Z",
    validUntil: "2026-12-31T23:59:59.000Z",
    isActive: true,
    immutable: false,
    createdAt: "2026-07-11T11:08:40.021Z",
    updatedAt: "2026-11-15T10:46:01.771Z",
    count: {
      orders: 100,
    },
  },
  {
    id: "49549cae-777a-4f39-b213-14cebd993a60",
    code: "SAVE20",
    type: "PERCENT",
    value: "20",
    minPurchase: "50",
    maxDiscount: "25",
    usageLimit: 100,
    usedCount: 100,
    validFrom: "2026-07-11T00:00:00.000Z",
    validUntil: "2026-12-31T23:59:59.000Z",
    isActive: true,
    immutable: false,
    createdAt: "2026-07-11T11:08:40.021Z",
    updatedAt: "2026-11-15T10:46:01.771Z",
    count: {
      orders: 100,
    },
  },
  {
    id: "49549cae-777a-4f39-b213-14cebd993a61",
    code: "SAVE30",
    type: "PERCENT",
    value: "30",
    minPurchase: "50",
    maxDiscount: "30",
    usageLimit: 100,
    usedCount: 50,
    validFrom: "2026-07-11T00:00:00.000Z",
    validUntil: "2026-12-31T23:59:59.000Z",
    isActive: true,
    immutable: false,
    createdAt: "2026-07-11T11:08:40.021Z",
    updatedAt: "2026-11-15T10:46:01.771Z",
    count: {
      orders: 100,
    },
  },
];

export default function Summary() {
  const t = useTranslations("Cart");

  const content =
    couponList.length > 0 ? (
      <ul className="flex w-full flex-col gap-2.5">
        {couponList.map((coupon) => (
          <li key={coupon.id}>
            <div className="flex justify-between rounded-sm bg-white p-2">
              <p className="text-text-default flex font-medium">
                {coupon.code}
              </p>
              <p className="text-text-default flex text-sm">{coupon.value}%</p>
              <Button
                size="icon-xs"
                variant="ghost"
                className="text-text-muted hover:text-text-danger bg-transparent hover:bg-transparent"
              >
                <X className="size-5" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-text-muted flex w-full items-center justify-center italic">
        {t("no-coupons")}
      </p>
    );

  const handleApplyCoupon = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("apply coupon");
  };

  return (
    <div className="flex h-151.25 w-114.5 flex-col gap-6 rounded-md">
      {/* summary */}
      <h2 className="text-text-plain text-3xl font-semibold">{t("summary")}</h2>
      <div className="bg-bg-subtle flex min-h-0 flex-1 flex-col gap-2.5 rounded-sm p-4">
        <form onSubmit={handleApplyCoupon}>
          <Field orientation="horizontal">
            <div className="flex-2">
              <Input
                type="text"
                placeholder={t("coupon-placeholder")}
                className="w-full bg-white shadow-none"
              />
            </div>
            <Button type="submit" className="bg-bg-maroon-secondary flex-1">
              <TicketPercent className="size-5" />
              {t("apply")}
            </Button>
          </Field>
        </form>
        {/* coupon list */}
        <div className="border-border-soft flex min-h-0 flex-1 overflow-y-auto rounded-md border p-2.5">
          {content}
        </div>
        {/* subtotal & total */}
        <div className="flex flex-col gap-4">
          {/* subtotal */}
          <div className="flex justify-between">
            <span className="text-text-plain text-lg font-medium">
              {t("subtotal")}
            </span>
            <span className="text-text-plain text-xl font-semibold">
              0.00 EGP
            </span>
          </div>
          {/* horizontal divider */}
          <hr className="border-border-soft border" />
          {/* total */}
          <div className="flex justify-between">
            <span className="text-text-maroon text-2xl font-bold">
              {t("total")}
            </span>
            <span className="text-text-maroon text-2xl font-bold">
              0.00 EGP
            </span>
          </div>
        </div>
      </div>
      {/* checkout button */}
      <Button
        nativeButton={false}
        render={<Link href="/checkout" />}
        className="bg-bg-maroon-secondary h-17.5 w-full rounded-xl text-xl"
      >
        {t("checkout")}
        <MoveRightIcon className="size-5 rtl:rotate-180" />
      </Button>
    </div>
  );
}
