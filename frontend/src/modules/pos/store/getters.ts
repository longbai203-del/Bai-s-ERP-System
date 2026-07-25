/**
 * 订单模块Getters
 * @module modules/orders/store/getters
 */

import { OrderState } from './types';
import { Order } from './types';

/**
 * 订单模块Getters
 */
export const getters = {
  /**
   * 获取所有订单
   */
  getOrders: (state: OrderState): Order[] => state.orders,

  /**
   * 获取当前订单
   */
  getCurrentOrder: (state: OrderState): Order | null => state.currentOrder,

  /**
   * 获取订单总数
   */
  getTotal: (state: OrderState): number => state.total,

  /**
   * 获取加载状态
   */
  isLoading: (state: OrderState): boolean => state.loading,

  /**
   * 获取错误信息
   */
  getError: (state: OrderState): string | null => state.error,

  /**
   * 获取当前页
   */
  getCurrentPage: (state: OrderState): number => state.filters.page || 1,

  /**
   * 获取每页数量
   */
  getPageSize: (state: OrderState): number => state.filters.limit || 20,

  /**
   * 获取过滤条件
   */
  getFilters: (state: OrderState): OrderQueryParams => state.filters,

  /**
   * 按状态统计订单数
   */
  getOrderStats: (state: OrderState): Record<string, number> => {
    const stats: Record<string, number> = {};
    state.orders.forEach((order) => {
      const status = order.status;
      stats[status] = (stats[status] || 0) + 1;
    });
    return stats;
  },

  /**
   * 获取订单总额
   */
  getTotalAmount: (state: OrderState): number => {
    return state.orders.reduce((sum, order) => sum + order.grandTotal, 0);
  },

  /**
   * 获取待处理订单
   */
  getPendingOrders: (state: OrderState): Order[] => {
    return state.orders.filter((order) => order.status === 'pending');
  },

  /**
   * 获取进行中订单
   */
  getActiveOrders: (state: OrderState): Order[] => {
    return state.orders.filter(
      (order) => order.status === 'confirmed' || order.status === 'processing' || order.status === 'shipped'
    );
  },

  /**
   * 获取已完成订单
   */
  getCompletedOrders: (state: OrderState): Order[] => {
    return state.orders.filter((order) => order.status === 'delivered');
  },

  /**
   * 获取已取消订单
   */
  getCancelledOrders: (state: OrderState): Order[] => {
    return state.orders.filter((order) => order.status === 'cancelled');
  },

  /**
   * 获取最近订单（按时间倒序）
   */
  getRecentOrders: (state: OrderState): Order[] => {
    return [...state.orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  },
};

export default getters;