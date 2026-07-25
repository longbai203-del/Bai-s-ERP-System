/**
 * 报表模块Actions
 * @module modules/reports/store/actions
 */

import { Commit } from 'vuex';
import {
  Report,
  ReportTemplate,
  ReportSchedule,
  CreateReportRequest,
  ReportQueryParams,
} from './types';
import { reportsApi } from '@/api/reports';

export const actions = {
  // 报表管理
  async fetchReports({ commit }: { commit: Commit }, params: ReportQueryParams): Promise<void> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const response = await reportsApi.getReports(params);
      commit('SET_REPORTS', response.data.items);
      commit('SET_TOTAL', response.data.total);
      if (response.data.stats) {
        commit('SET_STATS', response.data.stats);
      }
    } catch (error: any) {
      commit('SET_ERROR', error.message || '获取报表列表失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async fetchReportDetail({ commit }: { commit: Commit }, id: string): Promise<Report> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const response = await reportsApi.getReportDetail(id);
      commit('SET_CURRENT_REPORT', response.data);
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '获取报表详情失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async generateReport({ commit }: { commit: Commit }, data: CreateReportRequest): Promise<Report> {
    commit('SET_GENERATING', true);
    commit('SET_ERROR', null);
    try {
      const response = await reportsApi.generateReport(data);
      commit('ADD_REPORT', response.data);
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '生成报表失败');
      throw error;
    } finally {
      commit('SET_GENERATING', false);
    }
  },

  async cancelReportGeneration({ commit }: { commit: Commit }, id: string): Promise<void> {
    commit('SET_GENERATING', true);
    try {
      await reportsApi.cancelReportGeneration(id);
      commit('UPDATE_REPORT_STATUS', { id, status: ReportStatus.CANCELLED });
    } catch (error: any) {
      commit('SET_ERROR', error.message || '取消报表生成失败');
      throw error;
    } finally {
      commit('SET_GENERATING', false);
    }
  },

  async deleteReport({ commit }: { commit: Commit }, id: string): Promise<void> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      await reportsApi.deleteReport(id);
      commit('DELETE_REPORT', id);
    } catch (error: any) {
      commit('SET_ERROR', error.message || '删除报表失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async downloadReport({ commit }: { commit: Commit }, id: string): Promise<Blob> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const response = await reportsApi.downloadReport(id);
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '下载报表失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // 模板管理
  async fetchTemplates({ commit }: { commit: Commit }): Promise<void> {
    try {
      const response = await reportsApi.getTemplates();
      commit('SET_TEMPLATES', response.data);
    } catch (error: any) {
      commit('SET_ERROR', error.message || '获取报表模板失败');
      throw error;
    }
  },

  async createTemplate({ commit }: { commit: Commit }, data: any): Promise<ReportTemplate> {
    try {
      const response = await reportsApi.createTemplate(data);
      commit('ADD_TEMPLATE', response.data);
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '创建报表模板失败');
      throw error;
    }
  },

  // 调度管理
  async fetchSchedules({ commit }: { commit: Commit }): Promise<void> {
    try {
      const response = await reportsApi.getSchedules();
      commit('SET_SCHEDULES', response.data);
    } catch (error: any) {
      commit('SET_ERROR', error.message || '获取报表调度失败');
      throw error;
    }
  },

  async createSchedule({ commit }: { commit: Commit }, data: any): Promise<ReportSchedule> {
    try {
      const response = await reportsApi.createSchedule(data);
      commit('ADD_SCHEDULE', response.data);
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '创建报表调度失败');
      throw error;
    }
  },

  async updateSchedule({ commit }: { commit: Commit }, { id, data }: { id: string; data: any }): Promise<ReportSchedule> {
    try {
      const response = await reportsApi.updateSchedule(id, data);
      commit('UPDATE_SCHEDULE', response.data);
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '更新报表调度失败');
      throw error;
    }
  },

  async deleteSchedule({ commit }: { commit: Commit }, id: string): Promise<void> {
    try {
      await reportsApi.deleteSchedule(id);
      commit('DELETE_SCHEDULE', id);
    } catch (error: any) {
      commit('SET_ERROR', error.message || '删除报表调度失败');
      throw error;
    }
  },

  async toggleSchedule({ commit }: { commit: Commit }, { id, isActive }: { id: string; isActive: boolean }): Promise<void> {
    try {
      await reportsApi.toggleSchedule(id, isActive);
      commit('TOGGLE_SCHEDULE', { id, isActive });
    } catch (error: any) {
      commit('SET_ERROR', error.message || '切换报表调度状态失败');
      throw error;
    }
  },

  // 通用
  setFilters({ commit }: { commit: Commit }, filters: Partial<ReportQueryParams>): void {
    commit('SET_FILTERS', filters);
  },

  resetFilters({ commit }: { commit: Commit }): void {
    commit('RESET_FILTERS');
  },

  clearError({ commit }: { commit: Commit }): void {
    commit('CLEAR_ERROR');
  },

  clearState({ commit }: { commit: Commit }): void {
    commit('CLEAR_STATE');
  },
};

export default actions;