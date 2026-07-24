import { BaseService } from './BaseService';
import { TransactionRepository, AccountRepository } from '../repositories/Finance.repository';
import { generateCode } from '../utils';

export class TransactionService extends BaseService<any> {
  private transactionRepository: TransactionRepository;
  
  constructor() {
    super(new TransactionRepository());
    this.transactionRepository = new TransactionRepository();
  }

  async createTransaction(data: any): Promise<any> {
    data.transactionNo = generateCode('TXN');
    return this.create(data);
  }

  async findByTransactionNo(no: string): Promise<any | null> {
    if (!no) return null;
    return this.transactionRepository.findByTransactionNo(no);
  }

  async findByType(type: string): Promise<any[]> {
    if (!type) return [];
    return this.transactionRepository.findByType(type);
  }

  async findByStatus(status: string): Promise<any[]> {
    if (!status) return [];
    return this.transactionRepository.findByStatus(status);
  }

  async getByDateRange(startDate: Date, endDate: Date): Promise<any[]> {
    if (!startDate || !endDate) return [];
    return this.transactionRepository.findByDateRange(startDate, endDate);
  }

  async getSummary(startDate: Date, endDate: Date): Promise<any> {
    if (!startDate || !endDate) return [];
    return this.transactionRepository.getSummary(startDate, endDate);
  }

  async approveTransaction(id: string, approvedBy: string): Promise<any | null> {
    this.validateId(id);
    return this.update(id, { status: 'completed', approvedBy });
  }

  async cancelTransaction(id: string, notes: string): Promise<any | null> {
    this.validateId(id);
    return this.update(id, { status: 'cancelled', notes });
  }
}

export class AccountService extends BaseService<any> {
  private accountRepository: AccountRepository;
  
  constructor() {
    super(new AccountRepository());
    this.accountRepository = new AccountRepository();
  }

  async createAccount(data: any): Promise<any> {
    data.accountCode = generateCode('ACC');
    return this.create(data);
  }

  async findByCode(code: string): Promise<any | null> {
    if (!code) return null;
    return this.accountRepository.findByCode(code);
  }

  async findByType(type: string): Promise<any[]> {
    if (!type) return [];
    return this.accountRepository.findByType(type);
  }

  async getBalanceSummary(): Promise<any[]> {
    return this.accountRepository.getBalanceSummary();
  }

  async updateBalance(id: string, amount: number): Promise<any | null> {
    this.validateId(id);
    return this.update(id, { $inc: { balance: amount } });
  }
}
