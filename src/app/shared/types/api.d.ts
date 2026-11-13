export interface IErrorResponse {
  status: false;
  code: number;
  message: string;
}

export interface ISuccessResponse<T> {
  status: true;
  code: number;
  message: string;
  payload: T;
}

export interface IMetaData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type IPaginatedResponse<T> = ISuccessResponse<IPaginatedPayload<T>>;

export type IApiResponse<T> = IErrorResponse | ISuccessResponse<T>;
