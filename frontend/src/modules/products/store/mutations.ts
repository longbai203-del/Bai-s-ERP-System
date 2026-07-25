/**
 * 产品模块Mutations
 * @module modules/products/store/mutations
 */

import { ProductState, Product, ProductQueryParams } from './types';

/**
 * 产品模块Mutations
 */
export const mutations = {
  /**
   * 设置产品列表
   */
  SET_PRODUCTS(state: ProductState, products: Product[]): void {
    state.products = products;
  },

  /**
   * 设置当前产品
   */
  SET_CURRENT_PRODUCT(state: ProductState, product: Product | null): void {
    state.currentProduct = product;
  },

  /**
   * 设置产品总数
   */
  SET_TOTAL(state: ProductState, total: number): void {
    state.total = total;
  },

  /**
   * 设置加载状态
   */
  SET_LOADING(state: ProductState, loading: boolean): void {
    state.loading = loading;
  },

  /**
   * 设置错误信息
   */
  SET_ERROR(state: ProductState, error: string | null): void {
    state.error = error;
  },

  /**
   * 设置过滤条件
   */
  SET_FILTERS(state: ProductState, filters: Partial<ProductQueryParams>): void {
    state.filters = { ...state.filters, ...filters };
  },

  /**
   * 重置过滤条件
   */
  RESET_FILTERS(state: ProductState): void {
    state.filters = {
      page: 1,
      limit: 20,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };
  },

  /**
   * 添加产品
   */
  ADD_PRODUCT(state: ProductState, product: Product): void {
    state.products.unshift(product);
    state.total += 1;
  },

  /**
   * 更新产品
   */
  UPDATE_PRODUCT(state: ProductState, product: Product): void {
    const index = state.products.findIndex((p) => p.id === product.id);
    if (index !== -1) {
      state.products[index] = product;
    }
    if (state.currentProduct?.id === product.id) {
      state.currentProduct = product;
    }
  },

  /**
   * 删除产品
   */
  DELETE_PRODUCT(state: ProductState, id: string): void {
    state.products = state.products.filter((p) => p.id !== id);
    state.total -= 1;
    if (state.currentProduct?.id === id) {
      state.currentProduct = null;
    }
  },

  /**
   * 更新产品库存
   */
  UPDATE_PRODUCT_STOCK(state: ProductState, { id, quantity }: { id: string; quantity: number }): void {
    const product = state.products.find((p) => p.id === id);
    if (product) {
      product.quantity = quantity;
    }
    if (state.currentProduct?.id === id) {
      state.currentProduct!.quantity = quantity;
    }
  },

  /**
   * 清空状态
   */
  CLEAR_STATE(state: ProductState): void {
    state.products = [];
    state.currentProduct = null;
    state.total = 0;
    state.error = null;
  },
};

export default mutations;