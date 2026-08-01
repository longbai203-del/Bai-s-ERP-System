/**
 * 产品模块Store入口
 * @module modules/products/store/index
 */

import { defineStore } from 'pinia'
import { Module } from 'vuex';
import { ProductState } from './types';
import state from './state';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';

export const useProductStore = defineStore('product', {
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
 * 产品模块Store
 */
export const productStore: Module<ProductState, any> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default productStore;