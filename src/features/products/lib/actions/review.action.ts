"use server";

import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { reviewSchema } from "../../schemas/review.schema";
import { createReviewApi } from "../apis/products.api";

export async function createReviewAction(values: unknown) {
  // Session
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  if (!accessToken) {
    return {
      success: false,
      message: "UNAUTHORIZED",
    };
  }

  // Validation
  const validation = reviewSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "INVALID_DATA",
    };
  }

  // Mutation
  try {
    const result = await createReviewApi(validation.data, accessToken);

    return {
      success: true,
      message: result.message,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "SOMETHING_WENT_WRONG",
    };
  }
}
