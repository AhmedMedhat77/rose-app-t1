import { IMostPopularProduct, Product } from "../types/mostPopular";

export default async function getAllProducts(): Promise<Product[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not defined");
  }

  const fetchPage = async (page: number): Promise<IMostPopularProduct> => {
    const response = await fetch(
      `${baseUrl}api/products?sortBy=mostPopular&page=${page}`,
      {
        method: "GET",
        next: {
          revalidate: 300,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    return response.json();
  };

  // Fetch first page
  const firstPage = await fetchPage(1);

  // Read pagination metadata from payload
  const totalPages = firstPage.payload.metadata.totalPages;

  // Fetch remaining pages
  const remainingPages = await Promise.all(
    Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) =>
      fetchPage(index + 2),
    ),
  );

  // Combine products from all pages
  const allProducts = [
    ...firstPage.payload.data,
    ...remainingPages.flatMap((page) => page.payload.data),
  ];

  return allProducts;
}
