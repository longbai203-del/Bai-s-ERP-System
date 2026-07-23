import { BaseService } from './base.service';

export interface InventoryItem {
  id: string;
  name: string;
  code: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  supplier: string;
  warehouse: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  createdAt: string;
  updatedAt: string;
}

export class InventoryService extends BaseService {
  async getList(params?: any) {
    return this.get('/inventory', { params });
  }
  
  async getById(id: string) {
    return this.get(`/inventory/${id}`);
  }
  
  async getByCode(code: string) {
    return this.get(`/inventory/code/${code}`);
  }
  
  async search(keyword: string) {
    return this.get('/inventory/search', { params: { keyword } });
  }
  
  async create(data: Partial<InventoryItem>) {
    return this.post('/inventory', data);
  }
  
  async update(id: string, data: Partial<InventoryItem>) {
    return this.put(`/inventory/${id}`, data);
  }
  
  async updateStock(id: string, quantity: number) {
    return this.patch(`/inventory/${id}/stock`, { quantity });
  }
  
  async delete(id: string) {
    return this.delete(`/inventory/${id}`);
  }
  
  async getLowStock(threshold?: number) {
    return this.get('/inventory/low-stock', { params: { threshold } });
  }
  
  async getCategoryStats() {
    return this.get('/inventory/category-stats');
  }
}

export const inventoryService = new InventoryService();
