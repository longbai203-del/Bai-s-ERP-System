/**
 * 库存模块Getters
 * @module modules/inventory/store/getters
 */

import { InventoryState, Inventory } from './types';

export const getters = {
  getInventories: (state: InventoryState): Inventory[] => state.inventories,
  getCurrentInventory: (state: InventoryState): Inventory | null => state.currentInventory,
  getTotal: (state: InventoryState): number => state.total,
  isLoading: (state: InventoryState): boolean => state.loading,
  getError: (state: InventoryState): string | null => state.error,
  getCurrentPage: (state: InventoryState): number => state.filters.page || 1,
  getPageSize: (state: InventoryState): number => state.filters.limit || 20,
  getFilters: (state: InventoryState): InventoryQueryParams => state.filters,

  getLowStockItems: (state: InventoryState): Inventory[] => {
    return state.inventories.filter((item) => item.quantity <= item.reorderPoint);
  },

  getOutOfStockItems: (state: InventoryState): Inventory[] => {
    return state.inventories.filter((item) => item.quantity === 0);
  },

  getTotalStock: (state: InventoryState): number => {
    return state.inventories.reduce((sum, item) => sum + item.quantity, 0);
  },

  getTotalReserved: (state: InventoryState): number => {
    return state.inventories.reduce((sum, item) => sum + item.reservedQuantity, 0);
  },

  getTotalAvailable: (state: InventoryState): number => {
    return state.inventories.reduce((sum, item) => sum + item.availableQuantity, 0);
  },
};

export default getters;