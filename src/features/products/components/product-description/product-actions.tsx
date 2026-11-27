import AddToCartButton from "@/shared/components/add-to-cart-button";
import { WishlistButton } from "@/features/wishlist/components/wishlist-button";

interface ProductActionsProps {
  productId: string;
  stock: number;
  quantity?: number;
  disabled?: boolean;
}

export function ProductActions({
  productId,
  stock,
  quantity = 1,
  disabled = false,
}: ProductActionsProps) {
  return (
    <div className="mt-auto flex gap-3 pt-3">
      <WishlistButton
        productId={productId}
        className="h-11.5 w-12.25 rounded-lg text-zinc-900 hover:px-0"
        showLabel={false}
      />

      <AddToCartButton
        productId={productId}
        stock={stock}
        quantity={quantity}
        disabled={disabled}
        variant="full"
        className="h-11.5 w-full"
      />
    </div>
  );
}
