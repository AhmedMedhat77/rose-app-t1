import "server-only";

import { notFound } from "next/navigation";

import { API_URL } from "@/app/shared/constants/config";
import { getProducts } from "@/shared/lib/apis/products.api";
import type { IApiResponse } from "@/shared/types/api";
import type { IProduct, IProductOverviewResponse } from "../../types/product";

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
): Promise<IProduct[]> {
  const params = new URLSearchParams({ categoryId, limit: "8" });
  return getProducts(`/products?${params}`);
}
