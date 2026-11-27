import type { IApiResponse, IPaginatedResponse } from "@/shared/lib/types/api";

import { ApiError } from "next/dist/server/api-utils";

import { IReviewFormValues } from "../../schemas/review.schema";
import { REVIEWS_LIMIT } from "../constants/product.constants";
import { HEADERS } from "@/shared/lib/constants/api.constant";
import { IProductReview } from "./../../types/product.d";

export async function getReviewsApi(
  productId: string,
  limit: number = REVIEWS_LIMIT,
): Promise<IPaginatedResponse<IProductReview>> {
  const query = new URLSearchParams({
    productId,
    page: "1",
    limit: String(limit),
  });

  const res = await fetch(`${process.env.API_URL}/reviews?${query}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to fetch reviews");
  }

  return res.json();
}
export async function createReviewApi(
  values: IReviewFormValues,
  accessToken: string,
): Promise<IApiResponse<{ review: IProductReview }>> {
  const response = await fetch(`${process.env.API_URL}/reviews`, {
    method: "POST",
    headers: {
      ...HEADERS.JSON_HEADER,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(values),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new ApiError(
      response.status,
      result.message || "FAILED_TO_CREATE_REVIEW",
    );
  }

  return result;
}
