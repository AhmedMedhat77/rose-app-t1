import ReviewForm from "./review-form";
interface ProductReviewProps {
  productId: string;
  isAuthenticated: boolean;
  reviewsSlot: React.ReactNode;
}

export default function ProductReview({
  productId,
  isAuthenticated,
  reviewsSlot,
}: ProductReviewProps) {
  return (
    <div className="pt-12.5">
      <div className="grid grid-cols-[1fr_auto_1fr]">
        {/* Review List && Title component*/}
        {reviewsSlot}

        {/* Line */}
        <div className="border-border-muted dark:border-border-subtle mx-5 border" />

        {/* Review Form */}
        <ReviewForm productId={productId} isAuthenticated={isAuthenticated} />
      </div>
    </div>
  );
}
