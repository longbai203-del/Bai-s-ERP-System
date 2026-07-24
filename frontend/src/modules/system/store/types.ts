export interface systemItem {
  id: string;
  name: string;
  // 添加更多字段
  createdAt: string;
  updatedAt: string;
}

export interface systemPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface systemState {
  items: systemItem[];
  currentItem: systemItem | null;
  loading: boolean;
  error: string | null;
  pagination: systemPagination;
}
