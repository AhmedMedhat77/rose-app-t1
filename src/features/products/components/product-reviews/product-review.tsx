import ReviewForm from "./review-form";
import ReviewTitle from "./review-title";
import ReviewsList from "./reviews-list";
interface ProductReviewProps {
  productId: string;
  rating: number;
  ratings: number;
  isAuthenticated: boolean;
}

export default function ProductReview({
  productId,
  ratings,
  rating,
  isAuthenticated,
}: ProductReviewProps) {
  return (
    <div className="pt-12.5">
      {/*Title component */}
      <ReviewTitle averageRating={rating} totalRatings={ratings} />
      <div className="grid grid-cols-[1fr_auto_1fr]">
        {/* Review List */}
        <ReviewsList productId={productId} />

        {/* Line */}
        <div className="border-border-muted dark:border-border-subtle mx-5 border" />

        {/* Review Form */}
        <ReviewForm productId={productId} isAuthenticated={isAuthenticated} />
      </div>
    </div>
  );
}
