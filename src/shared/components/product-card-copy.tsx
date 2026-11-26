import { IProduct } from "@/features/products/types/product";
import { ProductCardCompound } from "./product-card-compound";

export default async function ProductCard({ product }: { product: IProduct }) {
  return (
    <ProductCardCompound>
      <ProductCardCompound.Media product={product}>
        <ProductCardCompound.WishlistCorner productId={product.id} />
        <ProductCardCompound.Badges product={product} />
      </ProductCardCompound.Media>
      <ProductCardCompound.Details product={product} />
    </ProductCardCompound>
  );
}
