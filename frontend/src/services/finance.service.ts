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
  reference: string;
  accountId: string;
  accountName: string;
  customerId: string;
  supplierId: string;
  transactionDate: string;
  status: 'pending' | 'completed' | 'cancelled';
  attachments: string[];
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

export interface TransactionQuery {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  accountId?: string;
}

export class TransactionService extends BaseService {
  constructor() {
    super();
  }
  
  // 获取交易列表
  async getList(params: TransactionQuery) {
    return this.get('/finance/transactions', { params });
  }
  
  // 获取交易详情
  async getById(id: string) {
    return this.get(`/finance/transactions/${id}`);
  }
  
  // 根据交易号获取
  async getByNo(no: string) {
    return this.get(`/finance/transactions/no/${no}`);
  }
  
  // 根据日期范围获取
  async getByDateRange(startDate: string, endDate: string) {
    return this.get('/finance/transactions/date-range', { params: { startDate, endDate } });
  }
  
  // 获取收支汇总
  async getSummary(startDate: string, endDate: string) {
    return this.get('/finance/transactions/summary', { params: { startDate, endDate } });
  }
  
  // 创建交易
  async create(data: Partial<Transaction>) {
    return this.post('/finance/transactions', data);
  }
  
  // 更新交易
  async update(id: string, data: Partial<Transaction>) {
    return this.put(`/finance/transactions/${id}`, data);
  }
  
  // 审批交易
  async approve(id: string, approvedBy: string) {
    return this.patch(`/finance/transactions/${id}/approve`, { approvedBy });
  }
  
  // 取消交易
  async cancel(id: string, notes: string) {
    return this.patch(`/finance/transactions/${id}/cancel`, { notes });
  }
  
  // 删除交易
  async delete(id: string) {
    return this.delete(`/finance/transactions/${id}`);
  }
}

export class AccountService extends BaseService {
  constructor() {
    super();
  }
  
  // 获取账户列表
  async getList() {
    return this.get('/finance/accounts');
  }
  
  // 获取账户详情
  async getById(id: string) {
    return this.get(`/finance/accounts/${id}`);
  }
  
  // 根据编码获取
  async getByCode(code: string) {
    return this.get(`/finance/accounts/code/${code}`);
  }
  
  // 获取余额汇总
  async getBalanceSummary() {
    return this.get('/finance/accounts/balance-summary');
  }
  
  // 创建账户
  async create(data: Partial<Account>) {
    return this.post('/finance/accounts', data);
  }
  
  // 更新账户
  async update(id: string, data: Partial<Account>) {
    return this.put(`/finance/accounts/${id}`, data);
  }
  
  // 删除账户
  async delete(id: string) {
    return this.delete(`/finance/accounts/${id}`);
  }
}

export const transactionService = new TransactionService();
export const accountService = new AccountService();
