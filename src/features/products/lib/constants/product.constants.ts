export const PRODUCT_QUERY_KEYS = {
  products: () => ["products"],
  product: (id: string) => [...PRODUCT_QUERY_KEYS.products(), id],
};
