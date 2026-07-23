import { BaseRepository } from '../repositories/BaseRepository';
import { TransactionModel, AccountModel, ITransaction, IAccount } from '../models/Finance.model';

export class TransactionRepository extends BaseRepository<ITransaction> {
  constructor() {
    super(TransactionModel);
  }
  
  async findByTransactionNo(no: string): Promise<ITransaction | null> {
    return this.model.findOne({ transactionNo: no });
  }
  
  async findByDateRange(startDate: Date, endDate: Date): Promise<ITransaction[]> {
    return this.model.find({
      transactionDate: { $gte: startDate, $lte: endDate }
    }).sort({ transactionDate: -1 });
  }
  
  async getIncomeExpenseSummary(startDate: Date, endDate: Date): Promise<any> {
    const result = await this.model.aggregate([
      {
        $match: {
          transactionDate: { $gte: startDate, $lte: endDate },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);
    return result;
  }
}

export class AccountRepository extends BaseRepository<IAccount> {
  constructor() {
    super(AccountModel);
  }
  
  async findByCode(code: string): Promise<IAccount | null> {
    return this.model.findOne({ accountCode: code });
  }
  
  async getBalanceSummary(): Promise<any[]> {
    return this.model.aggregate([
      { $group: { _id: '$type', totalBalance: { $sum: '$balance' } } }
    ]);
  }
}
