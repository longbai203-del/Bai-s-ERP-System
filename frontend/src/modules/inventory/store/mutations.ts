/**
 * 库存模块Mutations
 * @module modules/inventory/store/mutations
 */

import { InventoryState, Inventory, InventoryQueryParams } from './types';

export const mutations = {
  SET_INVENTORIES(state: InventoryState, inventories: Inventory[]): void {
    state.inventories = inventories;
  },

  SET_CURRENT_INVENTORY(state: InventoryState, inventory: Inventory | null): void {
    state.currentInventory = inventory;
  },

  SET_TOTAL(state: InventoryState, total: number): void {
    state.total = total;
  },

  SET_LOADING(state: InventoryState, loading: boolean): void {
    state.loading = loading;
  },

  SET_ERROR(state: InventoryState, error: string | null): void {
    state.error = error;
  },

  SET_FILTERS(state: InventoryState, filters: Partial<InventoryQueryParams>): void {
    state.filters = { ...state.filters, ...filters };
  },

  RESET_FILTERS(state: InventoryState): void {
    state.filters = { page: 1, limit: 20, sortBy: 'createdAt', sortOrder: 'desc' };
  },

  UPDATE_INVENTORY(state: InventoryState, inventory: Inventory): void {
    const index = state.inventories.findIndex((i) => i.id === inventory.id);
    if (index !== -1) {
      state.inventories[index] = inventory;
    }
    if (state.currentInventory?.id === inventory.id) {
      state.currentInventory = inventory;
    }
  },

  CLEAR_STATE(state: InventoryState): void {
    state.inventories = [];
    state.currentInventory = null;
    state.total = 0;
    state.error = null;
  },
};

export default mutations;