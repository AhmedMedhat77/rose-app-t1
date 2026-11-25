export type TOrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type TPaymentStatus =
  "PENDING" | "PROCESSING" | "SUCCEEDED" | "FAILED" | "REFUNDED" | "CANCELLED";

export type TPaymentMethod = "CASH_ON_DELIVERY" | "CREDIT_CARD";

export interface IOrderProduct {
  id: string;
  title: string;
  cover: string;
  rating: number;
  ratings: number;
}

// WARNING: Swagger does not document order items. This shape follows the
// cartItems / wishlistItems convention; confirm against a real response.
export interface IOrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number | string;
  product: IOrderProduct;
}

export interface IOrder {
  id: string;
  status: TOrderStatus;
  paymentMethod: TPaymentMethod;
  paymentStatus: TPaymentStatus;
  subtotal: number | string;
  discount: number | string;
  shipping: number | string;
  total: number | string;
  createdAt: string;
  orderItems: IOrderItem[];
}
