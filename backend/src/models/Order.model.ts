/**
 * Order Model - 订单数据模型
 * 提供完整的订单 Schema 定义、验证、索引和业务方法
 */

import mongoose, { Schema, Document, Types } from 'mongoose';

// ============================================
// 类型定义
// ============================================

export interface IOrderItem {
  productId: string;
  productName: string;
  productCode: string;
  quantity: number;
  price: number;
  discount: number;
  total: number;
  subtotal: number;
  tax: number;
  variant: string;
  notes: string;
}

export interface IOrder extends Document {
  orderNo: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shippingCost: number;
  totalAmount: number;
  finalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid' | 'partial' | 'refunded';
  paymentMethod: 'cash' | 'credit_card' | 'bank_transfer' | 'online';
  shippingAddress: string;
  billingAddress: string;
  shippingMethod: string;
  trackingNumber: string;
  notes: string;
  createdBy: string;
  approvedBy: string;
  approvedAt: Date;
  cancelledAt: Date;
  cancellationReason: string;
  completedAt: Date;
  shippedAt: Date;
  deliveredAt: Date;
  createdAt: Date;
  updatedAt: Date;

  // 实例方法
  calculateTotals(): void;
  getSubtotal(): number;
  getTotal(): number;
  getDiscount(): number;
  getTax(): number;
  getShippingCost(): number;
  getFinalAmount(): number;
  canUpdate(): boolean;
  canCancel(): boolean;
  canShip(): boolean;
  canDeliver(): boolean;
  canComplete(): boolean;
  updateStatus(status: string, reason?: string): Promise<IOrder>;
  cancel(reason: string): Promise<IOrder>;
  ship(trackingNumber: string): Promise<IOrder>;
  deliver(): Promise<IOrder>;
  complete(): Promise<IOrder>;
  addItem(item: IOrderItem): Promise<IOrder>;
  removeItem(productId: string): Promise<IOrder>;
  updateItemQuantity(productId: string, quantity: number): Promise<IOrder>;
  getItemCount(): number;
  getTotalItems(): number;
}

// ============================================
// Schema 定义
// ============================================

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true, index: true },
  productName: { type: String, required: true },
  productCode: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  total: { type: Number, required: true, min: 0 },
  subtotal: { type: Number, required: true, min: 0 },
  tax: { type: Number, default: 0, min: 0 },
  variant: { type: String },
  notes: { type: String }
}, { _id: true });

const OrderSchema = new Schema<IOrder>({
  orderNo: {
    type: String,
    required: true,
    unique: true,
    index: true,
    uppercase: true,
    trim: true
  },
  customerId: {
    type: String,
    required: true,
    index: true
  },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  items: [OrderItemSchema],
  subtotal: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  tax: { type: Number, default: 0, min: 0 },
  shippingCost: { type: Number, default: 0, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  finalAmount: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'],
    default: 'pending',
    index: true
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'partial', 'refunded'],
    default: 'unpaid',
    index: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit_card', 'bank_transfer', 'online'],
    required: true
  },
  shippingAddress: { type: String, required: true },
  billingAddress: { type: String, required: true },
  shippingMethod: { type: String, required: true },
  trackingNumber: { type: String },
  notes: { type: String },
  createdBy: { type: String, required: true },
  approvedBy: { type: String },
  approvedAt: { type: Date },
  cancelledAt: { type: Date },
  cancellationReason: { type: String },
  completedAt: { type: Date },
  shippedAt: { type: Date },
  deliveredAt: { type: Date }
}, {
  timestamps: true,
  collection: 'orders',
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ============================================
// 虚拟字段
// ============================================

OrderSchema.virtual('itemCount').get(function(this: IOrder) {
  return this.items.length;
});

OrderSchema.virtual('totalItems').get(function(this: IOrder) {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

OrderSchema.virtual('isProcessing').get(function(this: IOrder) {
  return this.status === 'processing';
});

// ============================================
// 索引定义
// ============================================

OrderSchema.index({ customerId: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ orderNo: 1 });
OrderSchema.index({ 'items.productId': 1 });

// ============================================
// 实例方法
// ============================================

OrderSchema.methods = {
  /**
   * 计算订单总计
   */
  calculateTotals(): void {
    this.subtotal = this.getSubtotal();
    this.totalAmount = this.subtotal + this.getTax() + this.getShippingCost();
    this.finalAmount = this.totalAmount - this.getDiscount();
  },

  /**
   * 获取小计
   */
  getSubtotal(): number {
    return this.items.reduce((sum, item) => sum + item.subtotal, 0);
  },

  /**
   * 获取总计
   */
  getTotal(): number {
    return this.totalAmount;
  },

  /**
   * 获取折扣
   */
  getDiscount(): number {
    return this.discount + this.items.reduce((sum, item) => sum + item.discount, 0);
  },

  /**
   * 获取税费
   */
  getTax(): number {
    return this.tax + this.items.reduce((sum, item) => sum + item.tax, 0);
  },

  /**
   * 获取运费
   */
  getShippingCost(): number {
    return this.shippingCost;
  },

  /**
   * 获取最终金额
   */
  getFinalAmount(): number {
    return this.finalAmount;
  },

  /**
   * 检查是否可以更新
   */
  canUpdate(): boolean {
    return this.status === 'pending' || this.status === 'processing';
  },

  /**
   * 检查是否可以取消
   */
  canCancel(): boolean {
    return this.status !== 'completed' && this.status !== 'cancelled';
  },

  /**
   * 检查是否可以发货
   */
  canShip(): boolean {
    return this.status === 'processing';
  },

  /**
   * 检查是否可以交付
   */
  canDeliver(): boolean {
    return this.status === 'shipped';
  },

  /**
   * 检查是否可以完成
   */
  canComplete(): boolean {
    return this.status === 'delivered';
  },

  /**
   * 更新订单状态
   */
  async updateStatus(status: string, reason?: string): Promise<IOrder> {
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }

    // 状态流转验证
    const statusFlow: Record<string, string[]> = {
      pending: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered', 'cancelled'],
      delivered: ['completed', 'cancelled'],
      completed: [],
      cancelled: ['pending']
    };

    if (!statusFlow[this.status].includes(status)) {
      throw new Error(`Cannot transition from ${this.status} to ${status}`);
    }

    const oldStatus = this.status;
    this.status = status as any;

    // 记录状态变更时间
    switch (status) {
      case 'cancelled':
        this.cancelledAt = new Date();
        if (reason) this.cancellationReason = reason;
        break;
      case 'completed':
        this.completedAt = new Date();
        break;
      case 'shipped':
        this.shippedAt = new Date();
        break;
      case 'delivered':
        this.deliveredAt = new Date();
        break;
    }

    return this.save();
  },

  /**
   * 取消订单
   */
  async cancel(reason: string): Promise<IOrder> {
    if (!this.canCancel()) {
      throw new Error(`Cannot cancel order with status: ${this.status}`);
    }
    return this.updateStatus('cancelled', reason);
  },

  /**
   * 发货
   */
  async ship(trackingNumber: string): Promise<IOrder> {
    if (!this.canShip()) {
      throw new Error(`Cannot ship order with status: ${this.status}`);
    }
    this.trackingNumber = trackingNumber;
    return this.updateStatus('shipped');
  },

  /**
   * 交付
   */
  async deliver(): Promise<IOrder> {
    if (!this.canDeliver()) {
      throw new Error(`Cannot deliver order with status: ${this.status}`);
    }
    return this.updateStatus('delivered');
  },

  /**
   * 完成订单
   */
  async complete(): Promise<IOrder> {
    if (!this.canComplete()) {
      throw new Error(`Cannot complete order with status: ${this.status}`);
    }
    return this.updateStatus('completed');
  },

  /**
   * 添加订单项
   */
  async addItem(item: IOrderItem): Promise<IOrder> {
    if (!this.canUpdate()) {
      throw new Error(`Cannot add items to order with status: ${this.status}`);
    }
    this.items.push(item);
    this.calculateTotals();
    return this.save();
  },

  /**
   * 删除订单项
   */
  async removeItem(productId: string): Promise<IOrder> {
    if (!this.canUpdate()) {
      throw new Error(`Cannot remove items from order with status: ${this.status}`);
    }
    this.items = this.items.filter(item => item.productId !== productId);
    this.calculateTotals();
    return this.save();
  },

  /**
   * 更新订单项数量
   */
  async updateItemQuantity(productId: string, quantity: number): Promise<IOrder> {
    if (!this.canUpdate()) {
      throw new Error(`Cannot update items in order with status: ${this.status}`);
    }
    const item = this.items.find(i => i.productId === productId);
    if (!item) {
      throw new Error(`Product ${productId} not found in order`);
    }
    item.quantity = quantity;
    item.subtotal = item.quantity * item.price;
    this.calculateTotals();
    return this.save();
  },

  /**
   * 获取物品数量
   */
  getItemCount(): number {
    return this.items.length;
  },

  /**
   * 获取总物品数
   */
  getTotalItems(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }
};

// ============================================
// 静态方法
// ============================================

OrderSchema.statics = {
  /**
   * 按状态统计订单数
   */
  async countByStatus(): Promise<Record<string, number>> {
    const result = await this.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    return result.reduce((acc: any, item: any) => {
      acc[item._id] = item.count;
      return acc;
    }, {});
  },

  /**
   * 获取今日订单统计
   */
  async getTodayStats(): Promise<any> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.aggregate([
      {
        $match: {
          createdAt: { $gte: today, $lt: tomorrow },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$finalAmount' },
          avgAmount: { $avg: '$finalAmount' }
        }
      }
    ]);
  },

  /**
   * 获取客户订单统计
   */
  async getCustomerStats(customerId: string): Promise<any> {
    return this.aggregate([
      { $match: { customerId } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$finalAmount' },
          avgAmount: { $avg: '$finalAmount' },
          completedOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      }
    ]);
  },

  /**
   * 获取月度统计
   */
  async getMonthlyStats(year: number): Promise<any[]> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    return this.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: { month: { $month: '$createdAt' } },
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$finalAmount' },
          avgAmount: { $avg: '$finalAmount' }
        }
      },
      { $sort: { '_id.month': 1 } }
    ]);
  }
};

// ============================================
// 中间件（Hooks）
// ============================================

OrderSchema.pre('save', function(next) {
  if (!this.orderNo) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.orderNo = `ORD-${year}${month}${day}-${random}`;
  }

  // 自动计算金额
  this.calculateTotals();

  next();
});

OrderSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

// ============================================
// 模型导出
// ============================================

export const OrderModel = mongoose.model<IOrder>('Order', OrderSchema);

export default OrderModel;