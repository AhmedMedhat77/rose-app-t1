import { IOccasion } from "../types/mostPopular";
import { IOccasionsResponse } from "../types/occasions";

export default async function getAllOccasions(): Promise<IOccasion[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not defined");
  }

  const response = await fetch(`${baseUrl}api/occasions?page=1&limit=20`, {
    method: "GET",
    next: {
      revalidate: 300,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch occasions: ${response.status}`);
  }

  const result: IOccasionsResponse = await response.json();

  return result.payload.data;
}
