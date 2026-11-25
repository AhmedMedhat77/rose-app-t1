// WARNING: Dev-only preview of the Orders UI with mock data. Delete before merge.
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { OrderCard } from "@/features/orders/components/order-card";
import { MOCK_ORDERS } from "@/features/orders/lib/mocks/orders.mock";

export default async function OrdersPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const t = await getTranslations("Orders");

  return (
    <section className="container flex flex-col gap-6 py-15.5">
      <h1 className="text-text-plain text-4xl font-bold">{t("title")}</h1>
      <ul className="flex flex-col gap-4">
        {MOCK_ORDERS.map((order) => (
          <li key={order.id}>
            <OrderCard order={order} />
          </li>
        ))}
      </ul>
    </section>
  );
}
