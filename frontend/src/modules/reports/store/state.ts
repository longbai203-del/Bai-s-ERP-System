/**
 * 报表模块状态
 * @module modules/reports/store/state
 */

import { ReportState, ReportQueryParams, ReportStats } from './types';

const defaultFilters: ReportQueryParams = {
  page: 1,
  limit: 20,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

const defaultStats: ReportStats = {
  total: 0,
  byType: { sales: 0, finance: 0, inventory: 0, customer: 0, hr: 0, purchase: 0, production: 0, custom: 0 },
  byStatus: { pending: 0, generating: 0, completed: 0, failed: 0, cancelled: 0 },
  byFormat: { excel: 0, pdf: 0, csv: 0, html: 0, json: 0 },
  totalRows: 0,
  averageRows: 0,
  totalSize: 0,
  averageSize: 0,
  monthlyCount: [],
};

export const state: ReportState = {
  reports: [],
  currentReport: null,
  templates: [],
  schedules: [],
  stats: { ...defaultStats },
  total: 0,
  loading: false,
  generating: false,
  error: null,
  filters: { ...defaultFilters },
};

export function resetState(): ReportState {
  return {
    reports: [],
    currentReport: null,
    templates: [],
    schedules: [],
    stats: { ...defaultStats },
    total: 0,
    loading: false,
    generating: false,
    error: null,
    filters: { ...defaultFilters },
  };
}

export default state;