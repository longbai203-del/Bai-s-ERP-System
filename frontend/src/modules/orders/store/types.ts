export interface ordersItem {
  id: string;
  name: string;
  // 添加更多字段
  createdAt: string;
  updatedAt: string;
}

export interface ordersPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ordersState {
  items: ordersItem[];
  currentItem: ordersItem | null;
  loading: boolean;
  error: string | null;
  pagination: ordersPagination;
}
