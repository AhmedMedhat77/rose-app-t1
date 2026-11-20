import type {
  ICartItem,
  ICartViewItem,
  IGuestCartItem,
} from "../types/cart.types";

// Map authenticated cart
export function mapCartItems(cartItems: ICartItem[]): ICartViewItem[] {
  return cartItems.map((item) => ({
    id: item.id,
    productId: item.productId,
    title: item.product.title,
    cover: item.product.cover,
    rating: item.product.rating,
    ratings: item.product.ratings,
    price: Number(item.product.price),
    discountType: item.product.discountType,
    discountValue:
      item.product.discountValue === null
        ? null
        : Number(item.product.discountValue),
    quantity: item.quantity,
    stock: item.product.stock,
  }));
}

// Map guest cart
export function mapGuestCartItems(
  guestItems: IGuestCartItem[],
): ICartViewItem[] {
  return guestItems.map((item) => ({
    id: item.productId,
    productId: item.productId,
    title: item.product.title,
    cover: item.product.cover,
    rating: item.product.rating,
    ratings: item.product.ratings,
    price: Number(item.product.price),
    discountType: item.product.discountType,
    discountValue:
      item.product.discountValue === null
        ? null
        : Number(item.product.discountValue),
    quantity: item.quantity,
    stock: item.product.stock,
  }));
}
