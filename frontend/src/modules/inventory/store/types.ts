export interface inventoryItem {
  id: string;
  name: string;
  // 添加更多字段
  createdAt: string;
  updatedAt: string;
}

export interface inventoryPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface inventoryState {
  items: inventoryItem[];
  currentItem: inventoryItem | null;
  loading: boolean;
  error: string | null;
  pagination: inventoryPagination;
}
