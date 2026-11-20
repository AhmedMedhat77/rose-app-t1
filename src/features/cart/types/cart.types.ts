import { IProductOverview } from "@/features/products/types/product";

export type ICartProduct = IProductOverview;

export interface ICartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: ICartProduct;
}

export interface ICartViewItem {
  id: string;
  productId: string;
  title: string;
  cover: string;
  rating: number;
  ratings: number;
  price: number;
  discountType: "PERCENT" | "FIXED" | null;
  discountValue: number | null;
  quantity: number;
  stock: number;
}
export interface IGuestCartItem {
  productId: string;
  quantity: number;
  product: ICartProduct;
}

export interface ICartResponse {
  cartItems: ICartItem[];
}

export interface IAddToCartPayload {
  productId: string;
  quantity: number;
}

export interface IAddToCartInput {
  product: ICartProduct;
  quantity: number;
}
export interface IUpdateCartItemPayload {
  quantity: number;
}
