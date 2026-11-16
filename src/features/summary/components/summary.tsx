"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TicketPercent, Check, XIcon, MoveRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";

import { findCouponByCodeAction } from "@/features/summary/lib/actions/find-coupon.action";
import type { ICoupon } from "@/features/summary/lib/types/coupon";
import { Link } from "@/i18n/navigation";
import { Button } from "@/shared/ui/button";
import { Field, FieldError } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";

import { createApplyCouponSchema } from "../lib/schemas/apply-coupon.schema";
import type { TApplyCouponFormValues } from "../lib/types/apply-coupon.types";
import {
  getCouponApplyError,
  getCouponsDiscount,
  type CouponApplyError,
} from "../lib/utils/coupon.util";

const COUPON_ERROR_KEY: Record<CouponApplyError, string> = {
  "not-found": "coupon-not-found",
  "already-applied": "coupon-already-applied",
  inactive: "coupon-inactive",
  "below-minimum": "coupon-below-minimum",
};

export default function Summary({ subtotal }: { subtotal: number }) {
  // Translation
  const t = useTranslations("Cart");

  // State
  const [appliedCoupons, setAppliedCoupons] = useState<ICoupon[]>([]);

  // Form
  const form = useForm<TApplyCouponFormValues>({
    resolver: zodResolver(
      createApplyCouponSchema({ codeRequired: t("code-required") }),
    ),
    defaultValues: { code: "" },
  });

  // Variables
  const couponDiscount = getCouponsDiscount(appliedCoupons, subtotal);
  const total = subtotal - couponDiscount;

  // Functions
  async function onSubmit(values: TApplyCouponFormValues) {
    try {
      const result = await findCouponByCodeAction(values.code);
      const applyError = getCouponApplyError({
        coupon: result.coupon,
        appliedCoupons,
        subtotal,
      });

      if (applyError || !result.coupon) {
        form.setError("code", {
          message: t(COUPON_ERROR_KEY[applyError ?? "not-found"]),
        });
        return;
      }

      const coupon = result.coupon;
      setAppliedCoupons((current) => [...current, coupon]);
      form.reset();
    } catch {
      form.setError("code", { message: t("coupon-request-failed") });
    }
  }

  function removeCoupon(couponId: string) {
    setAppliedCoupons((current) =>
      current.filter((coupon) => coupon.id !== couponId),
    );
  }

  function formatMoney(amount: number) {
    return `${amount.toFixed(2)} ${t("currency")}`;
  }

  return (
    <div className="flex h-151.25 w-114.5 flex-col gap-6 rounded-md">
      <h2 className="text-text-plain text-3xl font-semibold">{t("summary")}</h2>
      <div className="bg-bg-subtle flex min-h-0 flex-1 flex-col gap-2.5 rounded-sm p-4">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name="code"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-1">
                <Field
                  orientation="horizontal"
                  data-invalid={fieldState.invalid}
                >
                  <div className="flex-2">
                    <Input
                      {...field}
                      id="coupon-code"
                      type="text"
                      placeholder={t("coupon-placeholder")}
                      aria-invalid={fieldState.invalid}
                      className="w-full bg-white shadow-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="bg-bg-maroon-secondary flex-1"
                  >
                    <TicketPercent className="size-5" />
                    {t("apply")}
                  </Button>
                </Field>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </div>
            )}
          />
        </form>
        <div className="border-border-soft flex min-h-0 flex-1 overflow-y-auto rounded-md border p-2.5">
          {appliedCoupons.length > 0 ? (
            <ul className="flex w-full flex-col gap-2.5">
              {appliedCoupons.map((coupon) => (
                <li key={coupon.id}>
                  <div className="bg-bg-success-fade flex justify-between rounded-sm border p-2">
                    <div className="flex items-center gap-2.5">
                      <Check className="text-text-success size-5" />
                      <p className="text-text-default flex font-medium">
                        {`${t("coupon-applied")} ${coupon.code}`}
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="icon-xs"
                      variant="ghost"
                      aria-label={t("remove")}
                      className="text-text-soft hover:text-text-danger bg-transparent hover:bg-transparent"
                      onClick={() => removeCoupon(coupon.id)}
                    >
                      <XIcon className="size-5" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-text-muted flex w-full items-center justify-center italic">
              {t("no-coupons")}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <span className="text-text-plain text-lg font-medium">
              {t("subtotal")}
            </span>
            <span className="text-text-plain text-xl font-semibold">
              {formatMoney(subtotal)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-plain text-lg font-medium">
              {t("discount")}
            </span>
            <span className="text-text-plain text-xl font-semibold">
              {formatMoney(couponDiscount)}
            </span>
          </div>
          <hr className="border-border-soft border" />
          <div className="flex justify-between">
            <span className="text-text-maroon text-2xl font-bold">
              {t("total")}
            </span>
            <span className="text-text-maroon text-2xl font-bold">
              {formatMoney(total)}
            </span>
          </div>
        </div>
      </div>
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
