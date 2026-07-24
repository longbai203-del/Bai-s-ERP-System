export interface marketingItem {
  id: string;
  name: string;
  // 添加更多字段
  createdAt: string;
  updatedAt: string;
}

export interface marketingPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface marketingState {
  items: marketingItem[];
  currentItem: marketingItem | null;
  loading: boolean;
  error: string | null;
  pagination: marketingPagination;
}
