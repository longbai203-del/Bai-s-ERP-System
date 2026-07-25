/**
 * 采购模块Mutations
 * @module modules/purchase/store/mutations
 */

import { PurchaseState, Purchase, Supplier, PurchaseQueryParams, PurchaseStats } from './types';

export const mutations = {
  // 采购单相关
  SET_PURCHASES(state: PurchaseState, purchases: Purchase[]): void {
    state.purchases = purchases;
  },

  SET_CURRENT_PURCHASE(state: PurchaseState, purchase: Purchase | null): void {
    state.currentPurchase = purchase;
  },

  SET_TOTAL(state: PurchaseState, total: number): void {
    state.total = total;
  },

  SET_STATS(state: PurchaseState, stats: PurchaseStats): void {
    state.stats = stats;
  },

  ADD_PURCHASE(state: PurchaseState, purchase: Purchase): void {
    state.purchases.unshift(purchase);
    state.total += 1;
  },

  UPDATE_PURCHASE(state: PurchaseState, purchase: Purchase): void {
    const index = state.purchases.findIndex((p) => p.id === purchase.id);
    if (index !== -1) {
      state.purchases[index] = purchase;
    }
    if (state.currentPurchase?.id === purchase.id) {
      state.currentPurchase = purchase;
    }
  },

  DELETE_PURCHASE(state: PurchaseState, id: string): void {
    state.purchases = state.purchases.filter((p) => p.id !== id);
    state.total -= 1;
    if (state.currentPurchase?.id === id) {
      state.currentPurchase = null;
    }
  },

  UPDATE_PURCHASE_STATUS(state: PurchaseState, { id, status }: { id: string; status: PurchaseStatus }): void {
    const purchase = state.purchases.find((p) => p.id === id);
    if (purchase) {
      purchase.status = status;
      purchase.updatedAt = new Date().toISOString();
      if (status === PurchaseStatus.ORDERED) {
        purchase.orderedAt = new Date().toISOString();
      } else if (status === PurchaseStatus.RECEIVED) {
        purchase.receivedAt = new Date().toISOString();
      } else if (status === PurchaseStatus.CANCELLED) {
        purchase.cancelledAt = new Date().toISOString();
      }
    }
    if (state.currentPurchase?.id === id) {
      state.currentPurchase = purchase || null;
    }
  },

  UPDATE_PURCHASE_ITEMS(state: PurchaseState, { id, items }: { id: string; items: PurchaseItem[] }): void {
    const purchase = state.purchases.find((p) => p.id === id);
    if (purchase) {
      purchase.items = items;
      purchase.totalAmount = items.reduce((sum, item) => sum + item.total, 0);
    }
    if (state.currentPurchase?.id === id) {
      state.currentPurchase = purchase || null;
    }
  },

  // 供应商相关
  SET_SUPPLIERS(state: PurchaseState, suppliers: Supplier[]): void {
    state.suppliers = suppliers;
  },

  ADD_SUPPLIER(state: PurchaseState, supplier: Supplier): void {
    state.suppliers.push(supplier);
  },

  UPDATE_SUPPLIER(state: PurchaseState, supplier: Supplier): void {
    const index = state.suppliers.findIndex((s) => s.id === supplier.id);
    if (index !== -1) {
      state.suppliers[index] = supplier;
    }
  },

  DELETE_SUPPLIER(state: PurchaseState, id: string): void {
    state.suppliers = state.suppliers.filter((s) => s.id !== id);
  },

  // 通用
  SET_LOADING(state: PurchaseState, loading: boolean): void {
    state.loading = loading;
  },

  SET_ERROR(state: PurchaseState, error: string | null): void {
    state.error = error;
  },

  SET_FILTERS(state: PurchaseState, filters: Partial<PurchaseQueryParams>): void {
    state.filters = { ...state.filters, ...filters };
  },

  RESET_FILTERS(state: PurchaseState): void {
    state.filters = { page: 1, limit: 20, sortBy: 'createdAt', sortOrder: 'desc' };
  },

  CLEAR_STATE(state: PurchaseState): void {
    state.purchases = [];
    state.currentPurchase = null;
    state.total = 0;
    state.error = null;
  },

  CLEAR_ERROR(state: PurchaseState): void {
    state.error = null;
  },
};

export default mutations;