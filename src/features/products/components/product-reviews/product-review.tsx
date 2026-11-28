"use client";

import type { ReactNode } from "react";

import { useSession } from "next-auth/react";

import ReviewForm from "./review-form";

interface ProductReviewProps {
  productId: string;
  reviewsSlot: ReactNode;
}

export default function ProductReview({
  productId,
  reviewsSlot,
}: ProductReviewProps) {
  // Hooks
  const { data: session } = useSession();

  return (
    <div className="pt-12.5">
      <div className="grid grid-cols-[1fr_auto_1fr]">
        {/* Review List && Title component*/}
        {reviewsSlot}

        {/* Line */}
        <div className="border-border-muted dark:border-border-subtle mx-5 border" />

        {/* Review Form */}
        <ReviewForm
          productId={productId}
          isAuthenticated={!!session?.accessToken}
        />
      </div>
    </div>
  );
}
