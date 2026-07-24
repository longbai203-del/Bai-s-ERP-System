export interface posItem {
  id: string;
  name: string;
  // 添加更多字段
  createdAt: string;
  updatedAt: string;
}

export interface posPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface posState {
  items: posItem[];
  currentItem: posItem | null;
  loading: boolean;
  error: string | null;
  pagination: posPagination;
}
