import { BaseRepository } from '../repositories/BaseRepository';
import { InventoryModel, IInventory } from '../models/Inventory.model';

export class InventoryRepository extends BaseRepository<IInventory> {
  constructor() {
    super(InventoryModel);
  }
  
  async findByCode(code: string): Promise<IInventory | null> {
    return this.model.findOne({ code });
  }
  
  async findByCategory(category: string): Promise<IInventory[]> {
    return this.model.find({ category });
  }
  
  async updateStock(id: string, quantity: number): Promise<IInventory | null> {
    return this.model.findByIdAndUpdate(
      id,
      { 
        $inc: { quantity },
        status: quantity > 10 ? 'in_stock' : quantity > 0 ? 'low_stock' : 'out_of_stock'
      },
      { new: true }
    );
  }
}
