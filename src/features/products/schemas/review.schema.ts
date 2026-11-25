import { z } from "zod";

interface ReviewSchemaMessages {
  titleRequired: string;
  contentRequired: string;
  ratingInteger: string;
  ratingMin: string;
  ratingMax: string;
}

export const reviewSchema = (messages: ReviewSchemaMessages) =>
  z.object({
    headline: z.string().trim().min(1, messages.titleRequired),

    content: z.string().trim().min(1, messages.contentRequired),

    rating: z
      .number()
      .int(messages.ratingInteger)
      .min(1, messages.ratingMin)
      .max(5, messages.ratingMax),
  });

export type IReviewFormValues = z.infer<ReturnType<typeof reviewSchema>>;
