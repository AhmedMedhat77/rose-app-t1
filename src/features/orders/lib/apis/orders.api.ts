import "server-only";

import { apiFetch } from "@/shared/lib/apis/fetch.api";
import type { IPaginatedPayload } from "@/shared/types/api";

import type { IOrder } from "../types/order.types";

interface GetOrdersParams {
  page: number;
  limit: number;
}

export async function getOrders(
  accessToken: string,
  { page, limit }: GetOrdersParams,
) {
  const result = await apiFetch<IPaginatedPayload<IOrder>>("/orders", {
    auth: accessToken,
    query: { page, limit },
    cache: "no-store",
  });

  return result.payload;
}

export async function getOrderById(accessToken: string, orderId: string) {
  const result = await apiFetch<{ order: IOrder }>(
    `/orders/${encodeURIComponent(orderId)}`,
    {
      auth: accessToken,
      cache: "no-store",
    },
  );

  return result.payload.order;
}
