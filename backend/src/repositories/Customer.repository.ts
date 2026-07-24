import { BaseRepository } from './BaseRepository';
import { CustomerModel } from '../models/Customer.model';

export class CustomerRepository extends BaseRepository<any> {
  constructor() {
    super(CustomerModel);
  }

  async findByEmail(email: string): Promise<any | null> {
    if (!email) return null;
    return this.model.findOne({ email });
  }

  async findByCode(code: string): Promise<any | null> {
    if (!code) return null;
    return this.model.findOne({ customerCode: code });
  }

  async findByPhone(phone: string): Promise<any | null> {
    if (!phone) return null;
    return this.model.findOne({ phone });
  }

  async search(keyword: string): Promise<any[]> {
    if (!keyword) return [];
    return this.model.find({
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } },
        { phone: { $regex: keyword, $options: 'i' } }
      ]
    });
  }

  async findByStatus(status: string): Promise<any[]> {
    if (!status) return [];
    return this.model.find({ status });
  }

  async updateBalance(id: string, amount: number): Promise<any | null> {
    if (!id) return null;
    return this.model.findByIdAndUpdate(
      id,
      { $inc: { currentBalance: amount } },
      { new: true }
    );
  }

  async getStatistics(): Promise<any> {
    return this.model.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
  }
}
