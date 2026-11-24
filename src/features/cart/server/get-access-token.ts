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
