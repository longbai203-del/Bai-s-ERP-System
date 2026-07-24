import { BaseRepository } from './BaseRepository';
import { InventoryModel } from '../models/Inventory.model';

export class InventoryRepository extends BaseRepository<any> {
  constructor() {
    super(InventoryModel);
  }

  async findByCode(code: string): Promise<any | null> {
    if (!code) return null;
    return this.model.findOne({ code });
  }

  async findByCategory(category: string): Promise<any[]> {
    if (!category) return [];
    return this.model.find({ category });
  }

  async findByStatus(status: string): Promise<any[]> {
    if (!status) return [];
    return this.model.find({ status });
  }

  async search(keyword: string): Promise<any[]> {
    if (!keyword) return [];
    return this.model.find({
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { code: { $regex: keyword, $options: 'i' } }
      ]
    });
  }

  async updateStock(id: string, quantity: number): Promise<any | null> {
    if (!id) return null;
    const status = quantity > 10 ? 'in_stock' : quantity > 0 ? 'low_stock' : 'out_of_stock';
    return this.model.findByIdAndUpdate(
      id,
      { $inc: { quantity }, status },
      { new: true }
    );
  }

  async getLowStock(threshold: number = 10): Promise<any[]> {
    return this.model.find({ 
      quantity: { $lte: threshold },
      status: { $ne: 'out_of_stock' }
    });
  }

  async getCategoryStats(): Promise<any> {
    return this.model.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$price', '$quantity'] } }
        }
      }
    ]);
  }
}
