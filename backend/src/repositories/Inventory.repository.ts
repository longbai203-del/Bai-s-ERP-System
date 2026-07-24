/**
 * Inventory Repository - 库存数据访问层
 * 提供库存相关的数据库操作
 * 
 * @extends BaseRepository
 */

import { BaseRepository } from './BaseRepository';
import { InventoryModel } from '../models/Inventory.model';
import { Types } from 'mongoose';

export interface InventoryQueryOptions {
  category?: string;
  status?: string;
  keyword?: string;
  minQuantity?: number;
  maxQuantity?: number;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  supplier?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CategoryStats {
  _id: string;
  count: number;
  totalValue: number;
  averagePrice: number;
  minPrice: number;
  maxPrice: number;
  totalQuantity: number;
}

export class InventoryRepository extends BaseRepository<any> {
  constructor() {
    super(InventoryModel);
  }

  /**
   * 根据编码查找库存物品
   */
  async findByCode(code: string): Promise<any | null> {
    if (!code) return null;
    return this.model.findOne({ code });
  }

  /**
   * 根据分类查找库存物品
   */
  async findByCategory(category: string): Promise<any[]> {
    if (!category) return [];
    return this.model.find({ category });
  }

  /**
   * 根据状态查找库存物品
   */
  async findByStatus(status: string): Promise<any[]> {
    if (!status) return [];
    return this.model.find({ status });
  }

  /**
   * 根据位置查找库存物品
   */
  async findByLocation(location: string): Promise<any[]> {
    if (!location) return [];
    return this.model.find({ location });
  }

  /**
   * 根据供应商查找库存物品
   */
  async findBySupplier(supplier: string): Promise<any[]> {
    if (!supplier) return [];
    return this.model.find({ supplier });
  }

  /**
   * 搜索库存物品
   */
  async search(keyword: string): Promise<any[]> {
    if (!keyword) return [];
    const regex = new RegExp(keyword, 'i');
    return this.model.find({
      $or: [
        { name: regex },
        { code: regex },
        { description: regex },
        { category: regex }
      ]
    });
  }

  /**
   * 高级搜索
   */
  async advancedSearch(options: InventoryQueryOptions): Promise<any[]> {
    const filter: any = {};

    if (options.category) filter.category = options.category;
    if (options.status) filter.status = options.status;
    if (options.location) filter.location = options.location;
    if (options.supplier) filter.supplier = options.supplier;

    if (options.keyword) {
      const regex = new RegExp(options.keyword, 'i');
      filter.$or = [
        { name: regex },
        { code: regex },
        { description: regex }
      ];
    }

    if (options.minQuantity !== undefined || options.maxQuantity !== undefined) {
      filter.quantity = {};
      if (options.minQuantity !== undefined) filter.quantity.$gte = options.minQuantity;
      if (options.maxQuantity !== undefined) filter.quantity.$lte = options.maxQuantity;
    }

    if (options.minPrice !== undefined || options.maxPrice !== undefined) {
      filter.price = {};
      if (options.minPrice !== undefined) filter.price.$gte = options.minPrice;
      if (options.maxPrice !== undefined) filter.price.$lte = options.maxPrice;
    }

    const sort: any = {};
    sort[options.sortBy || 'createdAt'] = options.sortOrder === 'asc' ? 1 : -1;

    return this.model.find(filter).sort(sort);
  }

  /**
   * 获取低库存物品
   */
  async getLowStock(threshold: number = 10): Promise<any[]> {
    return this.model.find({
      quantity: { $lte: threshold },
      status: { $ne: 'out_of_stock' }
    }).sort({ quantity: 1 });
  }

  /**
   * 获取分类统计
   */
  async getCategoryStats(): Promise<CategoryStats[]> {
    return this.model.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$price', '$quantity'] } },
          averagePrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          totalQuantity: { $sum: '$quantity' }
        }
      },
      { $sort: { totalValue: -1 } }
    ]);
  }

  /**
   * 更新库存数量
   */
  async updateStock(id: string, quantity: number): Promise<any | null> {
    if (!id) return null;
    const item = await this.model.findById(id);
    if (!item) return null;

    const newQuantity = item.quantity + quantity;
    let status = 'in_stock';
    if (newQuantity <= 0) {
      status = 'out_of_stock';
    } else if (newQuantity <= (item.minStock || 10)) {
      status = 'low_stock';
    }

    return this.model.findByIdAndUpdate(
      id,
      {
        $inc: { quantity: quantity },
        status,
        updatedAt: new Date()
      },
      { new: true }
    );
  }

  /**
   * 获取库存总价值
   */
  async getTotalValue(): Promise<number> {
    const result = await this.model.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ['$price', '$quantity'] } }
        }
      }
    ]);
    return result[0]?.totalValue || 0;
  }

  /**
   * 获取库存统计
   */
  async getInventoryStats(): Promise<any> {
    const stats = await this.model.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          byStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],
          byCategory: [
            { $group: { _id: '$category', count: { $sum: 1 } } }
          ],
          valueStats: [
            {
              $group: {
                _id: null,
                totalValue: { $sum: { $multiply: ['$price', '$quantity'] } },
                totalQuantity: { $sum: '$quantity' },
                averagePrice: { $avg: '$price' }
              }
            }
          ]
        }
      }
    ]);

    const result = stats[0] || {};
    const statusMap: Record<string, number> = {};
    (result.byStatus || []).forEach((item: any) => {
      statusMap[item._id] = item.count;
    });

    return {
      total: result.total?.[0]?.count || 0,
      inStock: statusMap.in_stock || 0,
      lowStock: statusMap.low_stock || 0,
      outOfStock: statusMap.out_of_stock || 0,
      byCategory: result.byCategory || [],
      valueStats: result.valueStats?.[0] || { totalValue: 0, totalQuantity: 0, averagePrice: 0 }
    };
  }

  /**
   * 调拨库存
   */
  async transferStock(id: string, fromLocation: string, toLocation: string, quantity: number): Promise<any | null> {
    if (!id) return null;
    const item = await this.model.findById(id);
    if (!item) return null;

    if (item.quantity < quantity) {
      throw new Error('Insufficient stock for transfer');
    }

    return this.model.findByIdAndUpdate(
      id,
      {
        $inc: { quantity: -quantity },
        location: toLocation,
        updatedAt: new Date()
      },
      { new: true }
    );
  }

  /**
   * 获取库存变动记录
   */
  async getStockMovements(id: string, startDate?: Date, endDate?: Date): Promise<any[]> {
    if (!id) return [];
    return this.model.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'stockmovements',
          localField: '_id',
          foreignField: 'inventoryId',
          as: 'movements'
        }
      },
      {
        $project: {
          name: 1,
          code: 1,
          movements: {
            $filter: {
              input: '$movements',
              as: 'm',
              cond: {
                $and: [
                  startDate ? { $gte: ['$$m.createdAt', startDate] } : true,
                  endDate ? { $lte: ['$$m.createdAt', endDate] } : true
                ]
              }
            }
          }
        }
      }
    ]);
  }

  /**
   * 批量更新库存
   */
  async batchUpdateStock(items: { id: string; quantity: number }[]): Promise<number> {
    if (!items || items.length === 0) return 0;

    const bulkOps = items.map(item => ({
      updateOne: {
        filter: { _id: new Types.ObjectId(item.id) },
        update: {
          $inc: { quantity: item.quantity },
          updatedAt: new Date()
        }
      }
    }));

    const result = await this.model.bulkWrite(bulkOps);
    return result.modifiedCount || 0;
  }
}

export default InventoryRepository;