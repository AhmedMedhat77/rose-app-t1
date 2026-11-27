const NEW_PRODUCT_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

export function isNewProduct(createdAt: string, now = Date.now()) {
  return now - new Date(createdAt).getTime() < NEW_PRODUCT_WINDOW_MS;
}
