import ReviewForm from "./review-form";
import ReviewTitle from "./review-title";
import ReviewsList from "./reviews-list";

export default function ProductReview() {
  return (
    <div className="py-12.5">
      <ReviewTitle />
      <div className="grid grid-cols-12">
        <div className="col-span-7">
          <ReviewsList />
        </div>
        <div className="col-span-5">
          <ReviewForm />
        </div>
      </div>
    </div>
  );
}
