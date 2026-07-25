/**
 * HR模块Store入口
 * @module modules/hr/store/index
 */

import { Module } from 'vuex';
import { HrState } from './types';
import state from './state';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';

export const hrStore: Module<HrState, any> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export * from './types';
export default hrStore;