import "server-only";

import { HEADERS } from "@/app/shared/constants/api.constant";
import { API_URL } from "@/app/shared/constants/config";

import {
  ChangePasswordRequestError,
  type ChangePasswordPayload,
} from "../types/change-password.types";
import { toChangePasswordError } from "../utils/change-password.util";

async function readBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return undefined;

  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

export async function changePassword(
  accessToken: string,
  payload: ChangePasswordPayload,
): Promise<string | undefined> {
  if (!API_URL) {
    throw new ChangePasswordRequestError(500);
  }

  const response = await fetch(`${API_URL}/users/change-password`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...HEADERS.JSON_HEADER,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await readBody(response);
  const body = data as
    | {
        status?: boolean;
        code?: number;
        errors?: { path?: string }[];
        payload?: { token?: unknown };
      }
    | undefined;

  if (!response.ok || body?.status === false) {
    throw toChangePasswordError(response.status, body);
  }

  const token = body?.payload?.token;
  return typeof token === "string" ? token : undefined;
}
