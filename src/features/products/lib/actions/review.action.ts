"use server";

import { updateTag } from "next/cache";
import { getServerSession } from "next-auth";
import z from "zod";
import { authOptions } from "@/auth";
import { reviewSchema } from "../../schemas/review.schema";
import { createReviewApi } from "../apis/products.api";
import { REVIEWS_TAG } from "../constants/product.constants";
import { ApiError } from "next/dist/server/api-utils";

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

    // Read-your-writes: the user sees their review right away
    updateTag(REVIEWS_TAG(validation.data.productId));

    return {
      success: true,
      message: "REVIEW_CREATED",
    };
  } catch (error) {
    // Only when the backend explicitly rejects a duplicate review
    if (
      error instanceof ApiError &&
      error.statusCode === 409 &&
      error.message === "You have already reviewed this product."
    ) {
      return { success: false, message: "ALREADY_REVIEWED" };
    }

    return { success: false, message: "SOMETHING_WENT_WRONG" };
  }
}
