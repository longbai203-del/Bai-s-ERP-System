/**
 * 采购模块Actions
 * @module modules/purchase/store/actions
 */

import { Commit } from 'vuex';
import {
  Purchase,
  Supplier,
  CreatePurchaseRequest,
  UpdatePurchaseRequest,
  PurchaseQueryParams,
} from './types';
import { purchaseApi } from '@/api/purchase';

export const actions = {
  // 采购单管理
  async fetchPurchases({ commit }: { commit: Commit }, params: PurchaseQueryParams): Promise<void> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const response = await purchaseApi.getPurchases(params);
      commit('SET_PURCHASES', response.data.items);
      commit('SET_TOTAL', response.data.total);
      if (response.data.stats) {
        commit('SET_STATS', response.data.stats);
      }
    } catch (error: any) {
      commit('SET_ERROR', error.message || '获取采购单列表失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async fetchPurchaseDetail({ commit }: { commit: Commit }, id: string): Promise<Purchase> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const response = await purchaseApi.getPurchaseDetail(id);
      commit('SET_CURRENT_PURCHASE', response.data);
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '获取采购单详情失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async createPurchase({ commit }: { commit: Commit }, data: CreatePurchaseRequest): Promise<Purchase> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const response = await purchaseApi.createPurchase(data);
      commit('ADD_PURCHASE', response.data);
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '创建采购单失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async updatePurchase(
    { commit }: { commit: Commit },
    { id, data }: { id: string; data: UpdatePurchaseRequest }
  ): Promise<Purchase> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const response = await purchaseApi.updatePurchase(id, data);
      commit('UPDATE_PURCHASE', response.data);
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '更新采购单失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async updatePurchaseStatus(
    { commit }: { commit: Commit },
    { id, status }: { id: string; status: PurchaseStatus }
  ): Promise<Purchase> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const response = await purchaseApi.updatePurchaseStatus(id, status);
      commit('UPDATE_PURCHASE_STATUS', { id, status: response.data.status });
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '更新采购单状态失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async deletePurchase({ commit }: { commit: Commit }, id: string): Promise<void> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      await purchaseApi.deletePurchase(id);
      commit('DELETE_PURCHASE', id);
    } catch (error: any) {
      commit('SET_ERROR', error.message || '删除采购单失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // 供应商管理
  async fetchSuppliers({ commit }: { commit: Commit }): Promise<void> {
    try {
      const response = await purchaseApi.getSuppliers();
      commit('SET_SUPPLIERS', response.data);
    } catch (error: any) {
      commit('SET_ERROR', error.message || '获取供应商列表失败');
      throw error;
    }
  },

  async createSupplier({ commit }: { commit: Commit }, data: any): Promise<Supplier> {
    try {
      const response = await purchaseApi.createSupplier(data);
      commit('ADD_SUPPLIER', response.data);
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '创建供应商失败');
      throw error;
    }
  },

  async updateSupplier({ commit }: { commit: Commit }, { id, data }: { id: string; data: any }): Promise<Supplier> {
    try {
      const response = await purchaseApi.updateSupplier(id, data);
      commit('UPDATE_SUPPLIER', response.data);
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '更新供应商失败');
      throw error;
    }
  },

  async deleteSupplier({ commit }: { commit: Commit }, id: string): Promise<void> {
    try {
      await purchaseApi.deleteSupplier(id);
      commit('DELETE_SUPPLIER', id);
    } catch (error: any) {
      commit('SET_ERROR', error.message || '删除供应商失败');
      throw error;
    }
  },

  // 通用
  setFilters({ commit }: { commit: Commit }, filters: Partial<PurchaseQueryParams>): void {
    commit('SET_FILTERS', filters);
  },

  resetFilters({ commit }: { commit: Commit }): void {
    commit('RESET_FILTERS');
  },

  clearError({ commit }: { commit: Commit }): void {
    commit('CLEAR_ERROR');
  },

  clearState({ commit }: { commit: Commit }): void {
    commit('CLEAR_STATE');
  },
};

export default actions;