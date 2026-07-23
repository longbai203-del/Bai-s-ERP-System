import { BaseService } from './base.service';

export interface Customer {
  id: string;
  customerCode: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  type: 'individual' | 'company';
  taxId: string;
  creditLimit: number;
  currentBalance: number;
  status: 'active' | 'inactive' | 'blocked';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerQuery {
  page?: number;
  limit?: number;
  keyword?: string;
  status?: string;
  type?: string;
}

export class CustomerService extends BaseService {
  constructor() {
    super();
  }
  
  // 获取客户列表
  async getList(params: CustomerQuery) {
    return this.get('/customers', { params });
  }
  
  // 获取客户详情
  async getById(id: string) {
    return this.get(`/customers/${id}`);
  }
  
  // 根据编码获取
  async getByCode(code: string) {
    return this.get(`/customers/code/${code}`);
  }
  
  // 根据邮箱获取
  async getByEmail(email: string) {
    return this.get(`/customers/email/${email}`);
  }
  
  // 搜索客户
  async search(keyword: string) {
    return this.get('/customers/search', { params: { keyword } });
  }
  
  // 创建客户
  async create(data: Partial<Customer>) {
    return this.post('/customers', data);
  }
  
  // 更新客户
  async update(id: string, data: Partial<Customer>) {
    return this.put(`/customers/${id}`, data);
  }
  
  // 更新余额
  async updateBalance(id: string, amount: number) {
    return this.patch(`/customers/${id}/balance`, { amount });
  }
  
  // 切换状态
  async toggleStatus(id: string) {
    return this.patch(`/customers/${id}/toggle-status`);
  }
  
  // 删除客户
  async delete(id: string) {
    return this.delete(`/customers/${id}`);
  }
}

export const customerService = new CustomerService();
