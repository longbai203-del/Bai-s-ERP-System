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

export interface InventoryQuery {
  page?: number;
  limit?: number;
  keyword?: string;
  category?: string;
  status?: string;
}

export class InventoryService extends BaseService {
  constructor() {
    super();
  }
  
  // 获取库存列表
  async getList(params: InventoryQuery) {
    return this.get('/inventory', { params });
  }
  
  // 获取库存详情
  async getById(id: string) {
    return this.get(`/inventory/${id}`);
  }
  
  // 根据编码获取
  async getByCode(code: string) {
    return this.get(`/inventory/code/${code}`);
  }
  
  // 搜索库存
  async search(keyword: string) {
    return this.get('/inventory/search', { params: { keyword } });
  }
  
  // 创建库存
  async create(data: Partial<InventoryItem>) {
    return this.post('/inventory', data);
  }
  
  // 更新库存
  async update(id: string, data: Partial<InventoryItem>) {
    return this.put(`/inventory/${id}`, data);
  }
  
  // 更新库存数量
  async updateStock(id: string, quantity: number) {
    return this.patch(`/inventory/${id}/stock`, { quantity });
  }
  
  // 删除库存
  async delete(id: string) {
    return this.delete(`/inventory/${id}`);
  }
  
  // 批量删除
  async batchDelete(ids: string[]) {
    return this.post('/inventory/batch-delete', { ids });
  }
}

export const inventoryService = new InventoryService();
