export interface projectItem {
  id: string;
  name: string;
  // 添加更多字段
  createdAt: string;
  updatedAt: string;
}

export interface projectPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface projectState {
  items: projectItem[];
  currentItem: projectItem | null;
  loading: boolean;
  error: string | null;
  pagination: projectPagination;
}
