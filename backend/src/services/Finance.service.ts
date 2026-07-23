import { BaseService } from '../services/BaseService';
import { TransactionRepository, AccountRepository } from '../repositories/Finance.repository';
import { ITransaction, IAccount } from '../models/Finance.model';
import { generateCode } from '../utils';

export class TransactionService extends BaseService<ITransaction> {
  private transactionRepository: TransactionRepository;
  
  constructor() {
    super(new TransactionRepository());
    this.transactionRepository = new TransactionRepository();
  }
  
  async createTransaction(data: Partial<ITransaction>): Promise<ITransaction> {
    data.transactionNo = generateCode('TXN');
    return this.repository.create(data);
  }
  
  async findByTransactionNo(no: string): Promise<ITransaction | null> {
    return this.transactionRepository.findByTransactionNo(no);
  }
  
  async getByDateRange(startDate: Date, endDate: Date): Promise<ITransaction[]> {
    return this.transactionRepository.findByDateRange(startDate, endDate);
  }
  
  async getSummary(startDate: Date, endDate: Date): Promise<any> {
    return this.transactionRepository.getIncomeExpenseSummary(startDate, endDate);
  }
  
  async approveTransaction(id: string, approvedBy: string): Promise<ITransaction | null> {
    return this.repository.update(id, { 
      status: 'completed', 
      approvedBy,
      updatedAt: new Date()
    });
  }
  
  async cancelTransaction(id: string, notes: string): Promise<ITransaction | null> {
    return this.repository.update(id, { 
      status: 'cancelled', 
      notes,
      updatedAt: new Date()
    });
  }
}

export class AccountService extends BaseService<IAccount> {
  private accountRepository: AccountRepository;
  
  constructor() {
    super(new AccountRepository());
    this.accountRepository = new AccountRepository();
  }
  
  async createAccount(data: Partial<IAccount>): Promise<IAccount> {
    data.accountCode = generateCode('ACC');
    return this.repository.create(data);
  }
  
  async findByCode(code: string): Promise<IAccount | null> {
    return this.accountRepository.findByCode(code);
  }
  
  async getBalanceSummary(): Promise<any[]> {
    return this.accountRepository.getBalanceSummary();
  }
  
  async updateBalance(id: string, amount: number): Promise<IAccount | null> {
    return this.repository.update(id, { 
      $inc: { balance: amount },
      updatedAt: new Date()
    });
  }
}
