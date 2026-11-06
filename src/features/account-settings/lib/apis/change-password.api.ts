import {
  toChangePasswordError,
  type ChangePasswordPayload,
} from "../types/change-password.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function changePassword(
  payload: ChangePasswordPayload,
  accessToken: string,
): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/users/change-password`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : undefined;
  } catch {
    data = undefined;
  }

  const body = data as
    | {
        status?: boolean;
        code?: number;
        message?: string;
        errors?: { path?: string }[];
      }
    | undefined;

  if (!response.ok || body?.status === false) {
    throw toChangePasswordError(response.status, body);
  }
}
