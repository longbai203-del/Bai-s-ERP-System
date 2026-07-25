/**
 * 产品模块类型定义
 * @module modules/products/store/types
 */

/**
 * 产品状态枚举
 */
export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISCONTINUED = 'discontinued',
}

/**
 * 产品接口
 */
export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  cost: number;
  quantity: number;
  reorderLevel: number;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  images: string[];
  status: ProductStatus;
  isFeatured: boolean;
  tags: string[];
  rating: number;
  reviews: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 创建产品请求
 */
export interface CreateProductRequest {
  name: string;
  sku: string;
  description?: string;
  category?: string;
  brand?: string;
  price: number;
  cost?: number;
  quantity?: number;
  reorderLevel?: number;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit?: string;
  };
  images?: string[];
  status?: ProductStatus;
  isFeatured?: boolean;
  tags?: string[];
}

/**
 * 更新产品请求
 */
export interface UpdateProductRequest {
  name?: string;
  sku?: string;
  description?: string;
  category?: string;
  brand?: string;
  price?: number;
  cost?: number;
  quantity?: number;
  reorderLevel?: number;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit?: string;
  };
  images?: string[];
  status?: ProductStatus;
  isFeatured?: boolean;
  tags?: string[];
}

/**
 * 产品查询参数
 */
export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  status?: ProductStatus;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 产品状态
 */
export interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  total: number;
  loading: boolean;
  error: string | null;
  filters: ProductQueryParams;
}

export default {
  ProductStatus,
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductQueryParams,
  ProductState,
};