/**
 * Product Model - 产品数据模型
 * 提供完整的产品 Schema 定义、验证、索引和业务方法
 */

import mongoose, { Schema, Document, Types } from 'mongoose';

// ============================================
// 类型定义
// ============================================

export interface IProductVariant {
  name: string;
  sku: string;
  price: number;
  cost: number;
  stock: number;
  attributes: Map<string, any>;
  images: string[];
  isActive: boolean;
}

export interface IProduct extends Document {
  productCode: string;
  name: string;
  description: string;
  category: string;
  subCategory: string;
  brand: string;
  unit: string;
  price: number;
  costPrice: number;
  wholesalePrice: number;
  minStock: number;
  maxStock: number;
  currentStock: number;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  images: string[];
  status: 'active' | 'inactive' | 'discontinued';
  tags: string[];
  specifications: Map<string, any>;
  variants: IProductVariant[];
  rating: number;
  reviewCount: number;
  salesCount: number;
  revenueGenerated: number;
  lastSoldDate: Date;
  createdAt: Date;
  updatedAt: Date;

  // 实例方法
  getFullName(): string;
  getStockValue(): number;
  getProfitMargin(): number;
  getTotalStock(): number;
  isLowStock(): boolean;
  isOutOfStock(): boolean;
  isActive(): boolean;
  updateStock(quantity: number): Promise<IProduct>;
  updatePrice(price: number): Promise<IProduct>;
  addVariant(variant: IProductVariant): Promise<IProduct>;
  removeVariant(sku: string): Promise<IProduct>;
  getVariant(sku: string): IProductVariant | null;
  getVariantCount(): number;
  incrementSales(quantity: number, revenue: number): Promise<IProduct>;
  getAverageRating(): number;
  isDiscontinued(): boolean;
  canOrder(): boolean;
}

// ============================================
// Schema 定义
// ============================================

const ProductVariantSchema = new Schema<IProductVariant>({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  price: { type: Number, required: true, min: 0 },
  cost: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, default: 0, min: 0 },
  attributes: { type: Map, of: Schema.Types.Mixed, default: new Map() },
  images: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { _id: true });

const DimensionsSchema = new Schema({
  length: { type: Number, default: 0, min: 0 },
  width: { type: Number, default: 0, min: 0 },
  height: { type: Number, default: 0, min: 0 }
}, { _id: false });

const ProductSchema = new Schema<IProduct>({
  productCode: {
    type: String,
    required: true,
    unique: true,
    index: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: { type: String, trim: true },
  category: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  subCategory: { type: String, trim: true },
  brand: { type: String, index: true, trim: true },
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
  wholesalePrice: {
    type: Number,
    min: 0
  },
  minStock: {
    type: Number,
    default: 5,
    min: 0
  },
  maxStock: {
    type: Number,
    min: 0
  },
  currentStock: {
    type: Number,
    default: 0,
    min: 0
  },
  weight: { type: Number, min: 0 },
  dimensions: DimensionsSchema,
  images: [{ type: String }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'discontinued'],
    default: 'active',
    index: true
  },
  tags: [{ type: String, index: true }],
  specifications: { type: Map, of: Schema.Types.Mixed, default: new Map() },
  variants: [ProductVariantSchema],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0, min: 0 },
  salesCount: { type: Number, default: 0, min: 0 },
  revenueGenerated: { type: Number, default: 0, min: 0 },
  lastSoldDate: { type: Date }
}, {
  timestamps: true,
  collection: 'products',
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ============================================
// 虚拟字段
// ============================================

ProductSchema.virtual('stockValue').get(function(this: IProduct) {
  return this.currentStock * this.price;
});

ProductSchema.virtual('profitMargin').get(function(this: IProduct) {
  if (this.price === 0) return 0;
  return ((this.price - (this.costPrice || 0)) / this.price) * 100;
});

ProductSchema.virtual('totalVariants').get(function(this: IProduct) {
  return this.variants.length;
});

ProductSchema.virtual('activeVariants').get(function(this: IProduct) {
  return this.variants.filter(v => v.isActive).length;
});

// ============================================
// 索引定义
// ============================================

ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ category: 1, status: 1 });
ProductSchema.index({ brand: 1, status: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ currentStock: 1 });
ProductSchema.index({ salesCount: -1 });
ProductSchema.index({ rating: -1 });

// ============================================
// 实例方法
// ============================================

ProductSchema.methods = {
  /**
   * 获取完整名称
   */
  getFullName(): string {
    return `${this.name} (${this.productCode})`;
  },

  /**
   * 获取库存价值
   */
  getStockValue(): number {
    return this.currentStock * this.price;
  },

  /**
   * 获取利润率
   */
  getProfitMargin(): number {
    if (this.price === 0) return 0;
    return ((this.price - (this.costPrice || 0)) / this.price) * 100;
  },

  /**
   * 获取总库存（含变体）
   */
  getTotalStock(): number {
    const variantStock = this.variants.reduce((sum, v) => sum + v.stock, 0);
    return this.currentStock + variantStock;
  },

  /**
   * 检查是否低库存
   */
  isLowStock(): boolean {
    return this.currentStock <= this.minStock && this.status === 'active';
  },

  /**
   * 检查是否缺货
   */
  isOutOfStock(): boolean {
    return this.currentStock <= 0;
  },

  /**
   * 检查是否活跃
   */
  isActive(): boolean {
    return this.status === 'active';
  },

  /**
   * 检查是否已停产
   */
  isDiscontinued(): boolean {
    return this.status === 'discontinued';
  },

  /**
   * 检查是否可以下单
   */
  canOrder(): boolean {
    return this.isActive() && !this.isOutOfStock();
  },

  /**
   * 更新库存
   */
  async updateStock(quantity: number): Promise<IProduct> {
    if (this.status === 'discontinued') {
      throw new Error('Cannot update stock for discontinued product');
    }

    const newStock = this.currentStock + quantity;
    if (newStock < 0) {
      throw new Error(`Insufficient stock. Current: ${this.currentStock}, Requested: ${Math.abs(quantity)}`);
    }

    this.currentStock = newStock;
    return this.save();
  },

  /**
   * 更新价格
   */
  async updatePrice(price: number): Promise<IProduct> {
    if (price < 0) {
      throw new Error('Price must be positive');
    }
    this.price = price;
    return this.save();
  },

  /**
   * 添加变体
   */
  async addVariant(variant: IProductVariant): Promise<IProduct> {
    // 检查 SKU 是否已存在
    if (this.variants.some(v => v.sku === variant.sku)) {
      throw new Error(`Variant with SKU ${variant.sku} already exists`);
    }
    this.variants.push(variant);
    return this.save();
  },

  /**
   * 删除变体
   */
  async removeVariant(sku: string): Promise<IProduct> {
    this.variants = this.variants.filter(v => v.sku !== sku);
    return this.save();
  },

  /**
   * 获取变体
   */
  getVariant(sku: string): IProductVariant | null {
    return this.variants.find(v => v.sku === sku) || null;
  },

  /**
   * 获取变体数量
   */
  getVariantCount(): number {
    return this.variants.length;
  },

  /**
   * 增加销量
   */
  async incrementSales(quantity: number, revenue: number): Promise<IProduct> {
    this.salesCount += quantity;
    this.revenueGenerated += revenue;
    this.lastSoldDate = new Date();
    return this.save();
  },

  /**
   * 获取平均评分
   */
  getAverageRating(): number {
    return this.rating;
  },

  /**
   * 更新评分
   */
  async updateRating(newRating: number): Promise<IProduct> {
    const totalRating = this.rating * this.reviewCount;
    this.reviewCount += 1;
    this.rating = (totalRating + newRating) / this.reviewCount;
    return this.save();
  },

  /**
   * 计算变体总价值
   */
  getVariantsTotalValue(): number {
    return this.variants.reduce((sum, v) => sum + (v.stock * v.price), 0);
  },

  /**
   * 获取所有变体 SKU
   */
  getAllVariantSkus(): string[] {
    return this.variants.map(v => v.sku);
  }
};

// ============================================
// 静态方法
// ============================================

ProductSchema.statics = {
  /**
   * 按分类统计产品
   */
  async countByCategory(): Promise<any[]> {
    return this.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          avgStock: { $avg: '$currentStock' }
        }
      },
      { $sort: { count: -1 } }
    ]);
  },

  /**
   * 获取畅销产品
   */
  async getTopSelling(limit: number = 10): Promise<IProduct[]> {
    return this.find({ status: 'active' })
      .sort({ salesCount: -1 })
      .limit(limit)
      .exec();
  },

  /**
   * 获取低库存产品
   */
  async getLowStockProducts(threshold?: number): Promise<IProduct[]> {
    const query: any = { status: 'active' };
    if (threshold !== undefined) {
      query.currentStock = { $lte: threshold };
    } else {
      query.$expr = { $lte: ['$currentStock', '$minStock'] };
    }
    return this.find(query).sort({ currentStock: 1 }).exec();
  },

  /**
   * 获取产品统计
   */
  async getProductStats(): Promise<any> {
    return this.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          byStatus: [{ $group: { _id: '$status', count: { $sum: 1 } } }],
          stockStats: [{
            $group: {
              _id: null,
              totalStock: { $sum: '$currentStock' },
              totalValue: { $sum: { $multiply: ['$price', '$currentStock'] } },
              avgPrice: { $avg: '$price' }
            }
          }],
          lowStock: [
            { $match: { $expr: { $lte: ['$currentStock', '$minStock'] } } },
            { $count: 'count' }
          ]
        }
      }
    ]);
  },

  /**
   * 搜索产品
   */
  async searchProducts(keyword: string): Promise<IProduct[]> {
    return this.find({
      $text: { $search: keyword },
      status: 'active'
    }).exec();
  },

  /**
   * 获取产品及其变体统计
   */
  async getProductWithVariantStats(productId: string): Promise<any> {
    return this.aggregate([
      { $match: { _id: new Types.ObjectId(productId) } },
      {
        $project: {
          name: 1,
          productCode: 1,
          price: 1,
          currentStock: 1,
          variants: 1,
          variantCount: { $size: '$variants' },
          totalVariantStock: { $sum: '$variants.stock' },
          totalVariantValue: { $sum: { $multiply: ['$variants.stock', '$variants.price'] } }
        }
      }
    ]);
  }
};

// ============================================
// 中间件（Hooks）
// ============================================

ProductSchema.pre('save', function(next) {
  // 自动生成产品编码
  if (!this.productCode) {
    const timestamp = Date.now().toString(36);
    const prefix = this.category.substring(0, 3).toUpperCase();
    this.productCode = `${prefix}-${timestamp}`;
  }

  // 自动更新状态（如果库存为0且状态为active，变为inactive）
  if (this.currentStock <= 0 && this.status === 'active') {
    this.status = 'inactive';
  }

  next();
});

ProductSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

ProductSchema.pre('save', function(next) {
  // 确保变体 SKU 唯一
  const skus = new Set();
  for (const variant of this.variants) {
    if (skus.has(variant.sku)) {
      throw new Error(`Duplicate variant SKU: ${variant.sku}`);
    }
    skus.add(variant.sku);
  }
  next();
});

// ============================================
// 模型导出
// ============================================

export const ProductModel = mongoose.model<IProduct>('Product', ProductSchema);

export default ProductModel;