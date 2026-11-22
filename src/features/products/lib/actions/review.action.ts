"use server";

import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { reviewSchema } from "../../schemas/review.schema";
import { createReviewApi } from "../apis/products.api";
import z from "zod";

const serverSchema = reviewSchema({
  titleRequired: "titleRequired",
  contentRequired: "contentRequired",
  ratingInteger: "ratingInteger",
  ratingMin: "ratingMin",
  ratingMax: "ratingMax",
}).extend({
  productId: z.string().uuid(),
});

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
  const validation = serverSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "INVALID_DATA",
    };
  }

  // Mutation
  try {
    await createReviewApi(validation.data, accessToken);

    return {
      success: true,
      message: "REVIEW_CREATED",
    };
  } catch {
    return {
      success: false,
      message: "SOMETHING_WENT_WRONG",
    };
  }
}
