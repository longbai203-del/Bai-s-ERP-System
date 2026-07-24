export interface customersItem {
  id: string;
  name: string;
  // 添加更多字段
  createdAt: string;
  updatedAt: string;
}

export interface customersPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface customersState {
  items: customersItem[];
  currentItem: customersItem | null;
  loading: boolean;
  error: string | null;
  pagination: customersPagination;
}
