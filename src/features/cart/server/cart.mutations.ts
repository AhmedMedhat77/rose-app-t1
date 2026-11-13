import "server-only";

import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

import { HEADERS } from "@/app/shared/constants/api.constant";
import { API_URL } from "@/app/shared/constants/config";

import type { IApiResponse } from "@/app/shared/types/api";
import type { IAddToCartPayload } from "../types/cart.types";

async function getAccessToken(expectedUserId: string) {
  const requestHeaders = await headers();

  const cookieHeader = requestHeaders.get("cookie");

  if (!cookieHeader) {
    throw new Error("Session cookie is missing.");
  }

  const secret = process.env.NEXT_AUTH_SECRET;

  if (!secret) {
    throw new Error("NEXT_AUTH_SECRET is missing.");
  }

  // Create a real NextRequest, similar to proxy.ts.
  const request = new NextRequest("http://localhost", {
    headers: requestHeaders,
  });

  const token = await getToken({
    req: request,
    secret,
  });

  if (!token) {
    throw new Error("Could not decode NextAuth JWT. Check NEXT_AUTH_SECRET.");
  }

  const accessToken = token.accessToken;

  if (typeof accessToken !== "string" || !accessToken) {
    throw new Error("Access token is missing from JWT.");
  }

  const tokenUser = token.user as { id?: string } | undefined;
  const tokenUserId = tokenUser?.id ?? token.sub;

  if (tokenUserId !== expectedUserId) {
    throw new Error("Authenticated user ID mismatch.");
  }

  return accessToken;
}

export async function addCartItemMutation(
  payload: IAddToCartPayload,
  expectedUserId: string,
) {
  if (!API_URL) {
    throw new Error("API_URL is not configured.");
  }

  const accessToken = await getAccessToken(expectedUserId);

  const response = await fetch(`${API_URL}/cart`, {
    method: "POST",
    headers: {
      ...HEADERS.JSON_HEADER,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data: IApiResponse<string> = await response.json();

  if (!response.ok || !data.status) {
    throw new Error(
      data.message || `Cart request failed (${response.status}).`,
    );
  }

  return data.payload;
}
