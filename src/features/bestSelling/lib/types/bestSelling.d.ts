export interface IProduct {
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
  gallery: string;
  categoryId: string;
  subCategoryId: string | null;
  immutable: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  category: object;
  subCategory: object | null;
  occasions: object[];
  _count: {
    [key: string]: number;
  };
}

export interface IBestSelling {
  status: boolean;
  code: number;
  message: string;
  payload: {
    data: IProduct[];
  };
}
