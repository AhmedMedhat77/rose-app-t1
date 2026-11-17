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

  for (const [key, value] of Object.entries(apiParams)) {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  }

  const baseUrl = `https://rose-app.elevate-bootcamp.cloud/api/products`;

  const queryString = searchParams.toString();
  const fullUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;

  const response = await fetch(fullUrl, {
    method: "GET",
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch products: ${response.status} ${response.statusText}`,
    );
  }
  const data = await response.json();
  return data;
}
