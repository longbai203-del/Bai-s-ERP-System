export interface reportsItem {
  id: string;
  name: string;
  // 添加更多字段
  createdAt: string;
  updatedAt: string;
}

export interface reportsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface reportsState {
  items: reportsItem[];
  currentItem: reportsItem | null;
  loading: boolean;
  error: string | null;
  pagination: reportsPagination;
}
