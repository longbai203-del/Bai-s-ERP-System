export interface settingsItem {
  id: string;
  name: string;
  // 添加更多字段
  createdAt: string;
  updatedAt: string;
}

export interface settingsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface settingsState {
  items: settingsItem[];
  currentItem: settingsItem | null;
  loading: boolean;
  error: string | null;
  pagination: settingsPagination;
}
