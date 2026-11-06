"server-only";

import { HEADERS } from "@/app/shared/constants/api.constant";
import { BASE_URL } from "@/app/shared/constants/config";
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

// related to register flow
import {
  ISendEmailVerificationResponse,
  TSendEmailVerificationValues,
} from "@/features/auth/types/register.types";
import {
  IConfirmEmailVerificationResponse,
  TConfirmEmailVerificationValues,
} from "@/features/auth/types/register.types";
import {
  IRegisterResponse,
  TRegisterFormValues,
} from "@/features/auth/types/register.types";

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

export async function confirmEmailMutation(payload: TConfirmEmailFormValues) {
  const response = await fetch(`${BASE_URL}/auth/confirm-email-verification`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      ...HEADERS.JSON_HEADER,
    },
  });
  const data: IApiResponse<IConfirmEmailResponse> = await response.json();
  // check if fails
  if (!data.status) {
    throw new Error(data.message);
  }
  return data.payload;
}

export async function forgotPasswordMutation(payload: TForgotPasswordPayload) {
  const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      ...HEADERS.JSON_HEADER,
    },
  });
  const data: IApiResponse<IForgotPasswordResponse> = await response.json();
  // check if fails
  if (!data.status) {
    throw new Error(data.message);
  }
  return data.payload;
}

export async function resetPasswordMutation(payload: TResetPasswordPayload) {
  const response = await fetch(`${BASE_URL}/auth/reset-password`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      ...HEADERS.JSON_HEADER,
    },
  });
  const data: IApiResponse<IResetPasswordResponse> = await response.json();
  // check if fails
  if (!data.status) {
    throw new Error(data.message);
  }
  return data.payload;
}

// related to register flow
export async function sendEmailVerificationMutation(
  payload: TSendEmailVerificationValues,
) {
  const response = await fetch(`${BASE_URL}/auth/send-email-verification`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      ...HEADERS.JSON_HEADER,
    },
  });
  const data: IApiResponse<ISendEmailVerificationResponse> =
    await response.json();
  if (!data.status) {
    throw new Error(data.message);
  }
  return data.payload;
}

export async function confirmEmailVerificationMutation(
  payload: TConfirmEmailVerificationValues,
) {
  const response = await fetch(`${BASE_URL}/auth/confirm-email-verification`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      ...HEADERS.JSON_HEADER,
    },
  });
  const data: IApiResponse<IConfirmEmailVerificationResponse> =
    await response.json();
  if (!data.status) {
    throw new Error(data.message);
  }
  return data.payload;
}

export async function registerMutation(payload: TRegisterFormValues) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      ...HEADERS.JSON_HEADER,
    },
  });
  const data: IApiResponse<IRegisterResponse> = await response.json();
  if (!data.status) {
    throw new Error(data.message);
  }
  return data.payload;
}
