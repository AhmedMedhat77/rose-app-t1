import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";

import { authOptions } from "@/auth";
import { Link, redirect } from "@/i18n/navigation";
import { Button } from "@/shared/ui/button";
import { Pagination } from "@/shared/ui/pagination";

import { getOrders } from "../lib/apis/orders.api";
import { OrderCard } from "./order-card";

interface OrdersListProps {
  locale: string;
  page: number;
  limit: number;
}

export async function OrdersList({ locale, page, limit }: OrdersListProps) {
  // Translation
  const t = await getTranslations("Orders");

  // Query
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  if (!accessToken) {
    redirect({ href: "/login", locale });
    return null;
  }

  const result = await getOrders(accessToken, { page, limit }).catch(
    () => null,
  );

  // Error state
  if (!result) {
    return (
      <p role="alert" className="text-text-danger py-10 text-center">
        {t("error")}
      </p>
    );
  }

  const { data: orders, metadata } = result;

  // Empty state (an out-of-range page is clamped by Pagination)
  if (!metadata.total) {
    return (
      <div className="flex flex-col items-center gap-4 py-10">
        <p className="text-text-soft">{t("empty")}</p>
        <Button nativeButton={false} render={<Link href="/products" />}>
          {t("startShopping")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <ul className="flex flex-col gap-4">
        {orders.map((order) => (
          <li key={order.id}>
            <OrderCard order={order} />
          </li>
        ))}
      </ul>

      {metadata.totalPages > 1 && (
        <Pagination totalItems={metadata.total} pageSize={limit} />
      )}
    </div>
  );
}
