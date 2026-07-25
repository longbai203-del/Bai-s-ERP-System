/**
 * 客户模块状态
 * @module modules/customers/store/state
 */

import { CustomerState, CustomerQueryParams } from './types';

/**
 * 默认查询参数
 */
const defaultFilters: CustomerQueryParams = {
  page: 1,
  limit: 20,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

/**
 * 初始状态
 */
export const state: CustomerState = {
  customers: [],
  currentCustomer: null,
  total: 0,
  loading: false,
  error: null,
  filters: { ...defaultFilters },
};

/**
 * 重置状态
 */
export function resetState(): CustomerState {
  return {
    customers: [],
    currentCustomer: null,
    total: 0,
    loading: false,
    error: null,
    filters: { ...defaultFilters },
  };
}

export default state;