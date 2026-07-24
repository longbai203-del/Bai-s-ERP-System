export interface productsItem {
  id: string;
  name: string;
  // 添加更多字段
  createdAt: string;
  updatedAt: string;
}

export interface productsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface productsState {
  items: productsItem[];
  currentItem: productsItem | null;
  loading: boolean;
  error: string | null;
  pagination: productsPagination;
}
