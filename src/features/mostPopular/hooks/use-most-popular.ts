import { useQuery } from "@tanstack/react-query";
import { Product } from "../types/mostPopular";

interface UseMostPopularProps {
  occasionId: string;
  initialOccasionId: string;
  initialProducts: Product[];
}

export default function useMostPopular({
  occasionId,
  initialOccasionId,
  initialProducts,
}: UseMostPopularProps) {
  return useQuery<Product[]>({
    queryKey: ["mostPopular", occasionId],

    queryFn: async () => {
      const response = await fetch(
        `/api/most-popular?occasionId=${occasionId}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch most popular products");
      }

      return response.json();
    },

    initialData: occasionId === initialOccasionId ? initialProducts : undefined,

    staleTime: 5 * 60 * 1000,
  });
}
