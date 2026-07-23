// ===== API 响应类型 =====
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

// ===== 通用类型 =====
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

// ===== 状态类型 =====
export type Status = 'active' | 'inactive' | 'pending' | 'cancelled' | 'completed';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

// ===== 用户类型 =====
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

// ===== 菜单类型 =====
export interface MenuItem {
  path: string;
  name: string;
  icon?: string;
  title: string;
  children?: MenuItem[];
  hidden?: boolean;
  roles?: string[];
  permissions?: string[];
}

// ===== 路由元数据类型 =====
export interface RouteMeta {
  title?: string;
  icon?: string;
  hidden?: boolean;
  roles?: string[];
  permissions?: string[];
  keepAlive?: boolean;
  breadcrumb?: boolean;
  activeMenu?: string;
}

// ===== 表格类型 =====
export interface TableColumn {
  prop?: string;
  label: string;
  width?: string | number;
  minWidth?: string | number;
  fixed?: boolean | 'left' | 'right';
  align?: 'left' | 'center' | 'right';
  sortable?: boolean | 'custom';
  tooltip?: boolean;
  formatter?: (value: any, row: any) => string;
}

// ===== 表单类型 =====
export interface FormField {
  prop: string;
  label: string;
  type: 'input' | 'select' | 'date' | 'number' | 'textarea' | 'checkbox' | 'radio';
  placeholder?: string;
  options?: Option[];
  required?: boolean;
  disabled?: boolean;
  defaultValue?: any;
}

// ===== 通知类型 =====
export interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'success' | 'warning' | 'info' | 'error';
  read: boolean;
  createdAt: string;
}

// ===== 统计类型 =====
export interface Statistics {
  total: number;
  completed: number;
  pending: number;
  cancelled: number;
  [key: string]: any;
}
