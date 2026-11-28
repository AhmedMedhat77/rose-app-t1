import { ITimeStamp } from "@/shared/lib/types/time";

export interface IOccasionsItem extends ITimeStamp {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  immutable: boolean;
}
