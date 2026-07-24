import { BaseService } from './BaseService';
import { InventoryRepository } from '../repositories/Inventory.repository';
import { generateCode } from '../utils';

export class InventoryService extends BaseService<any> {
  private inventoryRepository: InventoryRepository;
  
  constructor() {
    super(new InventoryRepository());
    this.inventoryRepository = new InventoryRepository();
  }

  // ===== 自定义方法 =====

  async createInventory(data: any): Promise<any> {
    data.code = generateCode('INV');
    return this.create(data);
  }

  async findByCode(code: string): Promise<any | null> {
    this.validateId(code);
    return this.inventoryRepository.findByCode(code);
  }

  async findByCategory(category: string): Promise<any[]> {
    if (!category) return [];
    return this.inventoryRepository.findByCategory(category);
  }

  async findByStatus(status: string): Promise<any[]> {
    if (!status) return [];
    return this.inventoryRepository.findByStatus(status);
  }

  async search(keyword: string): Promise<any[]> {
    if (!keyword) return [];
    return this.inventoryRepository.search(keyword);
  }

  async updateStock(id: string, quantity: number): Promise<any | null> {
    this.validateId(id);
    if (quantity === 0) {
      throw new Error('Quantity must be non-zero');
    }
    return this.inventoryRepository.updateStock(id, quantity);
  }

  async getLowStock(threshold: number = 10): Promise<any[]> {
    return this.inventoryRepository.getLowStock(threshold);
  }

  async getCategoryStats(): Promise<any> {
    return this.inventoryRepository.getCategoryStats();
  }

  // ===== 覆盖父类方法（增加日志） =====

  async create(data: any): Promise<any> {
    this.validateData(data);
    return super.create(data);
  }

  async update(id: string, data: any): Promise<any | null> {
    this.validateId(id);
    this.validateData(data);
    return super.update(id, data);
  }
}
