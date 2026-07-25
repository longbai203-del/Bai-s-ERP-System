/**
 * 产品模块Getters
 * @module modules/products/store/getters
 */

import { ProductState } from './types';
import { Product } from './types';

/**
 * 产品模块Getters
 */
export const getters = {
  /**
   * 获取所有产品
   */
  getProducts: (state: ProductState): Product[] => state.products,

  /**
   * 获取当前产品
   */
  getCurrentProduct: (state: ProductState): Product | null => state.currentProduct,

  /**
   * 获取产品总数
   */
  getTotal: (state: ProductState): number => state.total,

  /**
   * 获取加载状态
   */
  isLoading: (state: ProductState): boolean => state.loading,

  /**
   * 获取错误信息
   */
  getError: (state: ProductState): string | null => state.error,

  /**
   * 获取当前页
   */
  getCurrentPage: (state: ProductState): number => state.filters.page || 1,

  /**
   * 获取每页数量
   */
  getPageSize: (state: ProductState): number => state.filters.limit || 20,

  /**
   * 获取过滤条件
   */
  getFilters: (state: ProductState): ProductQueryParams => state.filters,

  /**
   * 按状态统计产品数
   */
  getProductStats: (state: ProductState): Record<string, number> => {
    const stats: Record<string, number> = {};
    state.products.forEach((product) => {
      const status = product.status;
      stats[status] = (stats[status] || 0) + 1;
    });
    return stats;
  },

  /**
   * 按分类统计产品数
   */
  getCategoryStats: (state: ProductState): Record<string, number> => {
    const stats: Record<string, number> = {};
    state.products.forEach((product) => {
      const category = product.category || '未分类';
      stats[category] = (stats[category] || 0) + 1;
    });
    return stats;
  },

  /**
   * 获取活跃产品
   */
  getActiveProducts: (state: ProductState): Product[] => {
    return state.products.filter((product) => product.status === 'active');
  },

  /**
   * 获取精选产品
   */
  getFeaturedProducts: (state: ProductState): Product[] => {
    return state.products.filter((product) => product.isFeatured);
  },

  /**
   * 获取低库存产品
   */
  getLowStockProducts: (state: ProductState): Product[] => {
    return state.products.filter(
      (product) => product.quantity <= product.reorderLevel && product.status === 'active'
    );
  },

  /**
   * 获取产品总库存
   */
  getTotalStock: (state: ProductState): number => {
    return state.products.reduce((sum, product) => sum + product.quantity, 0);
  },

  /**
   * 获取产品总价值
   */
  getTotalValue: (state: ProductState): number => {
    return state.products.reduce((sum, product) => sum + product.quantity * product.price, 0);
  },

  /**
   * 获取最近产品
   */
  getRecentProducts: (state: ProductState): Product[] => {
    return [...state.products]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  },
};

export default getters;