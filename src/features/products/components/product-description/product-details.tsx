import type { IProductOverview } from "../../types/product";
import { ProductActions } from "./product-actions";
import { ProductDescription } from "./product-description";
import { ProductPrice } from "./product-price";
import { ProductRating } from "./product-rating";
import { ProductStockBadge } from "./product-stock-badge";

interface ProductDetailsProps {
  product: IProductOverview;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const basePrice = Number(product.price);
  const discount = Number(product.discountValue ?? 0);
  const hasDiscount = product.discountType === "PERCENT" && discount > 0;
  const price = hasDiscount ? basePrice * (1 - discount / 100) : basePrice;

  function handleAddToCart() {}

  return (
    <div className="flex min-h-0 flex-col">
      <div className="border-border-soft border-b pb-5">
        <h1 className="text-text-plain text-3xl font-semibold lg:text-4xl">
          {product.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <ProductPrice
            price={price}
            oldPrice={hasDiscount ? basePrice : null}
          />
          <ProductStockBadge stock={product.stock} />
        </div>
      </div>
      <ProductRating rating={product.rating} count={product.ratings} />
      <ProductDescription description={product.description} />
      <ProductActions
        disabled={product.stock <= 0}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
