import type { IApiResponse } from "@/shared/types/api";
import type { IProductOverviewResponse } from "../../types/product";
import { PRODUCT_OVERVIEW_ENDPOINT } from "./product.endpoint";

export async function getProductById(
  id: string,
): Promise<IApiResponse<IProductOverviewResponse>> {
  const response = await fetch(PRODUCT_OVERVIEW_ENDPOINT(id));
  const result: IApiResponse<IProductOverviewResponse> = await response.json();

  if (!response.ok || !result.status) {
    throw new Error(result.message || "Unable to fetch product");
  }

  return result;
}
