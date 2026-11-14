import type { IApiResponse } from "@/shared/types/api";
import type { IProduct, IProductOverviewResponse } from "../../types/product";
import { PRODUCT_OVERVIEW_ENDPOINT } from "./product.endpoint";

export async function getProductById(
  id: string,
): Promise<IApiResponse<IProductOverviewResponse>> {
  const response = await fetch(PRODUCT_OVERVIEW_ENDPOINT(id));
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
  const response = await fetch(`/api/products/search?${params}`);
  const result: {
    status?: boolean;
    message?: string;
    payload?: { data?: IProduct[] };
    data?: IProduct[];
  } = await response.json();

  if (!response.ok || result.status === false) {
    throw new Error(result.message || "Unable to fetch related products");
  }

  return result.payload?.data ?? result.data ?? [];
}
