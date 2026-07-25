/**
 * 订单模块状态
 * @module modules/orders/store/state
 */

import { OrderState, OrderQueryParams } from './types';

/**
 * 默认查询参数
 */
const defaultFilters: OrderQueryParams = {
  page: 1,
  limit: 20,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

/**
 * 初始状态
 */
export const state: OrderState = {
  orders: [],
  currentOrder: null,
  total: 0,
  loading: false,
  error: null,
  filters: { ...defaultFilters },
};

/**
 * 重置状态
 */
export function resetState(): OrderState {
  return {
    orders: [],
    currentOrder: null,
    total: 0,
    loading: false,
    error: null,
    filters: { ...defaultFilters },
  };
}

export default state;