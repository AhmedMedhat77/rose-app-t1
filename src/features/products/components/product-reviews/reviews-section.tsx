import { getReviewsApi } from "../../lib/apis/products.api";
import { getReviewsSummary } from "../../lib/utils/reviews.util";
import ReviewTitle from "./review-title";
import ReviewsList from "./reviews-list";
import ReviewsError from "./reviews-error";

export default async function ReviewsSection({
  productId,
}: {
  productId: string;
}) {
  let reviews;
  try {
    reviews = (await getReviewsApi(productId)).payload.data;
  } catch {
    return <ReviewsError />;
  }

  const { average, total } = getReviewsSummary(reviews);

  return (
    <>
      <div className="col-span-full">
        <ReviewTitle averageRating={average} totalRatings={total} />
      </div>

      <ReviewsList reviews={reviews} />
    </>
  );
}
