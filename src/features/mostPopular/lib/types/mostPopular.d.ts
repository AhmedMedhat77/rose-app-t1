import type {
  IProduct,
  IProductOverviewOccasion,
} from "@/features/products/types/products";
import type { ReactNode } from "react";

export interface IMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IOccasion {
  id: string;
  title: string;
}

export interface IProductOccasion {
  occasion: IOccasion;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  rating: number;
  ratings: number;
  stock: number;
  price: string;
  discountType: string | null;
  discountValue: number | null;
  cover: string;
  gallery: string;
  occasions: IProductOccasion[];
}

export interface IPayload {
  data: Product[];
  metadata: IMetadata;
}

export interface IMostPopularProduct {
  status: boolean;
  code: number;
  payload: IPayload;
}

export interface MostPopularProps {
  occasions: IOccasion[];
  initialProducts: Product[];
  initialOccasionId: string;
}

export interface MostPopularClientProps {
  occasions: IProductOverviewOccasion[];
  initialProducts: IProduct[];
  initialOccasionId: string;
  sectionTitle: ReactNode;
}
