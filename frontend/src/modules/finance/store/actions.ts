/**
 * 财务模块Actions
 * 包含所有异步操作和API调用
 * @module modules/finance/store/actions
 */

import { Commit } from 'vuex';
import {
  Finance,
  CreateFinanceRequest,
  UpdateFinanceRequest,
  FinanceQueryParams,
  FinanceReportParams,
  FinanceSummary,
} from './types';
import { financeApi } from '@/api/finance';

/**
 * 财务模块Actions
 */
export const actions = {
  /**
   * 获取财务记录列表
   */
  async fetchFinances({ commit }: { commit: Commit }, params: FinanceQueryParams): Promise<void> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await financeApi.getFinances(params);
      commit('SET_FINANCES', response.data.items);
      commit('SET_TOTAL', response.data.total);
      if (response.data.summary) {
        commit('SET_SUMMARY', response.data.summary);
      }
    } catch (error: any) {
      commit('SET_ERROR', error.message || '获取财务记录列表失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  /**
   * 获取财务记录详情
   */
  async fetchFinanceDetail({ commit }: { commit: Commit }, id: string): Promise<Finance> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await financeApi.getFinanceDetail(id);
      commit('SET_CURRENT_FINANCE', response.data);
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '获取财务记录详情失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  /**
   * 创建财务记录
   */
  async createFinance({ commit }: { commit: Commit }, data: CreateFinanceRequest): Promise<Finance> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await financeApi.createFinance(data);
      commit('ADD_FINANCE', response.data);
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '创建财务记录失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  /**
   * 更新财务记录
   */
  async updateFinance(
    { commit }: { commit: Commit },
    { id, data }: { id: string; data: UpdateFinanceRequest }
  ): Promise<Finance> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await financeApi.updateFinance(id, data);
      commit('UPDATE_FINANCE', response.data);
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '更新财务记录失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  /**
   * 更新财务记录状态
   */
  async updateFinanceStatus(
    { commit }: { commit: Commit },
    { id, status }: { id: string; status: FinanceStatus }
  ): Promise<Finance> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await financeApi.updateFinanceStatus(id, status);
      commit('UPDATE_FINANCE_STATUS', { id, status: response.data.status });
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '更新财务记录状态失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  /**
   * 删除财务记录
   */
  async deleteFinance({ commit }: { commit: Commit }, id: string): Promise<void> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      await financeApi.deleteFinance(id);
      commit('DELETE_FINANCE', id);
    } catch (error: any) {
      commit('SET_ERROR', error.message || '删除财务记录失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  /**
   * 获取财务报表
   */
  async fetchFinanceReport({ commit }: { commit: Commit }, params: FinanceReportParams): Promise<any> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await financeApi.getFinanceReport(params);
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '获取财务报表失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  /**
   * 获取财务统计
   */
  async fetchFinanceSummary({ commit }: { commit: Commit }, params?: { startDate?: string; endDate?: string }): Promise<FinanceSummary> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await financeApi.getFinanceSummary(params);
      commit('SET_SUMMARY', response.data);
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '获取财务统计失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  /**
   * 导出财务数据
   */
  async exportFinances({ commit }: { commit: Commit }, params: { format: 'excel' | 'csv' | 'pdf'; filters?: FinanceQueryParams }): Promise<Blob> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await financeApi.exportFinances(params);
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '导出财务数据失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  /**
   * 设置过滤条件
   */
  setFilters({ commit }: { commit: Commit }, filters: Partial<FinanceQueryParams>): void {
    commit('SET_FILTERS', filters);
  },

  /**
   * 重置过滤条件
   */
  resetFilters({ commit }: { commit: Commit }): void {
    commit('RESET_FILTERS');
  },

  /**
   * 清除错误
   */
  clearError({ commit }: { commit: Commit }): void {
    commit('CLEAR_ERROR');
  },

  /**
   * 清空状态
   */
  clearState({ commit }: { commit: Commit }): void {
    commit('CLEAR_STATE');
  },
};

export default actions;