import type { IMetaData, IPaginatedPayload } from "@/shared/lib/types/api";
import type { ITimeStamp } from "@/shared/lib/types/time";

export type IProduct = {
  id: string;
  title: string;
  description: string;
  rating: number;
  ratings: number;
  stock: number;
  price: string;
  discountType: "PERCENT" | "FIXED" | null;
  discountValue: string | null;
  cover: string;
  categoryId: string;
  subCategoryId: string | null;
  createdAt: string;
  updatedAt: string;
  category: { id: string; title: string };
  immutable: boolean;
  subCategory: { id: string; title: string } | null;
};

export type IProductsMetadata = IMetaData;
export type IProductsPayload = IPaginatedPayload<IProduct>;

export type IProductListParams = Partial<Pick<IMetaData, "page" | "limit">> & {
  category?: string;
  occasion?: string;
  rating?: number;
  minPrice?: number;
  maxPrice?: number;
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
  image: string;
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

export interface IProductReview extends ITimeStamp {
  id: string;
  userId: string;
  productId: string;
  headline: string;
  content: string;
  rating: number;
  user: IUserPreview;
  product: {
    id: string;
    title: string;
  };
}
