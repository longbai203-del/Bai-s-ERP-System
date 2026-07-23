import { BaseService } from './base.service';

export interface Transaction {
  id: string;
  transactionNo: string;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  subCategory: string;
  amount: number;
  currency: string;
  description: string;
  accountId: string;
  accountName: string;
  customerId: string;
  supplierId: string;
  transactionDate: string;
  status: 'pending' | 'completed' | 'cancelled';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  accountCode: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  balance: number;
  currency: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export class TransactionService extends BaseService {
  async getList(params?: any) {
    return this.get('/finance/transactions', { params });
  }
  
  async getById(id: string) {
    return this.get(`/finance/transactions/${id}`);
  }
  
  async getByNo(no: string) {
    return this.get(`/finance/transactions/no/${no}`);
  }
  
  async getByDateRange(startDate: string, endDate: string) {
    return this.get('/finance/transactions/date-range', { params: { startDate, endDate } });
  }
  
  async getSummary(startDate: string, endDate: string) {
    return this.get('/finance/transactions/summary', { params: { startDate, endDate } });
  }
  
  async create(data: Partial<Transaction>) {
    return this.post('/finance/transactions', data);
  }
  
  async update(id: string, data: Partial<Transaction>) {
    return this.put(`/finance/transactions/${id}`, data);
  }
  
  async approve(id: string, approvedBy: string) {
    return this.patch(`/finance/transactions/${id}/approve`, { approvedBy });
  }
  
  async cancel(id: string, notes: string) {
    return this.patch(`/finance/transactions/${id}/cancel`, { notes });
  }
  
  async delete(id: string) {
    return this.delete(`/finance/transactions/${id}`);
  }
}

export class AccountService extends BaseService {
  async getList() {
    return this.get('/finance/accounts');
  }
  
  async getById(id: string) {
    return this.get(`/finance/accounts/${id}`);
  }
  
  async getByCode(code: string) {
    return this.get(`/finance/accounts/code/${code}`);
  }
  
  async getBalanceSummary() {
    return this.get('/finance/accounts/balance-summary');
  }
  
  async create(data: Partial<Account>) {
    return this.post('/finance/accounts', data);
  }
  
  async update(id: string, data: Partial<Account>) {
    return this.put(`/finance/accounts/${id}`, data);
  }
  
  async delete(id: string) {
    return this.delete(`/finance/accounts/${id}`);
  }
}

export const transactionService = new TransactionService();
export const accountService = new AccountService();
