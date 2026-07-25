/**
 * 财务模块Mutations
 * 包含所有同步状态变更操作
 * @module modules/finance/store/mutations
 */

import { FinanceState, Finance, FinanceQueryParams, FinanceSummary } from './types';

/**
 * 财务模块Mutations
 */
export const mutations = {
  /**
   * 设置财务记录列表
   */
  SET_FINANCES(state: FinanceState, finances: Finance[]): void {
    state.finances = finances;
  },

  /**
   * 设置当前财务记录
   */
  SET_CURRENT_FINANCE(state: FinanceState, finance: Finance | null): void {
    state.currentFinance = finance;
  },

  /**
   * 设置财务统计
   */
  SET_SUMMARY(state: FinanceState, summary: FinanceSummary): void {
    state.summary = summary;
  },

  /**
   * 设置财务记录总数
   */
  SET_TOTAL(state: FinanceState, total: number): void {
    state.total = total;
  },

  /**
   * 设置加载状态
   */
  SET_LOADING(state: FinanceState, loading: boolean): void {
    state.loading = loading;
  },

  /**
   * 设置错误信息
   */
  SET_ERROR(state: FinanceState, error: string | null): void {
    state.error = error;
  },

  /**
   * 设置过滤条件
   */
  SET_FILTERS(state: FinanceState, filters: Partial<FinanceQueryParams>): void {
    state.filters = { ...state.filters, ...filters };
  },

  /**
   * 重置过滤条件
   */
  RESET_FILTERS(state: FinanceState): void {
    state.filters = {
      page: 1,
      limit: 20,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };
  },

  /**
   * 添加财务记录
   */
  ADD_FINANCE(state: FinanceState, finance: Finance): void {
    state.finances.unshift(finance);
    state.total += 1;
    // 更新统计
    if (state.summary) {
      state.summary.totalCount += 1;
      if (finance.status === FinanceStatus.PENDING) {
        state.summary.pendingCount += 1;
      } else if (finance.status === FinanceStatus.COMPLETED) {
        state.summary.completedCount += 1;
        if (finance.type === FinanceTransactionType.INCOME) {
          state.summary.totalIncome += finance.amount;
        } else if (finance.type === FinanceTransactionType.EXPENSE) {
          state.summary.totalExpense += finance.amount;
        }
        state.summary.netProfit = state.summary.totalIncome - state.summary.totalExpense;
      }
    }
  },

  /**
   * 更新财务记录
   */
  UPDATE_FINANCE(state: FinanceState, finance: Finance): void {
    const index = state.finances.findIndex((f) => f.id === finance.id);
    if (index !== -1) {
      state.finances[index] = finance;
    }
    if (state.currentFinance?.id === finance.id) {
      state.currentFinance = finance;
    }
  },

  /**
   * 删除财务记录
   */
  DELETE_FINANCE(state: FinanceState, id: string): void {
    const finance = state.finances.find((f) => f.id === id);
    state.finances = state.finances.filter((f) => f.id !== id);
    state.total -= 1;
    if (state.currentFinance?.id === id) {
      state.currentFinance = null;
    }
    // 更新统计
    if (state.summary && finance) {
      state.summary.totalCount -= 1;
      if (finance.status === FinanceStatus.PENDING) {
        state.summary.pendingCount -= 1;
      } else if (finance.status === FinanceStatus.COMPLETED) {
        state.summary.completedCount -= 1;
        if (finance.type === FinanceTransactionType.INCOME) {
          state.summary.totalIncome -= finance.amount;
        } else if (finance.type === FinanceTransactionType.EXPENSE) {
          state.summary.totalExpense -= finance.amount;
        }
        state.summary.netProfit = state.summary.totalIncome - state.summary.totalExpense;
      }
    }
  },

  /**
   * 更新财务状态
   */
  UPDATE_FINANCE_STATUS(state: FinanceState, { id, status }: { id: string; status: FinanceStatus }): void {
    const finance = state.finances.find((f) => f.id === id);
    if (finance) {
      const oldStatus = finance.status;
      finance.status = status;
      finance.updatedAt = new Date().toISOString();
      if (status === FinanceStatus.COMPLETED) {
        finance.completedAt = new Date().toISOString();
      }

      // 更新统计
      if (state.summary) {
        if (oldStatus === FinanceStatus.PENDING && status !== FinanceStatus.PENDING) {
          state.summary.pendingCount -= 1;
        }
        if (status === FinanceStatus.COMPLETED && oldStatus !== FinanceStatus.COMPLETED) {
          state.summary.completedCount += 1;
          if (finance.type === FinanceTransactionType.INCOME) {
            state.summary.totalIncome += finance.amount;
          } else if (finance.type === FinanceTransactionType.EXPENSE) {
            state.summary.totalExpense += finance.amount;
          }
          state.summary.netProfit = state.summary.totalIncome - state.summary.totalExpense;
        }
      }
    }
    if (state.currentFinance?.id === id) {
      state.currentFinance = finance || null;
    }
  },

  /**
   * 清空状态
   */
  CLEAR_STATE(state: FinanceState): void {
    state.finances = [];
    state.currentFinance = null;
    state.total = 0;
    state.error = null;
    if (state.summary) {
      state.summary.totalIncome = 0;
      state.summary.totalExpense = 0;
      state.summary.netProfit = 0;
      state.summary.pendingCount = 0;
      state.summary.completedCount = 0;
      state.summary.totalCount = 0;
      state.summary.averageAmount = 0;
      state.summary.maxAmount = 0;
      state.summary.minAmount = 0;
    }
  },

  /**
   * 清除错误
   */
  CLEAR_ERROR(state: FinanceState): void {
    state.error = null;
  },
};

export default mutations;