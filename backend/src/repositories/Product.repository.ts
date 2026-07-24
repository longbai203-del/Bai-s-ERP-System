import { BaseRepository } from './BaseRepository';
import { ProductModel } from '../models/Product.model';

export class ProductRepository extends BaseRepository<any> {
  constructor() {
    super(ProductModel);
  }

  async findByCode(code: string): Promise<any | null> {
    if (!code) return null;
    return this.model.findOne({ productCode: code });
  }

  async findByCategory(category: string): Promise<any[]> {
    if (!category) return [];
    return this.model.find({ category, status: 'active' });
  }

  async findByBrand(brand: string): Promise<any[]> {
    if (!brand) return [];
    return this.model.find({ brand, status: 'active' });
  }

  async search(keyword: string): Promise<any[]> {
    if (!keyword) return [];
    return this.model.find({
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { productCode: { $regex: keyword, $options: 'i' } }
      ],
      status: 'active'
    });
  }

  async updateStock(id: string, quantity: number): Promise<any | null> {
    if (!id) return null;
    return this.model.findByIdAndUpdate(
      id,
      { $inc: { currentStock: quantity } },
      { new: true }
    );
  }

  async getLowStock(threshold: number = 10): Promise<any[]> {
    return this.model.find({ 
      currentStock: { $lte: threshold },
      status: 'active'
    });
  }

  async getCategoryStats(): Promise<any> {
    return this.model.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$price', '$currentStock'] } }
        }
      }
    ]);
  }
}
