/**
 * 订单模块Actions
 * @module modules/ai/store/actions
 */

import { Order, CreateOrderRequest, UpdateOrderRequest, UpdateOrderStatusRequest, OrderQueryParams } from './types';
import { orderApi } from '@/api/orders';

type Commit = (type: string, payload?: any) => void;

/**
 * 订单模块Actions
 */
export const actions = {
  /**
   * 获取订单列表
   */
  async fetchOrders({ commit }: { commit: Commit }, params: OrderQueryParams): Promise<void> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await orderApi.getOrders(params);
      commit('SET_ORDERS', response.data.items);
      commit('SET_TOTAL', response.data.total);
    } catch (error: any) {
      commit('SET_ERROR', error.message || '获取订单列表失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  /**
   * 获取订单详情
   */
  async fetchOrderDetail({ commit }: { commit: Commit }, id: string): Promise<Order> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const numericId = Number(id)
      const response = await orderApi.getOrderDetail(numericId);
      commit('SET_CURRENT_ORDER', response.data);
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '获取订单详情失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  /**
   * 创建订单
   */
  async createOrder({ commit }: { commit: Commit }, data: CreateOrderRequest): Promise<Order> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await orderApi.createOrder(data);
      commit('ADD_ORDER', response.data);
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '创建订单失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  /**
   * 更新订单
   */
  async updateOrder({ commit }: { commit: Commit }, { id, data }: { id: string; data: UpdateOrderRequest }): Promise<Order> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const numericId = Number(id)
      const response = await orderApi.updateOrder(numericId, data);
      commit('UPDATE_ORDER', response.data);
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '更新订单失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  /**
   * 更新订单状态
   */
  async updateOrderStatus(
    { commit }: { commit: Commit },
    { id, data }: { id: string; data: UpdateOrderStatusRequest }
  ): Promise<Order> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const numericId = Number(id)
      const response = await orderApi.updateOrderStatus(numericId, data);
      commit('UPDATE_ORDER_STATUS', { id, status: response.data.status });
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '更新订单状态失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  /**
   * 取消订单
   */
  async cancelOrder({ dispatch }: { dispatch: Function }, { id, reason }: { id: string; reason: string }): Promise<Order> {
    return dispatch('updateOrderStatus', {
      id,
      data: { status: 'cancelled', reason },
    });
  },

  /**
   * 删除订单
   */
  async deleteOrder({ commit }: { commit: Commit }, id: string): Promise<void> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      await orderApi.deleteOrder(Number(id));
      commit('DELETE_ORDER', id);
    } catch (error: any) {
      commit('SET_ERROR', error.message || '删除订单失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  /**
   * 设置过滤条件
   */
  setFilters({ commit }: { commit: Commit }, filters: Partial<OrderQueryParams>): void {
    commit('SET_FILTERS', filters);
  },

  /**
   * 重置过滤条件
   */
  resetFilters({ commit }: { commit: Commit }): void {
    commit('RESET_FILTERS');
  },

  /**
   * 清除错误
   */
  clearError({ commit }: { commit: Commit }): void {
    commit('SET_ERROR', null);
  },
};

export default actions;