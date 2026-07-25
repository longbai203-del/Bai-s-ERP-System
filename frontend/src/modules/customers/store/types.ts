/**
 * 客户模块类型定义
 * @module modules/customers/store/types
 */

/**
 * 客户状态枚举
 */
export enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  LEAD = 'lead',
  VIP = 'vip',
}

/**
 * 客户接口
 */
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  taxId: string;
  industry: string;
  status: CustomerStatus;
  tags: string[];
  totalOrders: number;
  totalSpent: number;
  lastOrderAt: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 创建客户请求
 */
export interface CreateCustomerRequest {
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  taxId?: string;
  industry?: string;
  status?: CustomerStatus;
  tags?: string[];
  notes?: string;
}

/**
 * 更新客户请求
 */
export interface UpdateCustomerRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  taxId?: string;
  industry?: string;
  status?: CustomerStatus;
  tags?: string[];
  notes?: string;
}

/**
 * 客户查询参数
 */
export interface CustomerQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: CustomerStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 客户状态
 */
export interface CustomerState {
  customers: Customer[];
  currentCustomer: Customer | null;
  total: number;
  loading: boolean;
  error: string | null;
  filters: CustomerQueryParams;
}

export default {
  CustomerStatus,
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerQueryParams,
  CustomerState,
};