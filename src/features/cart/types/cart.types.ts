export interface ICartProduct {
  id: string;
  title: string;
  description: string;
  rating: number;
  ratings: number;
  stock: number;
  price: string;
  discountType: "PERCENT" | "FIXED" | null;
  discountValue: string | null;
  cover: string;
  gallery: string;
  categoryId: string;
  subCategoryId: string | null;
  immutable: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    title: string;
  };
  subCategory: {
    id: string;
    title: string;
  } | null;
}

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
}

export interface ICartResponse {
  cartItems: ICartItem[];
}

export interface IAddToCartPayload {
  productId: string;
  quantity: number;
}

export interface IUpdateCartItemPayload {
  quantity: number;
}
