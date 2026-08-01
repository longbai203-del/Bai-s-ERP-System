/**
 * 客户模块Store入口
 * @module modules/customers/store/index
 */

import { Module } from 'vuex';
import { CustomerState } from './types';
import state from './state';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';

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