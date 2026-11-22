export const PRODUCT_QUERY_KEYS = {
  products: () => ["products"],
  product: (id: string) => [...PRODUCT_QUERY_KEYS.products(), id],
};
export const REVIEWS_TAG = (productId: string) => `reviews-${productId}`;

export const REVIEWS_LIMIT = 100;
