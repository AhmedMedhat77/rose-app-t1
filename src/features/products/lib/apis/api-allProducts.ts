import { GetAllProductsParams, ProductDetails } from "../../types/allProducts";

export interface ProductsMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetAllProductsResponse {
  status: boolean;
  code: number;
  payload: {
    data: ProductDetails[];
    metadata: ProductsMetadata;
  };
}

export async function getAllProducts(
  params: GetAllProductsParams = {},
): Promise<GetAllProductsResponse> {
  const searchParams = new URLSearchParams();

  const apiParams = {
    page: params.page,
    categoryId: params.category,
    occasionId: params.occasion,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    minRating: params.rating,
  };

  Object.entries(apiParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();

  const response = await fetch(
    `/api/products/all-product${queryString ? `?${queryString}` : ""}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}
