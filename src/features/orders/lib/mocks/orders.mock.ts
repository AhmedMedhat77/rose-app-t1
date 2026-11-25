// WARNING: Dev-only fixture for the /orders-preview route. Delete before merge.
import type { IOrder, IOrderItem } from "../types/order.types";

const COVER =
  "https://rose-app.elevate-bootcamp.cloud/storage/entities/product/product-96e2a372da7f-1793728119416.webp";

function mockItems(count: number): IOrderItem[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `item-${count}-${index}`,
    productId: `product-${index}`,
    quantity: 2,
    price: 900,
    product: {
      id: `product-${index}`,
      title: "Moko Chocolate Set | Esperance Rose",
      cover: COVER,
      rating: 5,
      ratings: 4,
    },
  }));
}

export const MOCK_ORDERS: IOrder[] = [
  {
    id: "12345abc-0000-4000-8000-000000000001",
    status: "PROCESSING",
    paymentMethod: "CASH_ON_DELIVERY",
    paymentStatus: "SUCCEEDED",
    subtotal: 1800,
    discount: 0,
    shipping: 20,
    total: 1820,
    createdAt: "2025-07-14T10:05:00.000Z",
    orderItems: mockItems(5),
  },
  {
    id: "67890def-0000-4000-8000-000000000002",
    status: "CANCELLED",
    paymentMethod: "CASH_ON_DELIVERY",
    paymentStatus: "CANCELLED",
    subtotal: 1800,
    discount: 0,
    shipping: 20,
    total: 1820,
    createdAt: "2025-07-13T13:36:00.000Z",
    orderItems: mockItems(4),
  },
  {
    id: "abcde123-0000-4000-8000-000000000003",
    status: "DELIVERED",
    paymentMethod: "CREDIT_CARD",
    paymentStatus: "SUCCEEDED",
    subtotal: 1800,
    discount: 0,
    shipping: 20,
    total: 1820,
    createdAt: "2025-07-13T12:36:00.000Z",
    orderItems: mockItems(2),
  },
];
