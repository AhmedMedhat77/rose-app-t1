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
  createdAt: string;
  updatedAt: string;
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

// Types for product overview
export interface IProductOverviewOccasion {
  id: string;
  title: string;
  description: string;
  image: string;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
}

interface IProductOverViewCategory {
  id: string;
  title: string;
  description: string;
  image: string;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
}

interface IProductOverViewSubCategory {
  id: string;
  title: string;
  description: string;
  image: boolean;
  categoryId: string;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
}

interface IUserPreview {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
}
interface IProductOverViewReview {
  id: string;
  userId: string;
  productId: string;
  headline: string;
  content: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  user: IUserPreview;
}

interface ICount {
  reviews: number;
  cartItems: number;
  wishlistItems: number;
}

export interface IProductOverview extends IProduct {
  gallery: string[];
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  category: IProductOverViewCategory;
  subCategory: IProductOverViewSubCategory | null;
  occasions: {
    id: string;
    productId: string;
    occasionId: string;
    createdAt: string;
    occasion: IProductOverviewOccasion;
  }[];
  reviews: IProductOverViewReview[];
  _count: ICount;
}

export interface IProductOverviewResponse {
  product: IProductOverview;
}
