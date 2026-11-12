export const CATEGORY_ENDPOINT = "categories" as const;
export const OCCASIONS_ENDPOINT = "occasions" as const;

export const PRODUCT_ENDPOINT = "products" as const;
export const PRODUCT_OVERVIEW_ENDPOINT = (id: string) =>
  `products/${id}` as const;
