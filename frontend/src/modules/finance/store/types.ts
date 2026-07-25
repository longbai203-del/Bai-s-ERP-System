/**
 * 财务模块类型定义
 * 包含财务记录、交易类型、状态等完整类型
 * @module modules/finance/store/types
 */

/**
 * 财务交易类型枚举
 */
export enum FinanceTransactionType {
  /** 收入 */
  INCOME = 'income',
  /** 支出 */
  EXPENSE = 'expense',
  /** 转账 */
  TRANSFER = 'transfer',
  /** 退款 */
  REFUND = 'refund',
  /** 调整 */
  ADJUSTMENT = 'adjustment',
}

/**
 * 财务状态枚举
 */
export enum FinanceStatus {
  /** 待处理 */
  PENDING = 'pending',
  /** 已完成 */
  COMPLETED = 'completed',
  /** 失败 */
  FAILED = 'failed',
  /** 已取消 */
  CANCELLED = 'cancelled',
}

/**
 * 财务统计汇总接口
 */
export interface FinanceSummary {
  /** 总收入 */
  totalIncome: number;
  /** 总支出 */
  totalExpense: number;
  /** 净利润 */
  netProfit: number;
  /** 待处理交易数 */
  pendingCount: number;
  /** 已完成交易数 */
  completedCount: number;
  /** 总交易数 */
  totalCount: number;
  /** 平均交易金额 */
  averageAmount: number;
  /** 最大交易金额 */
  maxAmount: number;
  /** 最小交易金额 */
  minAmount: number;
}

/**
 * 财务记录接口
 */
export interface Finance {
  /** 记录ID */
  id: string;
  /** 交易ID */
  transactionId: string;
  /** 交易类型 */
  type: FinanceTransactionType;
  /** 分类 */
  category: string;
  /** 子分类 */
  subCategory: string;
  /** 描述 */
  description: string;
  /** 金额 */
  amount: number;
  /** 货币代码 */
  currency: string;
  /** 汇率 */
  exchangeRate: number;
  /** 状态 */
  status: FinanceStatus;
  /** 支付方式 */
  paymentMethod: string;
  /** 交易日期 */
  transactionDate: string;
  /** 参考ID */
  referenceId: string;
  /** 参考类型 */
  referenceType: string;
  /** 客户ID */
  customerId: string;
  /** 客户名称 */
  customerName?: string;
  /** 账户ID */
  accountId: string;
  /** 账户名称 */
  accountName?: string;
  /** 标签 */
  tags: string[];
  /** 附件 */
  attachments: string[];
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
  /** 完成时间 */
  completedAt: string | null;
}

/**
 * 创建财务记录请求
 */
export interface CreateFinanceRequest {
  /** 交易类型 */
  type: FinanceTransactionType;
  /** 分类 */
  category: string;
  /** 子分类 */
  subCategory?: string;
  /** 描述 */
  description: string;
  /** 金额 */
  amount: number;
  /** 货币代码 */
  currency?: string;
  /** 汇率 */
  exchangeRate?: number;
  /** 支付方式 */
  paymentMethod?: string;
  /** 交易日期 */
  transactionDate?: string;
  /** 参考ID */
  referenceId?: string;
  /** 参考类型 */
  referenceType?: string;
  /** 客户ID */
  customerId?: string;
  /** 账户ID */
  accountId?: string;
  /** 标签 */
  tags?: string[];
}

/**
 * 更新财务记录请求
 */
export interface UpdateFinanceRequest {
  /** 分类 */
  category?: string;
  /** 子分类 */
  subCategory?: string;
  /** 描述 */
  description?: string;
  /** 状态 */
  status?: FinanceStatus;
  /** 支付方式 */
  paymentMethod?: string;
  /** 标签 */
  tags?: string[];
}

/**
 * 财务查询参数
 */
export interface FinanceQueryParams {
  /** 页码 */
  page?: number;
  /** 每页数量 */
  limit?: number;
  /** 交易类型 */
  type?: FinanceTransactionType;
  /** 状态 */
  status?: FinanceStatus;
  /** 分类 */
  category?: string;
  /** 客户ID */
  customerId?: string;
  /** 开始日期 */
  startDate?: string;
  /** 结束日期 */
  endDate?: string;
  /** 最小金额 */
  minAmount?: number;
  /** 最大金额 */
  maxAmount?: number;
  /** 排序字段 */
  sortBy?: string;
  /** 排序方向 */
  sortOrder?: 'asc' | 'desc';
}

/**
 * 财务报表查询参数
 */
export interface FinanceReportParams {
  /** 报表类型 */
  reportType: 'income_statement' | 'balance_sheet' | 'cash_flow' | 'profit_loss';
  /** 开始日期 */
  startDate: string;
  /** 结束日期 */
  endDate: string;
  /** 货币 */
  currency?: string;
  /** 分组方式 */
  groupBy?: 'day' | 'week' | 'month' | 'quarter' | 'year';
}

/**
 * 财务状态接口
 */
export interface FinanceState {
  /** 财务记录列表 */
  finances: Finance[];
  /** 当前财务记录 */
  currentFinance: Finance | null;
  /** 财务统计 */
  summary: FinanceSummary | null;
  /** 总数 */
  total: number;
  /** 加载状态 */
  loading: boolean;
  /** 错误信息 */
  error: string | null;
  /** 过滤条件 */
  filters: FinanceQueryParams;
}

export default {
  FinanceTransactionType,
  FinanceStatus,
  FinanceSummary,
  Finance,
  CreateFinanceRequest,
  UpdateFinanceRequest,
  FinanceQueryParams,
  FinanceReportParams,
  FinanceState,
};