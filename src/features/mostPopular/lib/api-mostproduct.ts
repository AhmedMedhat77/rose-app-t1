import { API_URL } from "@/app/shared/constants/config";
import { IMostPopularProduct, Product } from "../types/mostPopular";

export default async function getMostPopularProducts(
  occasionId = "",
): Promise<Product[]> {
  const baseUrl = API_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not defined");
  }

  const params = new URLSearchParams({
    sortBy: "mostPopular",
    occasionId,
    limit: "12",
  });

  const response = await fetch(`${baseUrl}/products?${params.toString()}`, {
    method: "GET",
    next: {
      revalidate: 300,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  const result: IMostPopularProduct = await response.json();

  return result.payload.data;
}
