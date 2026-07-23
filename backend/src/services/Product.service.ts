import { BaseService } from '../services/BaseService';
import { ProductRepository } from '../repositories/Product.repository';
import { IProduct } from '../models/Product.model';
import { generateCode } from '../utils';

export class ProductService extends BaseService<IProduct> {
  private productRepository: ProductRepository;
  
  constructor() {
    super(new ProductRepository());
    this.productRepository = new ProductRepository();
  }
  
  async createProduct(data: Partial<IProduct>): Promise<IProduct> {
    data.productCode = generateCode('PRD');
    return this.repository.create(data);
  }
  
  async findByCode(code: string): Promise<IProduct | null> {
    return this.productRepository.findByCode(code);
  }
  
  async findByCategory(category: string): Promise<IProduct[]> {
    return this.productRepository.findByCategory(category);
  }
  
  async search(keyword: string): Promise<IProduct[]> {
    return this.productRepository.search(keyword);
  }
  
  async updateStock(id: string, quantity: number): Promise<IProduct | null> {
    return this.productRepository.updateStock(id, quantity);
  }
  
  async getLowStockProducts(threshold: number = 10): Promise<IProduct[]> {
    return this.productRepository.getLowStockProducts(threshold);
  }
  
  async getCategoryStatistics(): Promise<any[]> {
    return this.productRepository.findAll().then(products => {
      const stats: any = {};
      products.forEach(p => {
        if (!stats[p.category]) {
          stats[p.category] = { count: 0, totalValue: 0 };
        }
        stats[p.category].count++;
        stats[p.category].totalValue += p.price * p.currentStock;
      });
      return Object.entries(stats).map(([category, data]) => ({ category, ...data }));
    });
  }
}
