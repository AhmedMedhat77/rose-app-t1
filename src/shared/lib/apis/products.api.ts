import "server-only";

import { notFound } from "next/navigation";

import { apiFetch } from "@/shared/lib/apis/fetch.api";
import type {
  IProduct,
  IProductOverview,
  IProductOverviewResponse,
} from "@/features/products/types/product";
import type { IPaginatedPayload } from "@/shared/lib/types/api";

export async function getProductById(id: string): Promise<IProductOverview> {
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

export async function getProducts(query: string): Promise<IProduct[]> {
  const response = await apiFetch<IPaginatedPayload<IProduct>>(
    `/products?${query}`,
    {
      next: { revalidate: 300, tags: ["products"] },
    },
  );
  return response.payload.data;
}
