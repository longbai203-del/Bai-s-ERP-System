import { BaseService } from './base.service';

export interface Product {
  id: string;
  productCode: string;
  name: string;
  description: string;
  category: string;
  subCategory: string;
  brand: string;
  unit: string;
  price: number;
  costPrice: number;
  wholesalePrice: number;
  minStock: number;
  maxStock: number;
  currentStock: number;
  weight: number;
  status: 'active' | 'inactive' | 'discontinued';
  tags: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  keyword?: string;
  category?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
}

export class ProductService extends BaseService {
  constructor() {
    super();
  }
  
  // 获取产品列表
  async getList(params: ProductQuery) {
    return this.get('/products', { params });
  }
  
  // 获取产品详情
  async getById(id: string) {
    return this.get(`/products/${id}`);
  }
  
  // 根据编码获取
  async getByCode(code: string) {
    return this.get(`/products/code/${code}`);
  }
  
  // 根据分类获取
  async getByCategory(category: string) {
    return this.get(`/products/category/${category}`);
  }
  
  // 搜索产品
  async search(keyword: string) {
    return this.get('/products/search', { params: { keyword } });
  }
  
  // 获取低库存产品
  async getLowStock(threshold?: number) {
    return this.get('/products/low-stock', { params: { threshold } });
  }
  
  // 获取分类统计
  async getCategoryStats() {
    return this.get('/products/category-stats');
  }
  
  // 创建产品
  async create(data: Partial<Product>) {
    return this.post('/products', data);
  }
  
  // 更新产品
  async update(id: string, data: Partial<Product>) {
    return this.put(`/products/${id}`, data);
  }
  
  // 更新库存
  async updateStock(id: string, quantity: number) {
    return this.patch(`/products/${id}/stock`, { quantity });
  }
  
  // 删除产品
  async delete(id: string) {
    return this.delete(`/products/${id}`);
  }
}

export const productService = new ProductService();
