/**
 * Inventory Model - 库存数据模型
 * 提供完整的库存 Schema 定义、验证、索引和业务方法
 */

import mongoose, { Schema, Document, Types } from 'mongoose';

// ============================================
// 类型定义
// ============================================

export interface IInventoryMovement {
  type: 'in' | 'out' | 'adjust' | 'transfer';
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  reference: string;
  referenceType: string;
  performedBy: string;
  timestamp: Date;
}

export interface IInventory extends Document {
  name: string;
  code: string;
  category: string;
  subCategory: string;
  quantity: number;
  unit: string;
  price: number;
  costPrice: number;
  supplier: string;
  warehouse: string;
  location: string;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
  batchNumber: string;
  expiryDate: Date;
  serialNumbers: string[];
  movements: IInventoryMovement[];
  notes: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;

  // 实例方法
  isLowStock(): boolean;
  isOutOfStock(): boolean;
  getStockValue(): number;
  getAvailableQuantity(): number;
  updateQuantity(quantity: number, type: string, reason: string, performedBy: string): Promise<IInventory>;
  addMovement(movement: IInventoryMovement): void;
  getMovements(limit?: number): IInventoryMovement[];
  calculateStatus(): string;
  isExpired(): boolean;
  getDaysUntilExpiry(): number;
  replenish(quantity: number, reason: string, performedBy: string): Promise<IInventory>;
}

// ============================================
// Schema 定义
// ============================================

const InventoryMovementSchema = new Schema<IInventoryMovement>({
  type: {
    type: String,
    enum: ['in', 'out', 'adjust', 'transfer'],
    required: true
  },
  quantity: { type: Number, required: true },
  previousQuantity: { type: Number, required: true },
  newQuantity: { type: Number, required: true },
  reason: { type: String, required: true },
  reference: { type: String },
  referenceType: { type: String },
  performedBy: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, { _id: true });

const InventorySchema = new Schema<IInventory>({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    index: true,
    uppercase: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  subCategory: { type: String, trim: true },
  quantity: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  costPrice: {
    type: Number,
    min: 0
  },
  supplier: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  warehouse: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  location: { type: String, trim: true },
  minStock: {
    type: Number,
    default: 10,
    min: 0
  },
  maxStock: {
    type: Number,
    min: 0
  },
  reorderPoint: {
    type: Number,
    min: 0
  },
  status: {
    type: String,
    enum: ['in_stock', 'low_stock', 'out_of_stock', 'discontinued'],
    default: 'out_of_stock',
    index: true
  },
  batchNumber: { type: String, trim: true },
  expiryDate: { type: Date },
  serialNumbers: [{ type: String }],
  movements: [InventoryMovementSchema],
  notes: { type: String, trim: true },
  tags: [{ type: String, index: true }]
}, {
  timestamps: true,
  collection: 'inventories',
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ============================================
// 虚拟字段
// ============================================

InventorySchema.virtual('stockValue').get(function(this: IInventory) {
  return this.quantity * this.price;
});

InventorySchema.virtual('isReorderingNeeded').get(function(this: IInventory) {
  if (this.quantity <= this.reorderPoint) return true;
  return false;
});

// ============================================
// 索引定义
// ============================================

InventorySchema.index({ name: 'text', code: 'text', category: 'text' });
InventorySchema.index({ category: 1, status: 1 });
InventorySchema.index({ supplier: 1, status: 1 });
InventorySchema.index({ warehouse: 1, status: 1 });
InventorySchema.index({ quantity: 1 });
InventorySchema.index({ expiryDate: 1 });
InventorySchema.index({ minStock: 1, quantity: 1 });

// ============================================
// 实例方法
// ============================================

InventorySchema.methods = {
  /**
   * 检查是否低库存
   */
  isLowStock(): boolean {
    return this.quantity <= this.minStock;
  },

  /**
   * 检查是否缺货
   */
  isOutOfStock(): boolean {
    return this.quantity <= 0;
  },

  /**
   * 获取库存价值
   */
  getStockValue(): number {
    return this.quantity * this.price;
  },

  /**
   * 获取可用数量
   */
  getAvailableQuantity(): number {
    return Math.max(0, this.quantity);
  },

  /**
   * 更新库存数量
   */
  async updateQuantity(
    quantity: number,
    type: 'in' | 'out' | 'adjust' | 'transfer',
    reason: string,
    performedBy: string
  ): Promise<IInventory> {
    const previousQuantity = this.quantity;
    let newQuantity: number;

    switch (type) {
      case 'in':
        newQuantity = this.quantity + quantity;
        break;
      case 'out':
        if (this.quantity < quantity) {
          throw new Error(`Insufficient stock. Available: ${this.quantity}, Requested: ${quantity}`);
        }
        newQuantity = this.quantity - quantity;
        break;
      case 'adjust':
        if (quantity < 0 && Math.abs(quantity) > this.quantity) {
          throw new Error(`Cannot adjust below zero. Current: ${this.quantity}`);
        }
        newQuantity = quantity;
        break;
      case 'transfer':
        if (this.quantity < quantity) {
          throw new Error(`Insufficient stock for transfer. Available: ${this.quantity}, Requested: ${quantity}`);
        }
        newQuantity = this.quantity - quantity;
        break;
      default:
        throw new Error(`Invalid movement type: ${type}`);
    }

    this.quantity = newQuantity;
    this.status = this.calculateStatus();

    // 记录变动
    this.addMovement({
      type,
      quantity,
      previousQuantity,
      newQuantity,
      reason,
      performedBy,
      timestamp: new Date()
    });

    return this.save();
  },

  /**
   * 添加库存变动记录
   */
  addMovement(movement: IInventoryMovement): void {
    this.movements.push(movement);
    if (this.movements.length > 1000) {
      this.movements = this.movements.slice(-1000);
    }
  },

  /**
   * 获取库存变动记录
   */
  getMovements(limit: number = 50): IInventoryMovement[] {
    return this.movements.slice(-limit).reverse();
  },

  /**
   * 计算库存状态
   */
  calculateStatus(): 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued' {
    if (this.status === 'discontinued') return 'discontinued';
    if (this.quantity <= 0) return 'out_of_stock';
    if (this.quantity <= this.minStock) return 'low_stock';
    return 'in_stock';
  },

  /**
   * 检查是否过期
   */
  isExpired(): boolean {
    if (!this.expiryDate) return false;
    return new Date() > this.expiryDate;
  },

  /**
   * 获取距离过期天数
   */
  getDaysUntilExpiry(): number {
    if (!this.expiryDate) return -1;
    const diff = this.expiryDate.getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  },

  /**
   * 补货
   */
  async replenish(quantity: number, reason: string, performedBy: string): Promise<IInventory> {
    if (quantity <= 0) {
      throw new Error('Replenishment quantity must be positive');
    }
    return this.updateQuantity(quantity, 'in', reason, performedBy);
  },

  /**
   * 消耗库存
   */
  async consume(quantity: number, reason: string, performedBy: string): Promise<IInventory> {
    if (quantity <= 0) {
      throw new Error('Consumption quantity must be positive');
    }
    return this.updateQuantity(quantity, 'out', reason, performedBy);
  },

  /**
   * 调整库存
   */
  async adjust(quantity: number, reason: string, performedBy: string): Promise<IInventory> {
    return this.updateQuantity(quantity, 'adjust', reason, performedBy);
  },

  /**
   * 转移库存
   */
  async transfer(quantity: number, reason: string, performedBy: string): Promise<IInventory> {
    if (quantity <= 0) {
      throw new Error('Transfer quantity must be positive');
    }
    return this.updateQuantity(quantity, 'transfer', reason, performedBy);
  }
};

// ============================================
// 静态方法
// ============================================

InventorySchema.statics = {
  /**
   * 按分类统计库存
   */
  async getStatsByCategory(): Promise<any[]> {
    return this.aggregate([
      {
        $group: {
          _id: '$category',
          totalQuantity: { $sum: '$quantity' },
          totalValue: { $sum: { $multiply: ['$quantity', '$price'] } },
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      },
      { $sort: { totalValue: -1 } }
    ]);
  },

  /**
   * 获取低库存物品
   */
  async getLowStockItems(threshold?: number): Promise<IInventory[]> {
    const query: any = {
      status: { $ne: 'discontinued' },
      $expr: { $lte: ['$quantity', '$minStock'] }
    };
    if (threshold !== undefined) {
      query.quantity = { $lte: threshold };
    }
    return this.find(query).sort({ quantity: 1 }).exec();
  },

  /**
   * 获取即将过期的物品
   */
  async getExpiringItems(days: number = 30): Promise<IInventory[]> {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() + days);
    return this.find({
      expiryDate: { $lte: threshold, $gte: new Date() },
      status: { $ne: 'discontinued' }
    }).sort({ expiryDate: 1 }).exec();
  },

  /**
   * 获取库存总价值
   */
  async getTotalInventoryValue(): Promise<number> {
    const result = await this.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ['$quantity', '$price'] } }
        }
      }
    ]);
    return result[0]?.totalValue || 0;
  },

  /**
   * 按供应商统计库存价值
   */
  async getValueBySupplier(): Promise<any[]> {
    return this.aggregate([
      {
        $group: {
          _id: '$supplier',
          totalValue: { $sum: { $multiply: ['$quantity', '$price'] } },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalValue: -1 } }
    ]);
  },

  /**
   * 获取库存报表
   */
  async getInventoryReport(): Promise<any> {
    return this.aggregate([
      {
        $facet: {
          summary: [
            {
              $group: {
                _id: null,
                totalItems: { $sum: 1 },
                totalQuantity: { $sum: '$quantity' },
                totalValue: { $sum: { $multiply: ['$quantity', '$price'] } },
                avgPrice: { $avg: '$price' }
              }
            }
          ],
          byStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],
          byCategory: [
            { $group: { _id: '$category', count: { $sum: 1 } } }
          ],
          lowStock: [
            { $match: { $expr: { $lte: ['$quantity', '$minStock'] } } },
            { $count: 'count' }
          ]
        }
      }
    ]);
  }
};

// ============================================
// 中间件（Hooks）
// ============================================

InventorySchema.pre('save', function(next) {
  // 自动生成编码
  if (!this.code) {
    const timestamp = Date.now().toString(36);
    const prefix = this.category.substring(0, 3).toUpperCase();
    this.code = `${prefix}-${timestamp}`;
  }

  // 自动计算状态
  this.status = this.calculateStatus();

  // 设置补货点
  if (!this.reorderPoint) {
    this.reorderPoint = this.minStock;
  }

  next();
});

InventorySchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

// ============================================
// 模型导出
// ============================================

export const InventoryModel = mongoose.model<IInventory>('Inventory', InventorySchema);

export default InventoryModel;