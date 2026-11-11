import { ITimeStamp } from "@/shared/types/time";

export interface ICategoriesItem extends ITimeStamp {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  immutable: boolean;
  subCategories: [];
  _count: {
    products: number;
  };
}
