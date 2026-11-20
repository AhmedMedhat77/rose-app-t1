import { getDiscountedPrice } from "@/shared/lib/utils/discounted-price.util";
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
  const price = getDiscountedPrice(product);
  const hasDiscount = price < basePrice;

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
        productId={product.id}
        stock={product.stock}
        disabled={product.stock <= 0}
      />
    </div>
  );
}
