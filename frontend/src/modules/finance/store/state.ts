/**
 * 财务模块状态
 * 包含财务记录、统计、过滤条件等完整状态
 * @module modules/finance/store/state
 */

import { FinanceState, FinanceQueryParams, FinanceSummary } from './types';

/**
 * 默认过滤条件
 */
const defaultFilters: FinanceQueryParams = {
  page: 1,
  limit: 20,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

/**
 * 默认统计信息
 */
const defaultSummary: FinanceSummary = {
  totalIncome: 0,
  totalExpense: 0,
  netProfit: 0,
  pendingCount: 0,
  completedCount: 0,
  totalCount: 0,
  averageAmount: 0,
  maxAmount: 0,
  minAmount: 0,
};

/**
 * 初始状态
 */
export const state: FinanceState = {
  finances: [],
  currentFinance: null,
  summary: { ...defaultSummary },
  total: 0,
  loading: false,
  error: null,
  filters: { ...defaultFilters },
};

/**
 * 重置状态
 */
export function resetState(): FinanceState {
  return {
    finances: [],
    currentFinance: null,
    summary: { ...defaultSummary },
    total: 0,
    loading: false,
    error: null,
    filters: { ...defaultFilters },
  };
}

/**
 * 清除当前财务记录
 */
export function clearCurrentFinance(state: FinanceState): void {
  state.currentFinance = null;
}

/**
 * 清除错误信息
 */
export function clearError(state: FinanceState): void {
  state.error = null;
}

export default state;