/**
 * 财务模块Getters
 * 包含所有计算属性和派生状态
 * @module modules/finance/store/getters
 */

import { FinanceState, Finance, FinanceTransactionType, FinanceStatus, FinanceSummary } from './types';

/**
 * 财务模块Getters
 */
export const getters = {
  /**
   * 获取所有财务记录
   */
  getFinances: (state: FinanceState): Finance[] => state.finances,

  /**
   * 获取当前财务记录
   */
  getCurrentFinance: (state: FinanceState): Finance | null => state.currentFinance,

  /**
   * 获取财务统计
   */
  getSummary: (state: FinanceState): FinanceSummary | null => state.summary,

  /**
   * 获取财务记录总数
   */
  getTotal: (state: FinanceState): number => state.total,

  /**
   * 获取加载状态
   */
  isLoading: (state: FinanceState): boolean => state.loading,

  /**
   * 获取错误信息
   */
  getError: (state: FinanceState): string | null => state.error,

  /**
   * 获取当前页码
   */
  getCurrentPage: (state: FinanceState): number => state.filters.page || 1,

  /**
   * 获取每页数量
   */
  getPageSize: (state: FinanceState): number => state.filters.limit || 20,

  /**
   * 获取过滤条件
   */
  getFilters: (state: FinanceState): FinanceQueryParams => state.filters,

  /**
   * 获取收入记录
   */
  getIncomeRecords: (state: FinanceState): Finance[] => {
    return state.finances.filter((f) => f.type === FinanceTransactionType.INCOME);
  },

  /**
   * 获取支出记录
   */
  getExpenseRecords: (state: FinanceState): Finance[] => {
    return state.finances.filter((f) => f.type === FinanceTransactionType.EXPENSE);
  },

  /**
   * 获取待处理记录
   */
  getPendingRecords: (state: FinanceState): Finance[] => {
    return state.finances.filter((f) => f.status === FinanceStatus.PENDING);
  },

  /**
   * 获取已完成记录
   */
  getCompletedRecords: (state: FinanceState): Finance[] => {
    return state.finances.filter((f) => f.status === FinanceStatus.COMPLETED);
  },

  /**
   * 获取总收入
   */
  getTotalIncome: (state: FinanceState): number => {
    return state.finances
      .filter((f) => f.type === FinanceTransactionType.INCOME && f.status === FinanceStatus.COMPLETED)
      .reduce((sum, f) => sum + f.amount, 0);
  },

  /**
   * 获取总支出
   */
  getTotalExpense: (state: FinanceState): number => {
    return state.finances
      .filter((f) => f.type === FinanceTransactionType.EXPENSE && f.status === FinanceStatus.COMPLETED)
      .reduce((sum, f) => sum + f.amount, 0);
  },

  /**
   * 获取净利润
   */
  getNetProfit: (state: FinanceState): number => {
    return getters.getTotalIncome(state) - getters.getTotalExpense(state);
  },

  /**
   * 按分类统计收入
   */
  getIncomeByCategory: (state: FinanceState): Record<string, number> => {
    const result: Record<string, number> = {};
    state.finances
      .filter((f) => f.type === FinanceTransactionType.INCOME && f.status === FinanceStatus.COMPLETED)
      .forEach((f) => {
        result[f.category] = (result[f.category] || 0) + f.amount;
      });
    return result;
  },

  /**
   * 按分类统计支出
   */
  getExpenseByCategory: (state: FinanceState): Record<string, number> => {
    const result: Record<string, number> = {};
    state.finances
      .filter((f) => f.type === FinanceTransactionType.EXPENSE && f.status === FinanceStatus.COMPLETED)
      .forEach((f) => {
        result[f.category] = (result[f.category] || 0) + f.amount;
      });
    return result;
  },

  /**
   * 按月份统计财务数据
   */
  getMonthlyStats: (state: FinanceState): Array<{ month: string; income: number; expense: number; profit: number }> => {
    const map = new Map<string, { income: number; expense: number }>();

    state.finances
      .filter((f) => f.status === FinanceStatus.COMPLETED)
      .forEach((f) => {
        const month = f.createdAt.substring(0, 7);
        if (!map.has(month)) {
          map.set(month, { income: 0, expense: 0 });
        }
        const data = map.get(month)!;
        if (f.type === FinanceTransactionType.INCOME) {
          data.income += f.amount;
        } else if (f.type === FinanceTransactionType.EXPENSE) {
          data.expense += f.amount;
        }
      });

    return Array.from(map.entries())
      .map(([month, data]) => ({
        month,
        income: data.income,
        expense: data.expense,
        profit: data.income - data.expense,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  },

  /**
   * 获取最大交易金额
   */
  getMaxTransaction: (state: FinanceState): Finance | null => {
    if (state.finances.length === 0) return null;
    return state.finances.reduce((max, f) => (f.amount > max.amount ? f : max), state.finances[0]);
  },

  /**
   * 获取最小交易金额
   */
  getMinTransaction: (state: FinanceState): Finance | null => {
    if (state.finances.length === 0) return null;
    return state.finances.reduce((min, f) => (f.amount < min.amount ? f : min), state.finances[0]);
  },

  /**
   * 获取最近交易
   */
  getRecentTransactions: (state: FinanceState, limit: number = 10): Finance[] => {
    return [...state.finances]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },

  /**
   * 获取今日交易
   */
  getTodayTransactions: (state: FinanceState): Finance[] => {
    const today = new Date().toISOString().split('T')[0];
    return state.finances.filter((f) => f.createdAt.startsWith(today));
  },

  /**
   * 获取本周交易
   */
  getWeekTransactions: (state: FinanceState): Finance[] => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const weekStartStr = weekStart.toISOString().split('T')[0];
    return state.finances.filter((f) => f.createdAt >= weekStartStr);
  },

  /**
   * 获取本月交易
   */
  getMonthTransactions: (state: FinanceState): Finance[] => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthStartStr = monthStart.toISOString().split('T')[0];
    return state.finances.filter((f) => f.createdAt >= monthStartStr);
  },
};

export default getters;