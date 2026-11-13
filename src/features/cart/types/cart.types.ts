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

// Full cart item returned by the backend.
export interface ICartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: ICartProduct;
}

// Lightweight item stored in localStorage for guests.
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
