import { BaseService } from './BaseService';
import { ProductRepository } from '../repositories/Product.repository';
import { generateCode } from '../utils';

export class ProductService extends BaseService<any> {
  private productRepository: ProductRepository;
  
  constructor() {
    super(new ProductRepository());
    this.productRepository = new ProductRepository();
  }

  async createProduct(data: any): Promise<any> {
    data.productCode = generateCode('PRD');
    return this.create(data);
  }

  async findByCode(code: string): Promise<any | null> {
    if (!code) return null;
    return this.productRepository.findByCode(code);
  }

  async findByCategory(category: string): Promise<any[]> {
    if (!category) return [];
    return this.productRepository.findByCategory(category);
  }

  async findByBrand(brand: string): Promise<any[]> {
    if (!brand) return [];
    return this.productRepository.findByBrand(brand);
  }

  async search(keyword: string): Promise<any[]> {
    if (!keyword) return [];
    return this.productRepository.search(keyword);
  }

  async updateStock(id: string, quantity: number): Promise<any | null> {
    this.validateId(id);
    return this.productRepository.updateStock(id, quantity);
  }

  async getLowStock(threshold: number = 10): Promise<any[]> {
    return this.productRepository.getLowStock(threshold);
  }

  async getCategoryStats(): Promise<any> {
    return this.productRepository.getCategoryStats();
  }
}
