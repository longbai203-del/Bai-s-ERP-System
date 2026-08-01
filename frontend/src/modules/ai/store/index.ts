/**
 * AI模块Store入口
 * @module modules/ai/store/index
 */

import { Module } from 'vuex';
import { AIState } from './types';
import state from './state';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';

/**
 * AI模块Store
 */
export const aiStore: Module<AIState, any> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

// 导出 useAiStore 钩子
export const useAiStore = () => {
  const { useStore } = require('vuex');
  return useStore();
};

export default aiStore;
