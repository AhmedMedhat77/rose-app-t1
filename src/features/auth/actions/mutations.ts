import "server-only";

import { apiFetch } from "@/shared/lib/apis/fetch.api";
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
import {
  IRegisterResponse,
  ISendEmailVerificationResponse,
  TRegisterFormValues,
  TSendEmailVerificationValues,
} from "@/features/auth/types/register.types";

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await apiFetch<T>(path, {
    method: "POST",
    body,
  });
  return response.payload;
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

export async function registerMutation(payload: TRegisterFormValues) {
  return postJson<IRegisterResponse>("/auth/register", payload);
}

export async function sendEmailVerificationMutation(
  payload: TSendEmailVerificationValues,
) {
  return postJson<ISendEmailVerificationResponse>(
    "/auth/send-email-verification",
    payload,
  );
}
