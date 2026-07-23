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

export class CustomerService extends BaseService {
  async getList(params?: any) {
    return this.get('/customers', { params });
  }
  
  async getById(id: string) {
    return this.get(`/customers/${id}`);
  }
  
  async getByCode(code: string) {
    return this.get(`/customers/code/${code}`);
  }
  
  async getByEmail(email: string) {
    return this.get(`/customers/email/${email}`);
  }
  
  async search(keyword: string) {
    return this.get('/customers/search', { params: { keyword } });
  }
  
  async create(data: Partial<Customer>) {
    return this.post('/customers', data);
  }
  
  async update(id: string, data: Partial<Customer>) {
    return this.put(`/customers/${id}`, data);
  }
  
  async updateBalance(id: string, amount: number) {
    return this.patch(`/customers/${id}/balance`, { amount });
  }
  
  async toggleStatus(id: string) {
    return this.patch(`/customers/${id}/toggle-status`);
  }
  
  async delete(id: string) {
    return this.delete(`/customers/${id}`);
  }
}

export const customerService = new CustomerService();
