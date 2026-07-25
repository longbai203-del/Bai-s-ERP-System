/**
 * 报表模块Getters
 * @module modules/reports/store/getters
 */

import { ReportState, Report, ReportStatus, ReportType, ReportFormat } from './types';

export const getters = {
  // 基础Getters
  getReports: (state: ReportState): Report[] => state.reports,
  getCurrentReport: (state: ReportState): Report | null => state.currentReport,
  getTemplates: (state: ReportState): ReportTemplate[] => state.templates,
  getSchedules: (state: ReportState): ReportSchedule[] => state.schedules,
  getStats: (state: ReportState): ReportStats | null => state.stats,
  getTotal: (state: ReportState): number => state.total,
  isLoading: (state: ReportState): boolean => state.loading,
  isGenerating: (state: ReportState): boolean => state.generating,
  getError: (state: ReportState): string | null => state.error,
  getCurrentPage: (state: ReportState): number => state.filters.page || 1,
  getPageSize: (state: ReportState): number => state.filters.limit || 20,
  getFilters: (state: ReportState): ReportQueryParams => state.filters,

  // 状态筛选
  getCompletedReports: (state: ReportState): Report[] => {
    return state.reports.filter((r) => r.status === ReportStatus.COMPLETED);
  },

  getPendingReports: (state: ReportState): Report[] => {
    return state.reports.filter((r) => r.status === ReportStatus.PENDING);
  },

  getFailedReports: (state: ReportState): Report[] => {
    return state.reports.filter((r) => r.status === ReportStatus.FAILED);
  },

  // 类型筛选
  getSalesReports: (state: ReportState): Report[] => {
    return state.reports.filter((r) => r.type === ReportType.SALES);
  },

  getFinanceReports: (state: ReportState): Report[] => {
    return state.reports.filter((r) => r.type === ReportType.FINANCE);
  },

  getInventoryReports: (state: ReportState): Report[] => {
    return state.reports.filter((r) => r.type === ReportType.INVENTORY);
  },

  // 统计相关
  getTotalReportRows: (state: ReportState): number => {
    return state.reports.reduce((sum, r) => sum + r.rowCount, 0);
  },

  getTotalReportSize: (state: ReportState): number => {
    return state.reports.reduce((sum, r) => sum + r.fileSize, 0);
  },

  getAverageReportSize: (state: ReportState): number => {
    if (state.reports.length === 0) return 0;
    return getters.getTotalReportSize(state) / state.reports.length;
  },

  // 模板相关
  getDefaultTemplates: (state: ReportState): ReportTemplate[] => {
    return state.templates.filter((t) => t.isDefault);
  },

  getUserTemplates: (state: ReportState): ReportTemplate[] => {
    return state.templates.filter((t) => !t.isDefault);
  },

  // 调度相关
  getActiveSchedules: (state: ReportState): ReportSchedule[] => {
    return state.schedules.filter((s) => s.isActive);
  },

  getInactiveSchedules: (state: ReportState): ReportSchedule[] => {
    return state.schedules.filter((s) => !s.isActive);
  },

  getSchedulesByFrequency: (state: ReportState) => (frequency: ScheduleFrequency): ReportSchedule[] => {
    return state.schedules.filter((s) => s.frequency === frequency);
  },

  // 最近报表
  getRecentReports: (state: ReportState, limit: number = 10): Report[] => {
    return [...state.reports]
      .filter((r) => r.status === ReportStatus.COMPLETED)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },

  // 报表类型选项
  getReportTypeOptions: (): Array<{ label: string; value: ReportType }> => {
    return [
      { label: '销售报表', value: ReportType.SALES },
      { label: '财务报表', value: ReportType.FINANCE },
      { label: '库存报表', value: ReportType.INVENTORY },
      { label: '客户报表', value: ReportType.CUSTOMER },
      { label: 'HR报表', value: ReportType.HR },
      { label: '采购报表', value: ReportType.PURCHASE },
      { label: '生产报表', value: ReportType.PRODUCTION },
      { label: '自定义报表', value: ReportType.CUSTOM },
    ];
  },

  // 报表格式选项
  getReportFormatOptions: (): Array<{ label: string; value: ReportFormat }> => {
    return [
      { label: 'Excel', value: ReportFormat.EXCEL },
      { label: 'PDF', value: ReportFormat.PDF },
      { label: 'CSV', value: ReportFormat.CSV },
      { label: 'HTML', value: ReportFormat.HTML },
      { label: 'JSON', value: ReportFormat.JSON },
    ];
  },

  // 报表状态选项
  getReportStatusOptions: (): Array<{ label: string; value: ReportStatus }> => {
    return [
      { label: '待生成', value: ReportStatus.PENDING },
      { label: '生成中', value: ReportStatus.GENERATING },
      { label: '已完成', value: ReportStatus.COMPLETED },
      { label: '失败', value: ReportStatus.FAILED },
      { label: '已取消', value: ReportStatus.CANCELLED },
    ];
  },
};

export default getters;