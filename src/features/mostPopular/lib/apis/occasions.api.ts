import { IPaginatedPayload } from "@/shared/lib/types/api";
import { IOccasion } from "../types/mostPopular";
import { apiFetch, ApiFetchOptions } from "@/shared/lib/apis/fetch.api";

export default async function getAllOccasions(
  query: string,
  options?: ApiFetchOptions,
): Promise<IOccasion[]> {
  const response = await apiFetch<IPaginatedPayload<IOccasion>>(
    `/occasions?${query}`,
    {
      ...options,
    },
  );
  return response.payload.data;
}
