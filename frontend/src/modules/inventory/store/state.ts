/**
 * 库存模块状态
 * @module modules/inventory/store/state
 */

import { InventoryState, InventoryQueryParams } from './types';

const defaultFilters: InventoryQueryParams = {
  page: 1,
  limit: 20,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export const state: InventoryState = {
  inventories: [],
  currentInventory: null,
  total: 0,
  loading: false,
  error: null,
  filters: { ...defaultFilters },
};

export function resetState(): InventoryState {
  return {
    inventories: [],
    currentInventory: null,
    total: 0,
    loading: false,
    error: null,
    filters: { ...defaultFilters },
  };
}

export default state;