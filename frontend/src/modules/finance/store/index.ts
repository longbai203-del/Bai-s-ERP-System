/**
 * 财务模块Store入口
 * 统一导出财务模块的所有Store组件
 * @module modules/finance/store/index
 */

import { Module } from 'vuex';
import { FinanceState } from './types';
import state from './state';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';

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