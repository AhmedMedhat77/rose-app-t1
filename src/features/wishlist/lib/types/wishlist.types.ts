import { IProduct } from "@/features/products/types/product";
export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  product: IProduct;
}

export type WishlistActionResult<T> =
  { ok: true; data: T } | { ok: false; status: number };

export interface IClearWishlistSuccessResponse {
  status: boolean;
  code: number;
  message: string;
}
