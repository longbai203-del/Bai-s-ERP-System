export interface purchaseItem {
  id: string;
  name: string;
  // 添加更多字段
  createdAt: string;
  updatedAt: string;
}

export interface purchasePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface purchaseState {
  items: purchaseItem[];
  currentItem: purchaseItem | null;
  loading: boolean;
  error: string | null;
  pagination: purchasePagination;
}
