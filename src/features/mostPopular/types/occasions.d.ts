export interface IOccasion {
  id: string;
  title: string;
  description: string;
  image: string | null;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IOccasionsResponse {
  status: boolean;
  code: number;
  payload: {
    data: IOccasion[];
    metadata: IMetadata;
  };
}
