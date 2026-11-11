import "server-only";

import { HEADERS } from "@/app/shared/constants/api.constant";
import { API_URL } from "@/app/shared/constants/config";
import { IApiResponse } from "@/app/shared/types/api";
import {
  ILoginResponse,
  TLoginFormValues,
} from "@/features/auth/types/login.types";
import {
  IConfirmEmailResponse,
  TConfirmEmailFormValues,
} from "@/features/auth/types/confirm-email.types";
import {
  IForgotPasswordResponse,
  TForgotPasswordPayload,
} from "@/features/auth/types/forgot-password.types";
import {
  IResetPasswordResponse,
  TResetPasswordPayload,
} from "@/features/auth/types/reset-password.types";

async function postJson<T>(path: string, body: unknown): Promise<T> {
  if (!API_URL) {
    throw new Error("API_URL is not configured");
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: HEADERS.JSON_HEADER,
  });
  const data: IApiResponse<T> = await response.json();

  if (!data.status) {
    throw new Error(data.message);
  }
  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  return data.payload;
}

export async function loginMutation(payload: TLoginFormValues) {
  return postJson<ILoginResponse>("/auth/login", payload);
}

export async function confirmEmailMutation(payload: TConfirmEmailFormValues) {
  return postJson<IConfirmEmailResponse>(
    "/auth/confirm-email-verification",
    payload,
  );
}

export async function forgotPasswordMutation(payload: TForgotPasswordPayload) {
  return postJson<IForgotPasswordResponse>("/auth/forgot-password", payload);
}

export async function resetPasswordMutation(payload: TResetPasswordPayload) {
  return postJson<IResetPasswordResponse>("/auth/reset-password", payload);
}
