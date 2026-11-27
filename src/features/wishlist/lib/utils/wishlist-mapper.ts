import { IProduct } from "@/features/products/types/product";
import type { WishlistItem, WishlistViewItem } from "../types/wishlist.types";

function toViewItem(id: string, product: IProduct): WishlistViewItem {
  return {
    id,
    productId: product.id,
    title: product.title,
    cover: product.cover,
    rating: product.rating,
    ratings: product.ratings,
    price: Number(product.price),
    discountType: product.discountType,
    discountValue:
      product.discountValue === null ? null : Number(product.discountValue),
    stock: product.stock,
    categoryId: product.category.id,
  };
}

export function mapWishlistItems(items: WishlistItem[]): WishlistViewItem[] {
  return items.map((item) => toViewItem(item.id, item.product));
}

export function mapGuestWishlistProducts(
  products: IProduct[],
): WishlistViewItem[] {
  return products.map((product) => toViewItem(product.id, product));
}
