import { BaseRepository } from '../repositories/BaseRepository';
import { CustomerModel, ICustomer } from '../models/Customer.model';

export class CustomerRepository extends BaseRepository<ICustomer> {
  constructor() {
    super(CustomerModel);
  }
  
  async findByEmail(email: string): Promise<ICustomer | null> {
    return this.model.findOne({ email });
  }
  
  async findByCode(code: string): Promise<ICustomer | null> {
    return this.model.findOne({ customerCode: code });
  }
  
  async search(keyword: string): Promise<ICustomer[]> {
    return this.model.find({
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } },
        { phone: { $regex: keyword, $options: 'i' } }
      ]
    });
  }
  
  async updateBalance(id: string, amount: number): Promise<ICustomer | null> {
    return this.model.findByIdAndUpdate(
      id,
      { $inc: { currentBalance: amount }, updatedAt: new Date() },
      { new: true }
    );
  }
}
