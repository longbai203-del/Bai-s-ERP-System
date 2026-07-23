import { BaseService } from '../services/BaseService';
import { InventoryRepository } from '../repositories/Inventory.repository';
import { IInventory } from '../models/Inventory.model';

export class InventoryService extends BaseService<IInventory> {
  private inventoryRepository: InventoryRepository;
  
  constructor() {
    super(new InventoryRepository());
    this.inventoryRepository = new InventoryRepository();
  }
  
  async findByCode(code: string) {
    return this.inventoryRepository.findByCode(code);
  }
  
  async findByCategory(category: string) {
    return this.inventoryRepository.findByCategory(category);
  }
  
  async updateStock(id: string, quantity: number) {
    return this.inventoryRepository.updateStock(id, quantity);
  }
  
  async search(keyword: string) {
    return this.repository.findAll({
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { code: { $regex: keyword, $options: 'i' } }
      ]
    });
  }
}
