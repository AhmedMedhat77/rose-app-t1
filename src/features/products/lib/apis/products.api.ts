import { IApiResponse } from "@/shared/types/api";
import { IProductOverviewResponse } from "../../types/product";
import { PRODUCT_OVERVIEW_ENDPOINT } from "./product.endpoint";

export async function getProductById(
  id: string,
): Promise<IApiResponse<IProductOverviewResponse>> {
  const response = await fetch(PRODUCT_OVERVIEW_ENDPOINT(id));
  return response.json();
}
