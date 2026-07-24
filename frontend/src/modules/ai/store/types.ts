export interface aiItem {
  id: string;
  name: string;
  // 添加更多字段
  createdAt: string;
  updatedAt: string;
}

export interface aiPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface aiState {
  items: aiItem[];
  currentItem: aiItem | null;
  loading: boolean;
  error: string | null;
  pagination: aiPagination;
}
