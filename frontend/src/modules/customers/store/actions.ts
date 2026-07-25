/**
 * 客户模块Actions
 * @module modules/customers/store/actions
 */

import { Commit } from 'vuex';
import { Customer, CreateCustomerRequest, UpdateCustomerRequest, CustomerQueryParams } from './types';
import { customerApi } from '@/api/customers';

/**
 * 客户模块Actions
 */
export const actions = {
  /**
   * 获取客户列表
   */
  async fetchCustomers({ commit }: { commit: Commit }, params: CustomerQueryParams): Promise<void> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await customerApi.getCustomers(params);
      commit('SET_CUSTOMERS', response.data.items);
      commit('SET_TOTAL', response.data.total);
    } catch (error: any) {
      commit('SET_ERROR', error.message || '获取客户列表失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  /**
   * 获取客户详情
   */
  async fetchCustomerDetail({ commit }: { commit: Commit }, id: string): Promise<Customer> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await customerApi.getCustomerDetail(id);
      commit('SET_CURRENT_CUSTOMER', response.data);
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '获取客户详情失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  /**
   * 创建客户
   */
  async createCustomer({ commit }: { commit: Commit }, data: CreateCustomerRequest): Promise<Customer> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await customerApi.createCustomer(data);
      commit('ADD_CUSTOMER', response.data);
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '创建客户失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  /**
   * 更新客户
   */
  async updateCustomer(
    { commit }: { commit: Commit },
    { id, data }: { id: string; data: UpdateCustomerRequest }
  ): Promise<Customer> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await customerApi.updateCustomer(id, data);
      commit('UPDATE_CUSTOMER', response.data);
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '更新客户失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  /**
   * 删除客户
   */
  async deleteCustomer({ commit }: { commit: Commit }, id: string): Promise<void> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      await customerApi.deleteCustomer(id);
      commit('DELETE_CUSTOMER', id);
    } catch (error: any) {
      commit('SET_ERROR', error.message || '删除客户失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  /**
   * 搜索客户
   */
  async searchCustomers({ commit }: { commit: Commit }, params: { search: string; limit?: number }): Promise<Customer[]> {
    commit('SET_LOADING', true);

    try {
      const response = await customerApi.searchCustomers(params);
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '搜索客户失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  /**
   * 设置过滤条件
   */
  setFilters({ commit }: { commit: Commit }, filters: Partial<CustomerQueryParams>): void {
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