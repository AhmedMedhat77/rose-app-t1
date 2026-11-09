import { IApiResponse, IProduct, IProductsPayload } from "../types/product";

const BASE_URL = "https://rose-app.elevate-bootcamp.cloud";

export async function getProducts(): Promise<IProduct[]> {
  const res = await fetch(`${BASE_URL}/api/products?limit=100`);
  if (!res.ok) throw new Error(`Failed to fetch products (${res.status})`);

  const payload: IApiResponse<IProductsPayload> = await res.json();
  return payload.payload.data;
}
