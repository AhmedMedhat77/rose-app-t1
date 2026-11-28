import {
  Banknote,
  CheckCheck,
  CreditCard,
  TriangleAlert,
  Truck,
  type LucideIcon,
} from "lucide-react";

import type { TOrderStatus, TPaymentMethod } from "../types/order.types";

interface IStatusDisplay {
  labelKey: string;
  className: string;
}

interface IIconDisplay extends IStatusDisplay {
  icon: LucideIcon;
}

const IN_PROGRESS: IStatusDisplay = {
  labelKey: "statusInProgress",
  className: "bg-bg-info text-text-inverse",
};

export const ORDER_STATUS_DISPLAY: Record<TOrderStatus, IStatusDisplay> = {
  PENDING: IN_PROGRESS,
  CONFIRMED: IN_PROGRESS,
  PROCESSING: IN_PROGRESS,
  SHIPPED: IN_PROGRESS,
  DELIVERED: {
    labelKey: "statusDone",
    className: "bg-bg-success text-text-inverse",
  },
  CANCELLED: {
    labelKey: "statusCancelled",
    className: "bg-bg-danger text-text-inverse",
  },
  REFUNDED: {
    labelKey: "statusRefunded",
    className: "bg-bg-default text-text-inverse",
  },
};

const DELIVERY_PENDING: IIconDisplay = {
  labelKey: "deliveryPending",
  className: "text-text-warning",
  icon: Truck,
};

const DELIVERY_CANCELLED: IIconDisplay = {
  labelKey: "deliveryCancelled",
  className: "text-text-danger",
  icon: TriangleAlert,
};

export const DELIVERY_STATUS_DISPLAY: Record<TOrderStatus, IIconDisplay> = {
  PENDING: DELIVERY_PENDING,
  CONFIRMED: DELIVERY_PENDING,
  PROCESSING: DELIVERY_PENDING,
  SHIPPED: {
    labelKey: "deliveryShipped",
    className: "text-text-info",
    icon: Truck,
  },
  DELIVERED: {
    labelKey: "deliveryDelivered",
    className: "text-text-success",
    icon: CheckCheck,
  },
  CANCELLED: DELIVERY_CANCELLED,
  REFUNDED: DELIVERY_CANCELLED,
};

export const PAYMENT_METHOD_DISPLAY: Record<
  TPaymentMethod,
  { labelKey: string; icon: LucideIcon }
> = {
  CASH_ON_DELIVERY: { labelKey: "paymentCash", icon: Banknote },
  CREDIT_CARD: { labelKey: "paymentCreditCard", icon: CreditCard },
};

// Figma shows one full row of items; the rest sit behind "Show All".
export const VISIBLE_ITEMS_COUNT = 2;
