// import "server-only";

// import { headers } from "next/headers";
// import { NextRequest } from "next/server";
// import { getToken } from "next-auth/jwt";

// export async function getAccessToken(expectedUserId: string) {
//   const requestHeaders = await headers();

//   const cookieHeader = requestHeaders.get("cookie");

//   if (!cookieHeader) {
//     throw new Error("Session cookie is missing.");
//   }

//   const secret = process.env.NEXT_AUTH_SECRET;

//   if (!secret) {
//     throw new Error("NEXT_AUTH_SECRET is missing.");
//   }

//   const request = new NextRequest("http://localhost", {
//     headers: requestHeaders,
//   });

//   const token = await getToken({
//     req: request,
//     secret,
//   });

//   if (!token) {
//     throw new Error("Could not decode NextAuth JWT.");
//   }

//   const accessToken = token.accessToken;

//   if (typeof accessToken !== "string" || !accessToken) {
//     throw new Error("Access token is missing.");
//   }

//   const tokenUser = token.user as { id?: string } | undefined;
//   const tokenUserId = tokenUser?.id ?? token.sub;

//   if (tokenUserId !== expectedUserId) {
//     throw new Error("Authenticated user ID mismatch.");
//   }

//   return accessToken;
// }

import "server-only";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function getAccessToken() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Unauthorized: User is not authenticated.");
  }

  const accessToken = session.accessToken;

  if (typeof accessToken !== "string" || !accessToken) {
    throw new Error("Access token is missing.");
  }

  return accessToken;
}
