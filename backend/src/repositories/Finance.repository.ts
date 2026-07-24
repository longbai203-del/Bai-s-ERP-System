import { BaseRepository } from './BaseRepository';
import { TransactionModel, AccountModel } from '../models/Finance.model';

export class TransactionRepository extends BaseRepository<any> {
  constructor() {
    super(TransactionModel);
  }

  async findByTransactionNo(no: string): Promise<any | null> {
    if (!no) return null;
    return this.model.findOne({ transactionNo: no });
  }

  async findByType(type: string): Promise<any[]> {
    if (!type) return [];
    return this.model.find({ type });
  }

  async findByStatus(status: string): Promise<any[]> {
    if (!status) return [];
    return this.model.find({ status });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<any[]> {
    if (!startDate || !endDate) return [];
    return this.model.find({
      transactionDate: { $gte: startDate, $lte: endDate }
    }).sort({ transactionDate: -1 });
  }

  async getSummary(startDate: Date, endDate: Date): Promise<any> {
    if (!startDate || !endDate) return [];
    return this.model.aggregate([
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
  }
}

export class AccountRepository extends BaseRepository<any> {
  constructor() {
    super(AccountModel);
  }

  async findByCode(code: string): Promise<any | null> {
    if (!code) return null;
    return this.model.findOne({ accountCode: code });
  }

  async findByType(type: string): Promise<any[]> {
    if (!type) return [];
    return this.model.find({ type });
  }

  async getBalanceSummary(): Promise<any[]> {
    return this.model.aggregate([
      { $group: { _id: '$type', totalBalance: { $sum: '$balance' } } }
    ]);
  }
}
