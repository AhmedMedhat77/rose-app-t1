import { ITimeStamp } from "@/shared/types/time";

export interface IOccasionsItem extends ITimeStamp {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  immutable: boolean;
}
