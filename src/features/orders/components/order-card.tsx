import { useFormatter, useTranslations } from "next-intl";

import { Badge } from "@/shared/ui/badge";
import { cn } from "cn";

import {
  DELIVERY_STATUS_DISPLAY,
  ORDER_STATUS_DISPLAY,
  PAYMENT_METHOD_DISPLAY,
} from "../lib/constants/order-status.constant";
import type { IOrder } from "../lib/types/order.types";
import { getOrderNumber } from "../lib/utils/order.util";
import { OrderItems } from "./order-items";

interface OrderCardProps {
  order: IOrder;
}

export function OrderCard({ order }: OrderCardProps) {
  // Translation
  const t = useTranslations("Orders");
  const format = useFormatter();

  // Variables
  const status = ORDER_STATUS_DISPLAY[order.status];
  const delivery = DELIVERY_STATUS_DISPLAY[order.status];
  const payment = PAYMENT_METHOD_DISPLAY[order.paymentMethod];
  const isPaid = order.paymentStatus === "SUCCEEDED";
  const DeliveryIcon = delivery.icon;
  const PaymentIcon = payment.icon;

  return (
    <article className="border-border-muted overflow-hidden rounded-lg border">
      {/* Header */}
      <header className="bg-bg-maroon-secondary text-primary-foreground flex flex-wrap items-center justify-between gap-2 px-4 py-3">
        <h2 className="text-xl font-semibold">
          {t("orderNumber", { number: getOrderNumber(order.id) })}
        </h2>
        <p className="text-sm">
          {t("createdIn")}{" "}
          <time dateTime={order.createdAt} className="font-medium">
            {format.dateTime(new Date(order.createdAt), {
              dateStyle: "long",
              timeStyle: "short",
            })}
          </time>
        </p>
      </header>

      <div className="flex flex-col gap-4 p-4">
        {/* Summary */}
        <div className="border-border-muted flex flex-wrap items-center justify-between gap-3 border-b pb-3">
          <div className="flex items-center gap-3">
            <p className="text-text-plain text-xl">
              {t("totalPrice")}{" "}
              <span className="text-2xl font-bold">
                {format.number(Number(order.total))} {t("currency")}
              </span>
            </p>
            {isPaid && (
              <Badge className="bg-bg-success text-text-inverse hover:bg-bg-success h-6 px-3">
                {t("paid")}
              </Badge>
            )}
          </div>

          <p className="text-text-plain flex items-center gap-2 text-sm font-semibold">
            {t("status")}
            <Badge className={cn("h-6 px-3", status.className)}>
              {t(status.labelKey)}
            </Badge>
          </p>
        </div>

        {/* Details */}
        <dl className="text-text-plain grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-2 px-3.5 text-sm">
          <dt className="font-semibold">{t("paymentMethod")}</dt>
          <dd className="text-text-soft flex items-center gap-1.5">
            <PaymentIcon aria-hidden="true" className="size-4" />
            {t(payment.labelKey)}
          </dd>

          <dt className="font-semibold">{t("deliveryStatus")}</dt>
          <dd className={cn("flex items-center gap-1.5", delivery.className)}>
            <DeliveryIcon aria-hidden="true" className="size-4" />
            {t(delivery.labelKey)}
          </dd>
        </dl>

        {/* Items */}
        <section aria-label={t("orderItems")} className="flex flex-col gap-2">
          <p className="text-text-plain px-3.5 text-sm font-semibold">
            {t("orderItems")}
          </p>
          <OrderItems items={order.orderItems} />
        </section>
      </div>
    </article>
  );
}
