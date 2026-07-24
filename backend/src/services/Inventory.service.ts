/**
 * Inventory Service - 库存业务逻辑层
 * 提供库存相关的完整业务逻辑处理
 * 包含库存 CRUD、库存调拨、库存变动记录、低库存预警等
 */

import { BaseService } from './BaseService';
import { InventoryRepository } from '../repositories/Inventory.repository';
import { generateCode } from '../utils';
import { ApiError } from '../exceptions/api.error';
import logger from '../utils/logger';

export interface InventoryQueryOptions {
  category?: string;
  status?: string;
  location?: string;
  supplier?: string;
  keyword?: string;
  minQuantity?: number;
  maxQuantity?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface InventoryStats {
  total: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  byCategory: any[];
  valueStats: {
    totalValue: number;
    totalQuantity: number;
    averagePrice: number;
  };
}

export class InventoryService extends BaseService<any> {
  private inventoryRepository: InventoryRepository;

  constructor() {
    super(new InventoryRepository());
    this.inventoryRepository = new InventoryRepository();
  }

  /**
   * 创建库存物品（自动生成编码）
   */
  async createInventory(data: any): Promise<any> {
    try {
      // 验证数据
      if (!data.name || data.name.length < 2) {
        throw new ApiError(400, 'Name must be at least 2 characters');
      }

      if (data.price !== undefined && data.price < 0) {
        throw new ApiError(400, 'Price must be positive');
      }

      if (data.quantity !== undefined && data.quantity < 0) {
        throw new ApiError(400, 'Quantity must be positive');
      }

      // 检查编码是否已存在
      if (data.code) {
        const existing = await this.inventoryRepository.findByCode(data.code);
        if (existing) {
          throw new ApiError(409, 'Inventory code already exists');
        }
      }

      // 生成编码
      data.code = data.code || generateCode('INV');
      data.quantity = data.quantity || 0;

      // 自动计算状态
      data.status = this.calculateStatus(data.quantity, data.minStock || 10);

      const inventory = await this.create(data);
      logger.info(`Inventory created: ${inventory.code} - ${inventory.name}`);
      return inventory;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error creating inventory:', error);
      throw new ApiError(500, 'Failed to create inventory item');
    }
  }

  /**
   * 更新库存物品
   */
  async updateInventory(id: string, data: any): Promise<any | null> {
    try {
      this.validateId(id);

      const inventory = await this.findById(id);
      if (!inventory) {
        throw new ApiError(404, 'Inventory item not found');
      }

      // 如果更新了数量，重新计算状态
      if (data.quantity !== undefined) {
        const minStock = data.minStock !== undefined ? data.minStock : inventory.minStock || 10;
        data.status = this.calculateStatus(data.quantity, minStock);
      }

      // 如果更新了最小库存，重新计算状态
      if (data.minStock !== undefined && inventory.quantity !== undefined) {
        data.status = this.calculateStatus(inventory.quantity, data.minStock);
      }

      const result = await this.update(id, data);
      logger.info(`Inventory updated: ${result.code}`);
      return result;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error updating inventory:', error);
      throw new ApiError(500, 'Failed to update inventory item');
    }
  }

  /**
   * 删除库存物品
   */
  async deleteInventory(id: string): Promise<boolean> {
    try {
      this.validateId(id);

      const inventory = await this.findById(id);
      if (!inventory) {
        throw new ApiError(404, 'Inventory item not found');
      }

      // 检查是否有进行中的调拨或出库
      // 实际实现中需要检查关联数据

      const result = await this.delete(id);
      logger.info(`Inventory deleted: ${inventory.code}`);
      return result;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error deleting inventory:', error);
      throw new ApiError(500, 'Failed to delete inventory item');
    }
  }

  /**
   * 根据编码查询
   */
  async getByCode(code: string): Promise<any | null> {
    if (!code) return null;
    return this.inventoryRepository.findByCode(code);
  }

  /**
   * 根据分类查询
   */
  async getByCategory(category: string): Promise<any[]> {
    if (!category) return [];
    return this.inventoryRepository.findByCategory(category);
  }

  /**
   * 根据状态查询
   */
  async getByStatus(status: string): Promise<any[]> {
    if (!status) return [];
    const validStatuses = ['in_stock', 'low_stock', 'out_of_stock'];
    if (!validStatuses.includes(status)) {
      throw new ApiError(400, 'Invalid status');
    }
    return this.inventoryRepository.findByStatus(status);
  }

  /**
   * 根据位置查询
   */
  async getByLocation(location: string): Promise<any[]> {
    if (!location) return [];
    return this.inventoryRepository.findByLocation(location);
  }

  /**
   * 根据供应商查询
   */
  async getBySupplier(supplier: string): Promise<any[]> {
    if (!supplier) return [];
    return this.inventoryRepository.findBySupplier(supplier);
  }

  /**
   * 搜索库存
   */
  async searchInventory(keyword: string): Promise<any[]> {
    if (!keyword || keyword.length < 2) {
      throw new ApiError(400, 'Keyword must be at least 2 characters');
    }
    return this.inventoryRepository.search(keyword);
  }

  /**
   * 高级搜索
   */
  async advancedSearch(options: InventoryQueryOptions): Promise<any[]> {
    return this.inventoryRepository.advancedSearch(options);
  }

  /**
   * 获取库存列表（分页）
   */
  async getInventoryList(page: number = 1, limit: number = 10, filters?: any): Promise<any> {
    return this.paginate(filters || {}, page, limit);
  }

  /**
   * 获取库存统计
   */
  async getInventoryStats(): Promise<InventoryStats> {
    return this.inventoryRepository.getInventoryStats();
  }

  /**
   * 获取分类统计
   */
  async getCategoryStats(): Promise<any[]> {
    return this.inventoryRepository.getCategoryStats();
  }

  /**
   * 获取库存总价值
   */
  async getTotalValue(): Promise<number> {
    return this.inventoryRepository.getTotalValue();
  }

  /**
   * 获取低库存物品
   */
  async getLowStock(threshold: number = 10): Promise<any[]> {
    if (threshold < 1) {
      throw new ApiError(400, 'Threshold must be at least 1');
    }
    return this.inventoryRepository.getLowStock(threshold);
  }

  /**
   * 更新库存数量
   */
  async updateStock(id: string, quantity: number, type: 'add' | 'subtract' | 'set', reason: string): Promise<any | null> {
    try {
      this.validateId(id);

      if (quantity === 0) {
        throw new ApiError(400, 'Quantity must be non-zero');
      }

      if (type === 'subtract' && quantity > 0) {
        quantity = -quantity;
      }

      const inventory = await this.inventoryRepository.updateStock(id, quantity);
      if (!inventory) {
        throw new ApiError(404, 'Inventory item not found');
      }

      // 记录库存变动日志
      logger.info(`Stock updated: ${inventory.code} - ${type} ${Math.abs(quantity)} (${reason})`);

      return inventory;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error updating stock:', error);
      throw new ApiError(500, 'Failed to update stock');
    }
  }

  /**
   * 调拨库存
   */
  async transferStock(
    id: string,
    fromLocation: string,
    toLocation: string,
    quantity: number,
    reason: string
  ): Promise<any | null> {
    try {
      this.validateId(id);

      if (quantity <= 0) {
        throw new ApiError(400, 'Quantity must be positive');
      }

      if (!fromLocation || !toLocation) {
        throw new ApiError(400, 'Source and destination locations are required');
      }

      if (fromLocation === toLocation) {
        throw new ApiError(400, 'Source and destination locations cannot be the same');
      }

      const inventory = await this.inventoryRepository.transferStock(id, fromLocation, toLocation, quantity);
      if (!inventory) {
        throw new ApiError(404, 'Inventory item not found');
      }

      logger.info(`Stock transferred: ${inventory.code} - ${quantity} from ${fromLocation} to ${toLocation}`);
      return inventory;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error transferring stock:', error);
      throw new ApiError(500, 'Failed to transfer stock');
    }
  }

  /**
   * 批量更新库存
   */
  async batchUpdateStock(items: { id: string; quantity: number }[], reason: string): Promise<number> {
    if (!items || items.length === 0) {
      throw new ApiError(400, 'Items are required');
    }

    if (!reason || reason.length < 3) {
      throw new ApiError(400, 'Reason must be at least 3 characters');
    }

    const validItems = items.filter(item => item.id && item.quantity !== 0);
    if (validItems.length === 0) {
      throw new ApiError(400, 'No valid items to update');
    }

    const result = await this.inventoryRepository.batchUpdateStock(validItems);
    logger.info(`Batch stock updated: ${result} items (${reason})`);
    return result;
  }

  /**
   * 批量删除库存
   */
  async batchDeleteInventory(ids: string[]): Promise<number> {
    if (!ids || ids.length === 0) {
      throw new ApiError(400, 'IDs are required');
    }
    const result = await this.batchDelete(ids);
    logger.info(`Batch deleted ${result} inventory items`);
    return result;
  }

  /**
   * 获取库存变动记录
   */
  async getStockMovements(id: string, startDate?: Date, endDate?: Date): Promise<any[]> {
    this.validateId(id);
    return this.inventoryRepository.getStockMovements(id, startDate, endDate);
  }

  /**
   * 计算库存状态
   */
  private calculateStatus(quantity: number, minStock: number): 'in_stock' | 'low_stock' | 'out_of_stock' {
    if (quantity <= 0) return 'out_of_stock';
    if (quantity <= minStock) return 'low_stock';
    return 'in_stock';
  }
}

export default InventoryService;