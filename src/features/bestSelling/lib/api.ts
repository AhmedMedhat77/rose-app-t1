import { IBestSelling } from "./types/bestSelling";

export default async function getAllProducts() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/products?sortBy=bestSelling`,
    {
      method: "GET",
      next: {
        revalidate: 300,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data: IBestSelling = await response.json();

  return data.payload;
}
