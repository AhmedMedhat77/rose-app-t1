import { Star } from "lucide-react";
const STAR_COUNT = 5;
const MAX_RATING = 5;
const ROUND_DOWN_MAX_FRACTION = 0.25;
const HALF_STAR_MAX_FRACTION = 0.75;

export type StarFill = 0 | 0.5 | 1;

export function getRatingStarFills(rating: number): StarFill[] {
  const emptyStars = Array.from({ length: STAR_COUNT }, () => 0 as StarFill);
  if (!Number.isFinite(rating)) return emptyStars;

  const clampedRating = Math.min(MAX_RATING, Math.max(0, rating));
  const wholeStars = Math.floor(clampedRating);
  const fraction = Number((clampedRating - wholeStars).toFixed(2));

  const displayedRating =
    fraction <= ROUND_DOWN_MAX_FRACTION
      ? wholeStars
      : fraction <= HALF_STAR_MAX_FRACTION
        ? wholeStars + 0.5
        : Math.min(wholeStars + 1, MAX_RATING);

  const fullStarCount = Math.floor(displayedRating);
  const hasHalfStar = displayedRating - fullStarCount === 0.5;

  return Array.from({ length: STAR_COUNT }, (_, index) => {
    if (index < fullStarCount) return 1;
    if (index === fullStarCount && hasHalfStar) return 0.5;
    return 0;
  });
}

export function RatingStars({ rating }: { rating: number }) {
  const starFills = getRatingStarFills(rating);

  return starFills.map((fill, index) => (
    <span key={index} className="relative inline-flex size-4">
      <Star size={16} strokeWidth={1.5} className="text-text-rating" />
      <span
        className="absolute inset-y-0 inset-s-0 overflow-hidden"
        style={{ width: `${fill * 100}%` }}
      >
        <Star
          size={16}
          strokeWidth={1.5}
          fill="currentColor"
          className="text-text-rating"
        />
      </span>
    </span>
  ));
}
