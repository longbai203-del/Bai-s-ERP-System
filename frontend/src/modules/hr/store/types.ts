export interface hrItem {
  id: string;
  name: string;
  // 添加更多字段
  createdAt: string;
  updatedAt: string;
}

export interface hrPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface hrState {
  items: hrItem[];
  currentItem: hrItem | null;
  loading: boolean;
  error: string | null;
  pagination: hrPagination;
}
