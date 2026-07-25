/**
 * 报表模块Store入口
 * @module modules/reports/store/index
 */

import { Module } from 'vuex';
import { ReportState } from './types';
import state from './state';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';

export const reportsStore: Module<ReportState, any> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export * from './types';
export default reportsStore;