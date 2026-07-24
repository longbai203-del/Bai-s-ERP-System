export interface approvalItem {
  id: string;
  name: string;
  // 添加更多字段
  createdAt: string;
  updatedAt: string;
}

export interface approvalPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface approvalState {
  items: approvalItem[];
  currentItem: approvalItem | null;
  loading: boolean;
  error: string | null;
  pagination: approvalPagination;
}
