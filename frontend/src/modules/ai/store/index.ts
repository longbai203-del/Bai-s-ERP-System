/**
 * 订单模块Store入口
 * @module modules/orders/store/index
 */

import { Module } from 'vuex';
import { OrderState } from './types';
import state from './state';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';

/**
 * 订单模块Store
 */
export const orderStore: Module<OrderState, any> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default orderStore;