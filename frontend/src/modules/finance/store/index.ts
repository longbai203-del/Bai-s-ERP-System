/**
 * 财务模块Store入口
 * 统一导出财务模块的所有Store组件
 * @module modules/finance/store/index
 */

import { defineStore } from 'pinia'
import { Module } from 'vuex';
import { FinanceState } from './types';
import state from './state';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';

export const useFinanceStore = defineStore('finance', {
  state: () => ({
    list: [] as any[],
    detail: null as any,
    loading: false,
    error: null as string | null,
    filters: {}
  }),
  actions: {
    async fetchList() {
      return this.list
    },
    async fetchDetail() {
      return this.detail
    },
    async create() {
      return this.detail
    },
    async update() {
      return this.detail
    },
    async remove() {
      return true
    }
  }
})

/**
 * 财务模块Store
 * 包含财务记录管理、统计、报表等功能
 */
export const financeStore: Module<FinanceState, any> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

/**
 * 导出所有类型
 */
export * from './types';

/**
 * 默认导出
 */
export default financeStore;