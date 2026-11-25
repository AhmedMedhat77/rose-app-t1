import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import { OrdersList } from "@/features/orders/components/orders-list";
import { getOrdersPagination } from "@/features/orders/lib/utils/order.util";
import { OrdersListSkeleton } from "@/features/orders/skeletons/orders-list.skeleton";

interface OrdersPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function OrdersPage({
  params,
  searchParams,
}: OrdersPageProps) {
  const t = await getTranslations("Orders");

  return (
    <section className="container flex flex-col gap-6 py-15.5">
      <h1 className="text-text-plain text-4xl font-bold">{t("title")}</h1>

      <Suspense fallback={<OrdersListSkeleton />}>
        <OrdersPageContent params={params} searchParams={searchParams} />
      </Suspense>
    </section>
  );
}

async function OrdersPageContent({ params, searchParams }: OrdersPageProps) {
  const { locale } = await params;
  const { page, limit } = getOrdersPagination(await searchParams);

  return (
    <OrdersList
      key={`${page}-${limit}`}
      locale={locale}
      page={page}
      limit={limit}
    />
  );
}
