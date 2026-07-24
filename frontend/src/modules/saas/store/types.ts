export interface saasItem {
  id: string;
  name: string;
  // 添加更多字段
  createdAt: string;
  updatedAt: string;
}

export interface saasPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface saasState {
  items: saasItem[];
  currentItem: saasItem | null;
  loading: boolean;
  error: string | null;
  pagination: saasPagination;
}
