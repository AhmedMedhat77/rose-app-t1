import "server-only";

import { notFound } from "next/navigation";

import { apiFetch } from "@/shared/lib/apis/fetch.api";
import type {
  IProduct,
  IProductOverview,
  IProductOverviewResponse,
} from "@/features/products/types/product";
import type { IPaginatedPayload } from "@/shared/lib/types/api";
import { PRODUCTS_TAG } from "../constants/tags.constant";

export async function getProductByIdAndGallery(
  id: string,
): Promise<IProductOverview> {
  const response = await apiFetch<IProductOverviewResponse>(
    `/products/${encodeURIComponent(id)}`,
  );
  if (!response.payload?.product) {
    notFound();
  }

  const { gallery, ...product } = response.payload.product;
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
    ...product,
    gallery: images,
  };
}

export async function getProductById(id: string) {
  const response = await apiFetch<IProduct>(
    `/products/${encodeURIComponent(id)}`,
    { cache: "no-store" },
  );
  return response.payload;
}

export async function getProducts(query: string): Promise<IProduct[]> {
  const response = await apiFetch<IPaginatedPayload<IProduct>>(
    `/products?${query}`,
    {
      next: { revalidate: 300, tags: [PRODUCTS_TAG] },
    },
  );
  return response.payload.data;
}
