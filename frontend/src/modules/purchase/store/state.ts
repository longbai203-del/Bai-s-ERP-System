/**
 * 采购模块状态
 * @module modules/purchase/store/state
 */

import { PurchaseState, PurchaseQueryParams, PurchaseStats } from './types';

const defaultFilters: PurchaseQueryParams = {
  page: 1,
  limit: 20,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

const defaultStats: PurchaseStats = {
  totalPurchases: 0,
  totalAmount: 0,
  byStatus: { pending: 0, ordered: 0, received: 0, cancelled: 0 },
  bySupplier: {},
  averageAmount: 0,
  pendingCount: 0,
  receivedCount: 0,
  monthlyTotal: [],
};

export const state: PurchaseState = {
  purchases: [],
  currentPurchase: null,
  suppliers: [],
  stats: { ...defaultStats },
  total: 0,
  loading: false,
  error: null,
  filters: { ...defaultFilters },
};

export function resetState(): PurchaseState {
  return {
    purchases: [],
    currentPurchase: null,
    suppliers: [],
    stats: { ...defaultStats },
    total: 0,
    loading: false,
    error: null,
    filters: { ...defaultFilters },
  };
}

export default state;