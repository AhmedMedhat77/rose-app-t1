import { apiFetch } from "@/shared/lib/apis/fetch.api";
import type {
  IApiResponse,
  IPaginatedPayload,
  IPaginatedResponse,
} from "@/shared/lib/types/api";

import { IReviewFormValues } from "../../schemas/review.schema";
import { REVIEWS_LIMIT } from "../constants/product.constants";
import { IProductReview } from "./../../types/product.d";

export async function getReviewsApi(
  productId: string,
  limit: number = REVIEWS_LIMIT,
): Promise<IPaginatedResponse<IProductReview>> {
  return apiFetch<IPaginatedPayload<IProductReview>>("/reviews", {
    query: { productId, page: 1, limit },
    cache: "no-store",
  });
}
export async function createReviewApi(
  values: IReviewFormValues,
  accessToken: string,
): Promise<IApiResponse<{ review: IProductReview }>> {
  return apiFetch<{ review: IProductReview }>("/reviews", {
    method: "POST",
    auth: accessToken,
    body: values,
  });
}
