"use client";

import { useEffect } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { zodResolver } from "@hookform/resolvers/zod";
import { TicketPercent, Check, XIcon, MoveRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";

import { useCartContext } from "@/features/cart/context/cart-provider";
import { getCartSubtotal } from "@/features/cart/utils/cart-subtotal.util";
import { Link } from "@/i18n/navigation";
import { cn } from "@/shared/lib/utils/cn.util";
import { Button } from "@/shared/ui/button";
import { Field, FieldError, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";

import { useCouponContext } from "../context/coupon-provider";
import { useApplyCoupon } from "../hooks/use-apply-coupon";
import { SummaryAmountSkeleton } from "../skeletons/summary-amount.skeleton";
import { createApplyCouponSchema } from "../lib/schemas/apply-coupon.schema";
import type { ApplyCouponFormValues } from "../lib/types/apply-coupon.types";
import {
  getCouponApplyError,
  getCouponsDiscount,
  type CouponApplyError,
} from "../lib/utils/coupon.util";

const summaryVariants = cva("", {
  variants: {
    variant: {
      editable: "",
      readonly: "",
    },
  },
  defaultVariants: {
    variant: "editable",
  },
});

interface SummaryProps extends VariantProps<typeof summaryVariants> {
  className?: string;
}

const COUPON_ERROR_KEY: Record<CouponApplyError, string> = {
  "not-found": "coupon-not-found",
  "already-applied": "coupon-already-applied",
  inactive: "coupon-inactive",
  expired: "coupon-expired",
  "below-minimum": "coupon-below-minimum",
};

const COUPON_CODE_ERROR_ID = "coupon-code-error";

const SUMMARY_LINE_CLASS =
  "flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1";

const SUMMARY_AMOUNT_CLASS = "ms-auto max-w-full text-end tabular-nums";

export default function Summary({ className, variant }: SummaryProps) {
  // Translation
  const t = useTranslations("Cart");

  const isReadOnly = variant === "readonly";

  // Context
  const { viewItems, isReady } = useCartContext();
  const { appliedCoupons, addAppliedCoupon, removeAppliedCoupon } =
    useCouponContext();

  // Hooks
  const { applyCoupon, isPending } = useApplyCoupon();

  // Form
  const form = useForm<ApplyCouponFormValues>({
    resolver: zodResolver(
      createApplyCouponSchema({ codeRequired: t("code-required") }),
    ),
    defaultValues: { code: "" },
  });

  // Variables
  const subtotal = getCartSubtotal(viewItems);
  const isCheckoutDisabled = !isReady || viewItems.length === 0;
  const couponDiscount = getCouponsDiscount(appliedCoupons, subtotal);
  const total = subtotal - couponDiscount;
  const discountPercentage =
    subtotal > 0 ? `${Math.round((couponDiscount / subtotal) * 100)}%` : "0%";

  // Functions
  async function onSubmit(values: ApplyCouponFormValues) {
    const result = await applyCoupon(values.code);

    if (!result.ok) {
      form.setError("code", { message: t("coupon-request-failed") });
      return;
    }

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
    addAppliedCoupon(coupon);
    form.reset();
  }

  function formatMoney(amount: number) {
    return `${amount.toFixed(2)} ${t("currency")}`;
  }

  // Effects
  useEffect(() => {
    if (!isReady || isReadOnly) {
      return;
    }

    for (const coupon of appliedCoupons) {
      const storedError = getCouponApplyError({
        coupon,
        appliedCoupons: [],
        subtotal,
      });

      if (storedError) {
        removeAppliedCoupon(coupon.id);
      }
    }
  }, [appliedCoupons, isReady, isReadOnly, removeAppliedCoupon, subtotal]);

  return (
    <div
      className={cn(
        summaryVariants({ variant }),
        "flex h-151.25 w-full min-w-0 flex-col gap-6 rounded-md",
        className,
      )}
    >
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
                  className="flex-wrap"
                >
                  <FieldLabel htmlFor="coupon-code" className="sr-only">
                    {t("coupon-placeholder")}
                  </FieldLabel>

                  <div className="min-w-48 grow-2 basis-48">
                    <Input
                      {...field}
                      id="coupon-code"
                      type="text"
                      placeholder={t("coupon-placeholder")}
                      aria-invalid={fieldState.invalid}
                      aria-describedby={
                        fieldState.invalid ? COUPON_CODE_ERROR_ID : undefined
                      }
                      className="w-full min-w-0 bg-white shadow-none"
                      readOnly={isReadOnly}
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="flex shrink-0 grow">
                    <Button
                      type="submit"
                      disabled={isPending || isReadOnly}
                      className="bg-bg-maroon-secondary w-full"
                    >
                      <TicketPercent className="size-5" />
                      {isPending ? t("applying") : t("apply")}
                    </Button>
                  </div>
                </Field>

                {fieldState.invalid && (
                  <FieldError
                    id={COUPON_CODE_ERROR_ID}
                    errors={[fieldState.error]}
                  />
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
                    {!isReadOnly && (
                      <Button
                        type="button"
                        size="icon-xs"
                        variant="ghost"
                        aria-label={t("remove")}
                        className="text-text-soft hover:text-text-danger bg-transparent hover:bg-transparent"
                        onClick={() => removeAppliedCoupon(coupon.id)}
                      >
                        <XIcon className="size-5" />
                      </Button>
                    )}
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
        <div className="flex min-w-0 flex-col gap-4" aria-busy={!isReady}>
          <div className={SUMMARY_LINE_CLASS}>
            <span className="text-text-plain min-w-0 text-lg font-medium">
              {t("subtotal")}
            </span>
            <span
              className={cn(
                SUMMARY_AMOUNT_CLASS,
                "text-text-plain text-xl font-semibold",
              )}
            >
              {isReady ? formatMoney(subtotal) : <SummaryAmountSkeleton />}
            </span>
          </div>
          {isReadOnly ? (
            <div className="flex items-center gap-2.5">
              <hr className="border-border-soft w-full border" />
              <p className="text-text-plain shrink-0 text-base font-semibold">
                {isReady ? (
                  `${discountPercentage} ${t("discount")}`
                ) : (
                  <SummaryAmountSkeleton />
                )}
              </p>
              <hr className="border-border-soft w-full border" />
            </div>
          ) : (
            <>
              <div className={SUMMARY_LINE_CLASS}>
                <span className="text-text-plain min-w-0 text-lg font-medium">
                  {t("discount")}
                </span>
                <span
                  className={cn(
                    SUMMARY_AMOUNT_CLASS,
                    "text-text-plain text-xl font-semibold",
                  )}
                >
                  {isReady ? (
                    formatMoney(couponDiscount)
                  ) : (
                    <SummaryAmountSkeleton />
                  )}
                </span>
              </div>
              <hr className="border-border-soft w-full shrink-0 border" />
            </>
          )}
          <div className={SUMMARY_LINE_CLASS}>
            <span
              className={`${isReadOnly ? "text-text-plain" : "text-text-maroon"} min-w-0 text-2xl font-bold`}
            >
              {t("total")}
            </span>
            <span
              className={cn(
                SUMMARY_AMOUNT_CLASS,
                `${isReadOnly ? "text-text-plain" : "text-text-maroon"}`,
                "text-2xl font-bold",
              )}
            >
              {isReady ? (
                formatMoney(total)
              ) : (
                <SummaryAmountSkeleton className="h-8 w-28 max-w-full" />
              )}
            </span>
          </div>
        </div>
      </div>
      {!isReadOnly && (
        <Button
          nativeButton={false}
          disabled={isCheckoutDisabled}
          render={isCheckoutDisabled ? <span /> : <Link href="/checkout" />}
          className={cn(
            "bg-bg-maroon-secondary h-17.5 w-full rounded-xl text-xl",
            "data-disabled:pointer-events-none data-disabled:bg-gray-200 data-disabled:text-gray-500",
          )}
        >
          {t("checkout")}
          <MoveRightIcon className="size-5 rtl:rotate-180" />
        </Button>
      )}
    </div>
  );
}
