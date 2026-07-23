import { BaseRepository } from '../repositories/BaseRepository';
import { ProductModel, IProduct } from '../models/Product.model';

export class ProductRepository extends BaseRepository<IProduct> {
  constructor() {
    super(ProductModel);
  }
  
  async findByCode(code: string): Promise<IProduct | null> {
    return this.model.findOne({ productCode: code });
  }
  
  async findByCategory(category: string): Promise<IProduct[]> {
    return this.model.find({ category, status: 'active' });
  }
  
  async search(keyword: string): Promise<IProduct[]> {
    return this.model.find({
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { productCode: { $regex: keyword, $options: 'i' } }
      ],
      status: 'active'
    });
  }
  
  async updateStock(id: string, quantity: number): Promise<IProduct | null> {
    return this.model.findByIdAndUpdate(
      id,
      { 
        $inc: { currentStock: quantity },
        updatedAt: new Date()
      },
      { new: true }
    );
  }
  
  async getLowStockProducts(threshold: number = 10): Promise<IProduct[]> {
    return this.model.find({ 
      currentStock: { $lte: threshold },
      status: 'active'
    });
  }
}
