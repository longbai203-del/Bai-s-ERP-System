/**
 * 库存模块Actions
 * @module modules/inventory/store/actions
 */

import { Commit } from 'vuex';
import { Inventory, AdjustInventoryRequest, InventoryQueryParams } from './types';
import { inventoryApi } from '@/api/inventory';

export const actions = {
  async fetchInventories({ commit }: { commit: Commit }, params: InventoryQueryParams): Promise<void> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const response = await inventoryApi.getInventories(params);
      commit('SET_INVENTORIES', response.data.items);
      commit('SET_TOTAL', response.data.total);
    } catch (error: any) {
      commit('SET_ERROR', error.message || '获取库存列表失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async fetchInventoryDetail({ commit }: { commit: Commit }, id: string): Promise<Inventory> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const response = await inventoryApi.getInventoryDetail(id);
      commit('SET_CURRENT_INVENTORY', response.data);
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '获取库存详情失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async updateInventory(
    { commit }: { commit: Commit },
    { id, data }: { id: string; data: Partial<Inventory> }
  ): Promise<Inventory> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const response = await inventoryApi.updateInventory(id, data);
      commit('UPDATE_INVENTORY', response.data);
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '更新库存失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async adjustInventory(
    { commit }: { commit: Commit },
    { id, data }: { id: string; data: AdjustInventoryRequest }
  ): Promise<Inventory> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const response = await inventoryApi.adjustInventory(id, data);
      commit('UPDATE_INVENTORY', response.data);
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '调整库存失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  setFilters({ commit }: { commit: Commit }, filters: Partial<InventoryQueryParams>): void {
    commit('SET_FILTERS', filters);
  },

  resetFilters({ commit }: { commit: Commit }): void {
    commit('RESET_FILTERS');
  },

  clearError({ commit }: { commit: Commit }): void {
    commit('SET_ERROR', null);
  },
};

export default actions;