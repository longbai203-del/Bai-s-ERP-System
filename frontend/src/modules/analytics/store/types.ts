export interface analyticsItem {
  id: string;
  name: string;
  // 添加更多字段
  createdAt: string;
  updatedAt: string;
}

export interface analyticsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface analyticsState {
  items: analyticsItem[];
  currentItem: analyticsItem | null;
  loading: boolean;
  error: string | null;
  pagination: analyticsPagination;
}
