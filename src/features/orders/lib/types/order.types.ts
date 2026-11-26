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

// GET /orders returns only id, title, and cover. GET /orders/{id} also
// returns rating and ratings.
export interface IOrderProduct {
  id: string;
  title: string;
  cover: string;
  rating?: number;
  ratings?: number;
}

// Swagger does not document order items. Shape checked against real
// GET /orders and GET /orders/{id} responses.
export interface IOrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number | string;
  product: IOrderProduct;
}

// Matches the Swagger `Order` schema (GET /api/orders/{id}). Swagger types the
// money fields as numbers; they stay `number | string` like other prices here.
export interface IOrder {
  id: string;
  userId: string;
  addressId: string;
  couponId: string | null;
  status: TOrderStatus;
  paymentMethod: TPaymentMethod;
  paymentStatus: TPaymentStatus;
  stripePaymentIntentId: string | null;
  stripeCheckoutSessionId: string | null;
  subtotal: number | string;
  discount: number | string;
  shipping: number | string;
  total: number | string;
  trackingNumber: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  orderItems: IOrderItem[];
}
