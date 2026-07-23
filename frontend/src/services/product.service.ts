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

export class ProductService extends BaseService {
  async getList(params?: any) {
    return this.get('/products', { params });
  }
  
  async getById(id: string) {
    return this.get(`/products/${id}`);
  }
  
  async getByCode(code: string) {
    return this.get(`/products/code/${code}`);
  }
  
  async getByCategory(category: string) {
    return this.get(`/products/category/${category}`);
  }
  
  async search(keyword: string) {
    return this.get('/products/search', { params: { keyword } });
  }
  
  async getLowStock(threshold?: number) {
    return this.get('/products/low-stock', { params: { threshold } });
  }
  
  async getCategoryStats() {
    return this.get('/products/category-stats');
  }
  
  async create(data: Partial<Product>) {
    return this.post('/products', data);
  }
  
  async update(id: string, data: Partial<Product>) {
    return this.put(`/products/${id}`, data);
  }
  
  async updateStock(id: string, quantity: number) {
    return this.patch(`/products/${id}/stock`, { quantity });
  }
  
  async delete(id: string) {
    return this.delete(`/products/${id}`);
  }
}

export const productService = new ProductService();
