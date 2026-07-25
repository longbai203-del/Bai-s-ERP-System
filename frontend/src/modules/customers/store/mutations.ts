/**
 * 客户模块Mutations
 * @module modules/customers/store/mutations
 */

import { CustomerState, Customer, CustomerQueryParams } from './types';

/**
 * 客户模块Mutations
 */
export const mutations = {
  /**
   * 设置客户列表
   */
  SET_CUSTOMERS(state: CustomerState, customers: Customer[]): void {
    state.customers = customers;
  },

  /**
   * 设置当前客户
   */
  SET_CURRENT_CUSTOMER(state: CustomerState, customer: Customer | null): void {
    state.currentCustomer = customer;
  },

  /**
   * 设置客户总数
   */
  SET_TOTAL(state: CustomerState, total: number): void {
    state.total = total;
  },

  /**
   * 设置加载状态
   */
  SET_LOADING(state: CustomerState, loading: boolean): void {
    state.loading = loading;
  },

  /**
   * 设置错误信息
   */
  SET_ERROR(state: CustomerState, error: string | null): void {
    state.error = error;
  },

  /**
   * 设置过滤条件
   */
  SET_FILTERS(state: CustomerState, filters: Partial<CustomerQueryParams>): void {
    state.filters = { ...state.filters, ...filters };
  },

  /**
   * 重置过滤条件
   */
  RESET_FILTERS(state: CustomerState): void {
    state.filters = {
      page: 1,
      limit: 20,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };
  },

  /**
   * 添加客户
   */
  ADD_CUSTOMER(state: CustomerState, customer: Customer): void {
    state.customers.unshift(customer);
    state.total += 1;
  },

  /**
   * 更新客户
   */
  UPDATE_CUSTOMER(state: CustomerState, customer: Customer): void {
    const index = state.customers.findIndex((c) => c.id === customer.id);
    if (index !== -1) {
      state.customers[index] = customer;
    }
    if (state.currentCustomer?.id === customer.id) {
      state.currentCustomer = customer;
    }
  },

  /**
   * 删除客户
   */
  DELETE_CUSTOMER(state: CustomerState, id: string): void {
    state.customers = state.customers.filter((c) => c.id !== id);
    state.total -= 1;
    if (state.currentCustomer?.id === id) {
      state.currentCustomer = null;
    }
  },

  /**
   * 清空状态
   */
  CLEAR_STATE(state: CustomerState): void {
    state.customers = [];
    state.currentCustomer = null;
    state.total = 0;
    state.error = null;
  },
};

export default mutations;