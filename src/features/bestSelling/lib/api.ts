import { API_URL } from "@/app/shared/constants/config";
import { IBestSelling } from "./types/bestSelling";

export default async function getAllProducts() {
  const response = await fetch(`${API_URL}/products?sortBy=bestSelling`, {
    method: "GET",
    next: {
      revalidate: 300,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data: IBestSelling = await response.json();

  return data.payload;
}
