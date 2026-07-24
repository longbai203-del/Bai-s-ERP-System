export interface dashboardItem {
  id: string;
  name: string;
  // 添加更多字段
  createdAt: string;
  updatedAt: string;
}

export interface dashboardPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface dashboardState {
  items: dashboardItem[];
  currentItem: dashboardItem | null;
  loading: boolean;
  error: string | null;
  pagination: dashboardPagination;
}
