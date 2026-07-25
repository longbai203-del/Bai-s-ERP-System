/**
 * 采购模块Getters
 * @module modules/purchase/store/getters
 */

import { PurchaseState, Purchase, PurchaseStatus, Supplier } from './types';

export const getters = {
  // 基础Getters
  getPurchases: (state: PurchaseState): Purchase[] => state.purchases,
  getCurrentPurchase: (state: PurchaseState): Purchase | null => state.currentPurchase,
  getSuppliers: (state: PurchaseState): Supplier[] => state.suppliers,
  getStats: (state: PurchaseState): PurchaseStats | null => state.stats,
  getTotal: (state: PurchaseState): number => state.total,
  isLoading: (state: PurchaseState): boolean => state.loading,
  getError: (state: PurchaseState): string | null => state.error,
  getCurrentPage: (state: PurchaseState): number => state.filters.page || 1,
  getPageSize: (state: PurchaseState): number => state.filters.limit || 20,
  getFilters: (state: PurchaseState): PurchaseQueryParams => state.filters,

  // 状态筛选Getters
  getPendingPurchases: (state: PurchaseState): Purchase[] => {
    return state.purchases.filter((p) => p.status === PurchaseStatus.PENDING);
  },

  getOrderedPurchases: (state: PurchaseState): Purchase[] => {
    return state.purchases.filter((p) => p.status === PurchaseStatus.ORDERED);
  },

  getReceivedPurchases: (state: PurchaseState): Purchase[] => {
    return state.purchases.filter((p) => p.status === PurchaseStatus.RECEIVED);
  },

  getCancelledPurchases: (state: PurchaseState): Purchase[] => {
    return state.purchases.filter((p) => p.status === PurchaseStatus.CANCELLED);
  },

  // 金额统计Getters
  getTotalPurchaseAmount: (state: PurchaseState): number => {
    return state.purchases.reduce((sum, p) => sum + p.totalAmount, 0);
  },

  getTotalGrandTotal: (state: PurchaseState): number => {
    return state.purchases.reduce((sum, p) => sum + p.grandTotal, 0);
  },

  getAveragePurchaseAmount: (state: PurchaseState): number => {
    if (state.purchases.length === 0) return 0;
    return getters.getTotalPurchaseAmount(state) / state.purchases.length;
  },

  // 供应商相关Getters
  getActiveSuppliers: (state: PurchaseState): Supplier[] => {
    return state.suppliers.filter((s) => s.status === 'active');
  },

  getSupplierOptions: (state: PurchaseState): Array<{ label: string; value: string }> => {
    return state.suppliers.map((s) => ({ label: s.name, value: s.id }));
  },

  getSupplierById: (state: PurchaseState) => (id: string): Supplier | undefined => {
    return state.suppliers.find((s) => s.id === id);
  },

  // 采购项相关Getters
  getTotalItems: (state: PurchaseState): number => {
    return state.purchases.reduce((sum, p) => sum + p.items.length, 0);
  },

  getTotalQuantity: (state: PurchaseState): number => {
    return state.purchases.reduce((sum, p) => {
      return sum + p.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
    }, 0);
  },

  getPendingQuantity: (state: PurchaseState): number => {
    return state.purchases.filter((p) => p.status !== PurchaseStatus.RECEIVED).reduce((sum, p) => {
      return sum + p.items.reduce((itemSum, item) => itemSum + (item.quantity - item.receivedQuantity), 0);
    }, 0);
  },

  // 月度统计
  getMonthlyPurchaseStats: (state: PurchaseState): Array<{ month: string; amount: number; count: number }> => {
    const map = new Map<string, { amount: number; count: number }>();
    state.purchases.forEach((p) => {
      const month = p.createdAt.substring(0, 7);
      if (!map.has(month)) {
        map.set(month, { amount: 0, count: 0 });
      }
      const data = map.get(month)!;
      data.amount += p.totalAmount;
      data.count += 1;
    });
    return Array.from(map.entries())
      .map(([month, data]) => ({ month, amount: data.amount, count: data.count }))
      .sort((a, b) => a.month.localeCompare(b.month));
  },

  // 最近采购
  getRecentPurchases: (state: PurchaseState, limit: number = 10): Purchase[] => {
    return [...state.purchases]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },

  // 待收货采购
  getPendingReceipt: (state: PurchaseState): Purchase[] => {
    return state.purchases.filter((p) => p.status === PurchaseStatus.ORDERED);
  },

  // 采购完成率
  getCompletionRate: (state: PurchaseState): number => {
    if (state.purchases.length === 0) return 0;
    const completed = state.purchases.filter((p) => p.status === PurchaseStatus.RECEIVED).length;
    return (completed / state.purchases.length) * 100;
  },
};

export default getters;