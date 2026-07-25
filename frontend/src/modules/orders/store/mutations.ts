/**
 * 订单模块Mutations
 * @module modules/orders/store/mutations
 */

import { OrderState, Order, OrderQueryParams } from './types';

/**
 * 订单模块Mutations
 */
export const mutations = {
  /**
   * 设置订单列表
   */
  SET_ORDERS(state: OrderState, orders: Order[]): void {
    state.orders = orders;
  },

  /**
   * 设置当前订单
   */
  SET_CURRENT_ORDER(state: OrderState, order: Order | null): void {
    state.currentOrder = order;
  },

  /**
   * 设置订单总数
   */
  SET_TOTAL(state: OrderState, total: number): void {
    state.total = total;
  },

  /**
   * 设置加载状态
   */
  SET_LOADING(state: OrderState, loading: boolean): void {
    state.loading = loading;
  },

  /**
   * 设置错误信息
   */
  SET_ERROR(state: OrderState, error: string | null): void {
    state.error = error;
  },

  /**
   * 设置过滤条件
   */
  SET_FILTERS(state: OrderState, filters: Partial<OrderQueryParams>): void {
    state.filters = { ...state.filters, ...filters };
  },

  /**
   * 重置过滤条件
   */
  RESET_FILTERS(state: OrderState): void {
    state.filters = {
      page: 1,
      limit: 20,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };
  },

  /**
   * 添加订单
   */
  ADD_ORDER(state: OrderState, order: Order): void {
    state.orders.unshift(order);
    state.total += 1;
  },

  /**
   * 更新订单
   */
  UPDATE_ORDER(state: OrderState, order: Order): void {
    const index = state.orders.findIndex((o) => o.id === order.id);
    if (index !== -1) {
      state.orders[index] = order;
    }
    if (state.currentOrder?.id === order.id) {
      state.currentOrder = order;
    }
  },

  /**
   * 删除订单
   */
  DELETE_ORDER(state: OrderState, id: string): void {
    state.orders = state.orders.filter((o) => o.id !== id);
    state.total -= 1;
    if (state.currentOrder?.id === id) {
      state.currentOrder = null;
    }
  },

  /**
   * 更新订单状态
   */
  UPDATE_ORDER_STATUS(state: OrderState, { id, status }: { id: string; status: string }): void {
    const order = state.orders.find((o) => o.id === id);
    if (order) {
      order.status = status as any;
    }
    if (state.currentOrder?.id === id) {
      state.currentOrder!.status = status as any;
    }
  },

  /**
   * 清空状态
   */
  CLEAR_STATE(state: OrderState): void {
    state.orders = [];
    state.currentOrder = null;
    state.total = 0;
    state.error = null;
  },
};

export default mutations;