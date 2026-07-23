// API 响应类型
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
  timestamp: string;
}

export interface PageResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PageParams {
  page?: number;
  limit?: number;
  keyword?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

// 通用类型
export interface Option {
  label: string;
  value: any;
  disabled?: boolean;
}

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  disabled?: boolean;
  [key: string]: any;
}

// 状态类型
export type Status = 'active' | 'inactive' | 'pending' | 'cancelled' | 'completed';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

// 用户类型
export interface User {
  id: string;
  username: string;
  realName: string;
  email: string;
  phone: string;
  avatar: string;
  roles: string[];
  permissions: string[];
  createdAt: string;
}

// 菜单类型
export interface MenuItem {
  path: string;
  name: string;
  icon?: string;
  title: string;
  children?: MenuItem[];
  hidden?: boolean;
  roles?: string[];
}
