/**
 * 采购模块Store入口
 * @module modules/purchase/store/index
 */

import { defineStore } from 'pinia'
import { Module } from 'vuex';
import { PurchaseState } from './types';
import state from './state';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';

export const usePurchaseStore = defineStore('purchase', {
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

export const purchaseStore: Module<PurchaseState, any> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export * from './types';
export default purchaseStore;