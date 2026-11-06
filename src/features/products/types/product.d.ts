export type IProduct = {
  id: string;
  title: string;
  description: string;
  rating: number;
  ratings: number;
  stock: number;
  price: string;
  discountType: "PERCENT" | null;
  discountValue: string | null;
  cover: string;
  categoryId: string;
  subCategoryId: string | null;
  category: { id: string; title: string };
  subCategory: { id: string; title: string } | null;
};

export type IProductsMetadata = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type IProductsPayload = {
  data: Product[];
  metadata: ProductsMetadata;
};

type IApiResponse<T> = {
  status: boolean;
  code: number;
  message?: string;
  payload: T;
};
