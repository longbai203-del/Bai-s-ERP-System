/**
 * 采购模块Store入口
 * @module modules/purchase/store/index
 */

import { Module } from 'vuex';
import { PurchaseState } from './types';
import state from './state';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';

export const purchaseStore: Module<PurchaseState, any> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export * from './types';
export default purchaseStore;