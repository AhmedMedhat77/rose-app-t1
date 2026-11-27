import { IProductReview } from "../../types/product";

export function getReviewsSummary(reviews: IProductReview[]) {
  const total = reviews.length;
  const average =
    total === 0
      ? 0
      : reviews.reduce((sum, review) => sum + review.rating, 0) / total;

  return { average, total };
}
