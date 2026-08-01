/**
 * 客户模块Store入口
 * @module modules/customers/store/index
 */

import { defineStore } from 'pinia'
import { Module } from 'vuex';
import { CustomerState } from './types';
import state from './state';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';

export const useCustomerStore = defineStore('customer', {
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
 * 客户模块Store
 */
export const customerStore: Module<CustomerState, any> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default customerStore;