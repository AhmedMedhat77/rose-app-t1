export interface Product {
  id: string | number;
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
  categoryId: string | number;
  subCategoryId: string | number | null;
}

export interface ProductsMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AllProductsResponse {
  status: boolean;
  code: number;
  message: string;
  payload: {
    data: Product[];
    metadata: ProductsMetadata;
  };
}

export interface GetAllProductsParams {
  category?: string;
  occasion?: string;
  rating?: number;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

/////////////////////////////////////////////////////

export interface ProductDetails {
  id: string;
  title: string;
  description: string;
  rating: number;
  ratings: number;
  stock: number;
  price: string;
  discountType: string;
  discountValue: string;
  cover: string;
  gallery: string;
  categoryId: string;
  subCategoryId: string | null;
  immutable: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  category: Category;
  subCategory: Category | null;
  occasions: Occasion[];
  reviews: Review[];
  _count: ProductCount;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  image: string;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  headline: string;
  content: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  user: ReviewUser;
}

export interface ReviewUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface ProductCount {
  reviews: number;
  cartItems: number;
  wishlistItems: number;
}
