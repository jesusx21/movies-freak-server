export interface QueryOptions {
  limit?: number;
  skip?: number;
  query?: {},
  sort?: {
    field: string;
    order: string;
  }[];
}

export interface QueryResponse<T> {
  items: T[],
  totalItems: number
}
