"server-only";

import { HEADERS } from "@/app/shared/constants/api.constant";
import { BASE_URL } from "@/app/shared/constants/config";
import { IApiResponse } from "@/app/shared/types/api";
import { ILoginResponse, TLoginFormValues } from "@/features/auth/types/login";

export async function loginMutation(payload: TLoginFormValues) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      ...HEADERS.JSON_HEADER,
    },
  });
  const data: IApiResponse<ILoginResponse> = await response.json();
  // check if fails
  if (!data.status) {
    throw new Error(data.message);
  }
  return data.payload;
}
