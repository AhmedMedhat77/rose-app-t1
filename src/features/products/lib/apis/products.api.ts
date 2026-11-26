import "server-only";

import { notFound } from "next/navigation";

import { API_URL } from "@/app/shared/constants/config";
import { getProducts } from "@/shared/lib/apis/products.api";
import type { IApiResponse, IPaginatedResponse } from "@/shared/types/api";
import type { IProduct, IProductOverviewResponse } from "../../types/product";

const RELATED_PRODUCTS_LIMIT = 8;
import { ApiError } from "next/dist/server/api-utils";

import { IReviewFormValues } from "../../schemas/review.schema";
import { REVIEWS_LIMIT } from "../constants/product.constants";
import { HEADERS } from "./../../../../shared/lib/constants/api.constant";
import { IProductReview } from "./../../types/product.d";

export async function getProductById(
  id: string,
): Promise<IApiResponse<IProductOverviewResponse>> {
  if (!API_URL) throw new Error("API_URL is not configured");
  const response = await fetch(`${API_URL}/products/${encodeURIComponent(id)}`);
  if (response.status === 404) notFound();
  const result: {
    status: boolean;
    code: number;
    message?: string;
    payload?: {
      product?: Omit<IProductOverviewResponse["product"], "gallery"> & {
        gallery: string | string[];
      };
    };
  } = await response.json();

  if (!response.ok || !result.status || !result.payload?.product) {
    throw new Error(result.message || "Unable to fetch product");
  }

  const { gallery, ...product } = result.payload.product;
  let images: string[] = [];

  if (Array.isArray(gallery)) {
    images = gallery;
  } else {
    try {
      const parsedGallery: unknown = JSON.parse(gallery);
      if (Array.isArray(parsedGallery)) {
        images = parsedGallery.filter(
          (image): image is string => typeof image === "string",
        );
      }
    } catch {
      images = gallery ? [gallery] : [];
    }
  }

  return {
    status: true,
    code: result.code,
    message: result.message ?? "",
    payload: { product: { ...product, gallery: images } },
  };
}

export async function getProductsByCategory(
  categoryId: string,
  excludeProductId: string,
): Promise<IProduct[]> {
  const params = new URLSearchParams({
    categoryId,
    limit: String(RELATED_PRODUCTS_LIMIT + 1),
  });
  const products = await getProducts(`/products?${params}`);

  return products
    .filter((product) => product.id !== excludeProductId)
    .slice(0, RELATED_PRODUCTS_LIMIT);
}

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
