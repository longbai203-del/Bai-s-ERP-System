/**
 * 客户模块Getters
 * @module modules/customers/store/getters
 */

import { CustomerState } from './types';
import { Customer } from './types';

/**
 * 客户模块Getters
 */
export const getters = {
  /**
   * 获取所有客户
   */
  getCustomers: (state: CustomerState): Customer[] => state.customers,

  /**
   * 获取当前客户
   */
  getCurrentCustomer: (state: CustomerState): Customer | null => state.currentCustomer,

  /**
   * 获取客户总数
   */
  getTotal: (state: CustomerState): number => state.total,

  /**
   * 获取加载状态
   */
  isLoading: (state: CustomerState): boolean => state.loading,

  /**
   * 获取错误信息
   */
  getError: (state: CustomerState): string | null => state.error,

  /**
   * 获取当前页
   */
  getCurrentPage: (state: CustomerState): number => state.filters.page || 1,

  /**
   * 获取每页数量
   */
  getPageSize: (state: CustomerState): number => state.filters.limit || 20,

  /**
   * 获取过滤条件
   */
  getFilters: (state: CustomerState): CustomerQueryParams => state.filters,

  /**
   * 按状态统计客户数
   */
  getCustomerStats: (state: CustomerState): Record<string, number> => {
    const stats: Record<string, number> = {};
    state.customers.forEach((customer) => {
      const status = customer.status;
      stats[status] = (stats[status] || 0) + 1;
    });
    return stats;
  },

  /**
   * 获取活跃客户
   */
  getActiveCustomers: (state: CustomerState): Customer[] => {
    return state.customers.filter((customer) => customer.status === 'active');
  },

  /**
   * 获取VIP客户
   */
  getVipCustomers: (state: CustomerState): Customer[] => {
    return state.customers.filter((customer) => customer.status === 'vip');
  },

  /**
   * 获取客户总消费额
   */
  getTotalSpent: (state: CustomerState): number => {
    return state.customers.reduce((sum, customer) => sum + customer.totalSpent, 0);
  },

  /**
   * 获取客户总订单数
   */
  getTotalOrders: (state: CustomerState): number => {
    return state.customers.reduce((sum, customer) => sum + customer.totalOrders, 0);
  },

  /**
   * 获取最近客户
   */
  getRecentCustomers: (state: CustomerState): Customer[] => {
    return [...state.customers]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  },
};

export default getters;