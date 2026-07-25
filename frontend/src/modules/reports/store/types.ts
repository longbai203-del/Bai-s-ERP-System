/**
 * 报表模块类型定义
 * 包含报表、报表模板、报表调度等完整类型
 * @module modules/reports/store/types
 */

/**
 * 报表类型枚举
 */
export enum ReportType {
  /** 销售报表 */
  SALES = 'sales',
  /** 财务报 */

  /** 财务报表 */
  FINANCE = 'finance',
  /** 库存报表 */
  INVENTORY = 'inventory',
  /** 客户报表 */
  CUSTOMER = 'customer',
  /** HR报表 */
  HR = 'hr',
  /** 采购报表 */
  PURCHASE = 'purchase',
  /** 生产报表 */
  PRODUCTION = 'production',
  /** 自定义报表 */
  CUSTOM = 'custom',
}

/**
 * 报表格式枚举
 */
export enum ReportFormat {
  /** Excel */
  EXCEL = 'excel',
  /** PDF */
  PDF = 'pdf',
  /** CSV */
  CSV = 'csv',
  /** HTML */
  HTML = 'html',
  /** JSON */
  JSON = 'json',
}

/**
 * 报表状态枚举
 */
export enum ReportStatus {
  /** 待生成 */
  PENDING = 'pending',
  /** 生成中 */
  GENERATING = 'generating',
  /** 已完成 */
  COMPLETED = 'completed',
  /** 失败 */
  FAILED = 'failed',
  /** 已取消 */
  CANCELLED = 'cancelled',
}

/**
 * 报表调度频率枚举
 */
export enum ScheduleFrequency {
  /** 每日 */
  DAILY = 'daily',
  /** 每周 */
  WEEKLY = 'weekly',
  /** 每月 */
  MONTHLY = 'monthly',
  /** 每季度 */
  QUARTERLY = 'quarterly',
  /** 每年 */
  YEARLY = 'yearly',
}

/**
 * 报表接口
 */
export interface Report {
  id: string;
  name: string;
  type: ReportType;
  format: ReportFormat;
  status: ReportStatus;
  description: string;
  startDate: string;
  endDate: string;
  filters: Record<string, any>;
  columns: string[];
  groupings: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  fileUrl: string;
  fileSize: number;
  rowCount: number;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  userId: string;
  userName?: string;
}

/**
 * 报表模板接口
 */
export interface ReportTemplate {
  id: string;
  name: string;
  type: ReportType;
  format: ReportFormat;
  description: string;
  config: {
    filters: Record<string, any>;
    columns: string[];
    groupings: string[];
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

/**
 * 报表调度接口
 */
export interface ReportSchedule {
  id: string;
  name: string;
  reportId: string;
  reportName: string;
  frequency: ScheduleFrequency;
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  recipients: string[];
  isActive: boolean;
  lastRunAt: string | null;
  nextRunAt: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

/**
 * 创建报表请求
 */
export interface CreateReportRequest {
  name: string;
  type: ReportType;
  format: ReportFormat;
  description?: string;
  startDate: string;
  endDate: string;
  filters?: Record<string, any>;
  columns?: string[];
  groupings?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 报表查询参数
 */
export interface ReportQueryParams {
  page?: number;
  limit?: number;
  type?: ReportType;
  status?: ReportStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 报表统计
 */
export interface ReportStats {
  total: number;
  byType: Record<ReportType, number>;
  byStatus: Record<ReportStatus, number>;
  byFormat: Record<ReportFormat, number>;
  totalRows: number;
  averageRows: number;
  totalSize: number;
  averageSize: number;
  monthlyCount: Array<{ month: string; count: number }>;
}

/**
 * 报表状态接口
 */
export interface ReportState {
  reports: Report[];
  currentReport: Report | null;
  templates: ReportTemplate[];
  schedules: ReportSchedule[];
  stats: ReportStats | null;
  total: number;
  loading: boolean;
  generating: boolean;
  error: string | null;
  filters: ReportQueryParams;
}

export default {
  ReportType,
  ReportFormat,
  ReportStatus,
  ScheduleFrequency,
  Report,
  ReportTemplate,
  ReportSchedule,
  CreateReportRequest,
  ReportQueryParams,
  ReportStats,
  ReportState,
};