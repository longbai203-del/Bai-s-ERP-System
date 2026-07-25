/**
 * 产品模块Store入口
 * @module modules/products/store/index
 */

import { Module } from 'vuex';
import { ProductState } from './types';
import state from './state';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';

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