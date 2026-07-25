/**
 * 产品模块Actions
 * @module modules/products/store/actions
 */

import { Commit } from 'vuex';
import { Product, CreateProductRequest, UpdateProductRequest, ProductQueryParams } from './types';
import { productApi } from '@/api/products';

/**
 * 产品模块Actions
 */
export const actions = {
  /**
   * 获取产品列表
   */
  async fetchProducts({ commit }: { commit: Commit }, params: ProductQueryParams): Promise<void> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await productApi.getProducts(params);
      commit('SET_PRODUCTS', response.data.items);
      commit('SET_TOTAL', response.data.total);
    } catch (error: any) {
      commit('SET_ERROR', error.message || '获取产品列表失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  /**
   * 获取产品详情
   */
  async fetchProductDetail({ commit }: { commit: Commit }, id: string): Promise<Product> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await productApi.getProductDetail(id);
      commit('SET_CURRENT_PRODUCT', response.data);
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '获取产品详情失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  /**
   * 根据SKU获取产品
   */
  async fetchProductBySku({ commit }: { commit: Commit }, sku: string): Promise<Product | null> {
    try {
      const response = await productApi.getProductBySku(sku);
      return response.data;
    } catch (error: any) {
      return null;
    }
  },

  /**
   * 创建产品
   */
  async createProduct({ commit }: { commit: Commit }, data: CreateProductRequest): Promise<Product> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await productApi.createProduct(data);
      commit('ADD_PRODUCT', response.data);
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '创建产品失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  /**
   * 更新产品
   */
  async updateProduct(
    { commit }: { commit: Commit },
    { id, data }: { id: string; data: UpdateProductRequest }
  ): Promise<Product> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const response = await productApi.updateProduct(id, data);
      commit('UPDATE_PRODUCT', response.data);
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '更新产品失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  /**
   * 删除产品
   */
  async deleteProduct({ commit }: { commit: Commit }, id: string): Promise<void> {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      await productApi.deleteProduct(id);
      commit('DELETE_PRODUCT', id);
    } catch (error: any) {
      commit('SET_ERROR', error.message || '删除产品失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  /**
   * 更新产品库存
   */
  async updateProductStock(
    { commit }: { commit: Commit },
    { id, data }: { id: string; data: { quantity: number; reason?: string; reference?: string } }
  ): Promise<Product> {
    commit('SET_LOADING', true);

    try {
      const response = await productApi.updateProductStock(id, data);
      commit('UPDATE_PRODUCT_STOCK', { id, quantity: response.data.quantity });
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '更新库存失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  /**
   * 搜索产品
   */
  async searchProducts({ commit }: { commit: Commit }, params: { search: string; limit?: number }): Promise<Product[]> {
    commit('SET_LOADING', true);

    try {
      const response = await productApi.searchProducts(params);
      return response.data;
    } catch (error: any) {
      commit('SET_ERROR', error.message || '搜索产品失败');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  /**
   * 设置过滤条件
   */
  setFilters({ commit }: { commit: Commit }, filters: Partial<ProductQueryParams>): void {
    commit('SET_FILTERS', filters);
  },

  /**
   * 重置过滤条件
   */
  resetFilters({ commit }: { commit: Commit }): void {
    commit('RESET_FILTERS');
  },

  /**
   * 清除错误
   */
  clearError({ commit }: { commit: Commit }): void {
    commit('SET_ERROR', null);
  },
};

export default actions;