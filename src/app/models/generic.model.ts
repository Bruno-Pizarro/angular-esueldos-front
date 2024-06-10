export interface IListResponse<T> {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
}
