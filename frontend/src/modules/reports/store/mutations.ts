/**
 * 报表模块Mutations
 * @module modules/reports/store/mutations
 */

import { ReportState, Report, ReportTemplate, ReportSchedule, ReportQueryParams, ReportStatus } from './types';

export const mutations = {
  // 报表相关
  SET_REPORTS(state: ReportState, reports: Report[]): void {
    state.reports = reports;
  },

  SET_CURRENT_REPORT(state: ReportState, report: Report | null): void {
    state.currentReport = report;
  },

  SET_TOTAL(state: ReportState, total: number): void {
    state.total = total;
  },

  SET_STATS(state: ReportState, stats: ReportStats): void {
    state.stats = stats;
  },

  ADD_REPORT(state: ReportState, report: Report): void {
    state.reports.unshift(report);
    state.total += 1;
  },

  UPDATE_REPORT(state: ReportState, report: Report): void {
    const index = state.reports.findIndex((r) => r.id === report.id);
    if (index !== -1) {
      state.reports[index] = report;
    }
    if (state.currentReport?.id === report.id) {
      state.currentReport = report;
    }
  },

  DELETE_REPORT(state: ReportState, id: string): void {
    state.reports = state.reports.filter((r) => r.id !== id);
    state.total -= 1;
    if (state.currentReport?.id === id) {
      state.currentReport = null;
    }
  },

  UPDATE_REPORT_STATUS(state: ReportState, { id, status }: { id: string; status: ReportStatus }): void {
    const report = state.reports.find((r) => r.id === id);
    if (report) {
      report.status = status;
      report.updatedAt = new Date().toISOString();
      if (status === ReportStatus.COMPLETED) {
        report.completedAt = new Date().toISOString();
      }
    }
    if (state.currentReport?.id === id) {
      state.currentReport = report || null;
    }
  },

  UPDATE_REPORT_PROGRESS(state: ReportState, { id, progress }: { id: string; progress: number }): void {
    const report = state.reports.find((r) => r.id === id);
    if (report) {
      (report as any).progress = progress;
    }
  },

  // 模板相关
  SET_TEMPLATES(state: ReportState, templates: ReportTemplate[]): void {
    state.templates = templates;
  },

  ADD_TEMPLATE(state: ReportState, template: ReportTemplate): void {
    state.templates.push(template);
  },

  UPDATE_TEMPLATE(state: ReportState, template: ReportTemplate): void {
    const index = state.templates.findIndex((t) => t.id === template.id);
    if (index !== -1) {
      state.templates[index] = template;
    }
  },

  DELETE_TEMPLATE(state: ReportState, id: string): void {
    state.templates = state.templates.filter((t) => t.id !== id);
  },

  // 调度相关
  SET_SCHEDULES(state: ReportState, schedules: ReportSchedule[]): void {
    state.schedules = schedules;
  },

  ADD_SCHEDULE(state: ReportState, schedule: ReportSchedule): void {
    state.schedules.push(schedule);
  },

  UPDATE_SCHEDULE(state: ReportState, schedule: ReportSchedule): void {
    const index = state.schedules.findIndex((s) => s.id === schedule.id);
    if (index !== -1) {
      state.schedules[index] = schedule;
    }
  },

  DELETE_SCHEDULE(state: ReportState, id: string): void {
    state.schedules = state.schedules.filter((s) => s.id !== id);
  },

  TOGGLE_SCHEDULE(state: ReportState, { id, isActive }: { id: string; isActive: boolean }): void {
    const schedule = state.schedules.find((s) => s.id === id);
    if (schedule) {
      schedule.isActive = isActive;
      schedule.updatedAt = new Date().toISOString();
    }
  },

  // 通用
  SET_LOADING(state: ReportState, loading: boolean): void {
    state.loading = loading;
  },

  SET_GENERATING(state: ReportState, generating: boolean): void {
    state.generating = generating;
  },

  SET_ERROR(state: ReportState, error: string | null): void {
    state.error = error;
  },

  SET_FILTERS(state: ReportState, filters: Partial<ReportQueryParams>): void {
    state.filters = { ...state.filters, ...filters };
  },

  RESET_FILTERS(state: ReportState): void {
    state.filters = { page: 1, limit: 20, sortBy: 'createdAt', sortOrder: 'desc' };
  },

  CLEAR_STATE(state: ReportState): void {
    state.reports = [];
    state.currentReport = null;
    state.templates = [];
    state.schedules = [];
    state.total = 0;
    state.error = null;
  },

  CLEAR_ERROR(state: ReportState): void {
    state.error = null;
  },
};

export default mutations;