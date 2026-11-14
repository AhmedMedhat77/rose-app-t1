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
