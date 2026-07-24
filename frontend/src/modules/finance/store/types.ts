export interface financeItem {
  id: string;
  name: string;
  // 添加更多字段
  createdAt: string;
  updatedAt: string;
}

export interface financePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface financeState {
  items: financeItem[];
  currentItem: financeItem | null;
  loading: boolean;
  error: string | null;
  pagination: financePagination;
}
