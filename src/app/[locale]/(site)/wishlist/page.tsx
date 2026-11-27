import { getServerSession } from "next-auth";
import { Suspense } from "react";

import { authOptions } from "@/auth";
import WishlistSide from "@/features/wishlist/components/wishlist-side";
import { WishlistItem } from "@/features/wishlist/lib/types/wishlist.types";
import { getWishlist } from "@/features/wishlist/lib/apis/get-wishlist";

async function WishlistContent() {
  const session = await getServerSession(authOptions);

  let initialItems: WishlistItem[] | undefined;
  if (session?.accessToken) {
    try {
      initialItems = await getWishlist(session.accessToken);
    } catch {}
  }

  return <WishlistSide initialItems={initialItems} />;
}

export default function WishlistPage() {
  return (
    <section className="mx-auto flex w-full flex-col gap-12.5 px-20 py-30">
      <Suspense fallback={null}>
        <WishlistContent />
      </Suspense>
    </section>
  );
}
