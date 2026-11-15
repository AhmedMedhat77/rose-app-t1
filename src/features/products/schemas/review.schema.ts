import { z } from "zod";

export const reviewSchema = z.object({
  productId: z.string().uuid(),

  headline: z.string().trim().min(1, "Title is required"),

  content: z.string().trim().min(1, "Review is required"),

  rating: z
    .number()
    .int("Rating must be a whole number")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
});

export type IReviewFormValues = z.infer<typeof reviewSchema>;
