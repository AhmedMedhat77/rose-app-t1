export interface ProductCardProduct {
  id: string | number;
  title: string;
  rating: number;
  stock: number;
  price: string | number;
  discountValue: string | number | null;
  cover: string;
  createdAt?: string;
}

export interface ProductProps {
  product: ProductCardProduct;
  variant?: "bestSelling" | "mostPopular" | "displayAllProduct";
}
