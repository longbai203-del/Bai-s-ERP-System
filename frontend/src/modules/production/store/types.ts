export interface productionItem {
  id: string;
  name: string;
  // 添加更多字段
  createdAt: string;
  updatedAt: string;
}

export interface productionPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface productionState {
  items: productionItem[];
  currentItem: productionItem | null;
  loading: boolean;
  error: string | null;
  pagination: productionPagination;
}
