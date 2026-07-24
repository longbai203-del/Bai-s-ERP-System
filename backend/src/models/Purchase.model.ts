/**
 * Purchase Model - 采购数据模型
 * 提供完整的采购订单、采购申请 Schema 定义、验证、索引和业务方法
 */

import mongoose, { Schema, Document, Types } from 'mongoose';

// ============================================
// 类型定义
// ============================================

export interface IPurchaseItem {
  productId: string;
  productName: string;
  productCode: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  receivedQuantity: number;
  pendingQuantity: number;
  notes: string;
}

export interface IPurchaseOrder extends Document {
  poNo: string;
  supplierId: string;
  supplierName: string;
  supplierEmail: string;
  supplierPhone: string;
  items: IPurchaseItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shippingCost: number;
  totalAmount: number;
  finalAmount: number;
  status: 'draft' | 'sent' | 'confirmed' | 'shipped' | 'received' | 'completed' | 'cancelled';
  expectedDelivery: Date;
  actualDelivery: Date;
  paymentTerms: string;
  shippingAddress: string;
  billingAddress: string;
  notes: string;
  createdBy: string;
  approvedBy: string;
  approvedAt: Date;
  receivedBy: string;
  receivedAt: Date;
  cancellationReason: string;
  createdAt: Date;
  updatedAt: Date;

  // 实例方法
  calculateTotals(): void;
  getSubtotal(): number;
  getTotal(): number;
  getFinalAmount(): number;
  canApprove(): boolean;
  canSend(): boolean;
  canConfirm(): boolean;
  canReceive(): boolean;
  canComplete(): boolean;
  canCancel(): boolean;
  approve(approverId: string): Promise<IPurchaseOrder>;
  send(): Promise<IPurchaseOrder>;
  confirm(): Promise<IPurchaseOrder>;
  receive(receivedBy: string): Promise<IPurchaseOrder>;
  complete(): Promise<IPurchaseOrder>;
  cancel(reason: string): Promise<IPurchaseOrder>;
  getPendingItems(): IPurchaseItem[];
  getReceivedItems(): IPurchaseItem[];
  getCompletionRate(): number;
  isFullyReceived(): boolean;
}

export interface IPurchaseRequisition extends Document {
  prNo: string;
  department: string;
  requestedBy: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unit: string;
    reason: string;
    estimatedPrice: number;
    total: number;
  }[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'rejected' | 'converted';
  approvedBy: string;
  approvedAt: Date;
  rejectionReason: string;
  convertedTo: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;

  // 实例方法
  canApprove(): boolean;
  canReject(): boolean;
  canConvert(): boolean;
  approve(approverId: string): Promise<IPurchaseRequisition>;
  reject(reason: string): Promise<IPurchaseRequisition>;
  convert(poNo: string): Promise<IPurchaseRequisition>;
  getTotalEstimatedCost(): number;
  getItemCount(): number;
}

// ============================================
// Purchase Order Schema
// ============================================

const PurchaseItemSchema = new Schema<IPurchaseItem>({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  productCode: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  total: { type: Number, required: true, min: 0 },
  receivedQuantity: { type: Number, default: 0, min: 0 },
  pendingQuantity: { type: Number, default: 0, min: 0 },
  notes: { type: String }
}, { _id: true });

const PurchaseOrderSchema = new Schema<IPurchaseOrder>({
  poNo: {
    type: String,
    required: true,
    unique: true,
    index: true,
    uppercase: true,
    trim: true
  },
  supplierId: { type: String, required: true, index: true },
  supplierName: { type: String, required: true },
  supplierEmail: { type: String },
  supplierPhone: { type: String },
  items: [PurchaseItemSchema],
  subtotal: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  tax: { type: Number, default: 0, min: 0 },
  shippingCost: { type: Number, default: 0, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  finalAmount: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ['draft', 'sent', 'confirmed', 'shipped', 'received', 'completed', 'cancelled'],
    default: 'draft',
    index: true
  },
  expectedDelivery: { type: Date },
  actualDelivery: { type: Date },
  paymentTerms: { type: String },
  shippingAddress: { type: String },
  billingAddress: { type: String },
  notes: { type: String },
  createdBy: { type: String, required: true },
  approvedBy: { type: String },
  approvedAt: { type: Date },
  receivedBy: { type: String },
  receivedAt: { type: Date },
  cancellationReason: { type: String }
}, {
  timestamps: true,
  collection: 'purchase_orders',
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ============================================
// Purchase Order 虚拟字段
// ============================================

PurchaseOrderSchema.virtual('totalItems').get(function(this: IPurchaseOrder) {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

PurchaseOrderSchema.virtual('totalReceived').get(function(this: IPurchaseOrder) {
  return this.items.reduce((sum, item) => sum + item.receivedQuantity, 0);
});

PurchaseOrderSchema.virtual('completionRate').get(function(this: IPurchaseOrder) {
  if (this.totalItems === 0) return 0;
  return (this.totalReceived / this.totalItems) * 100;
});

// ============================================
// Purchase Order 索引
// ============================================

PurchaseOrderSchema.index({ supplierId: 1, createdAt: -1 });
PurchaseOrderSchema.index({ status: 1, createdAt: -1 });
PurchaseOrderSchema.index({ expectedDelivery: 1 });
PurchaseOrderSchema.index({ createdAt: -1 });

// ============================================
// Purchase Order 实例方法
// ============================================

PurchaseOrderSchema.methods = {
  /**
   * 计算总计
   */
  calculateTotals(): void {
    this.subtotal = this.getSubtotal();
    this.totalAmount = this.subtotal + this.tax + this.shippingCost;
    this.finalAmount = this.totalAmount - this.discount;

    // 计算每个项目的 pending 数量
    this.items.forEach(item => {
      item.pendingQuantity = item.quantity - item.receivedQuantity;
    });
  },

  /**
   * 获取小计
   */
  getSubtotal(): number {
    return this.items.reduce((sum, item) => sum + item.total, 0);
  },

  /**
   * 获取总计
   */
  getTotal(): number {
    return this.totalAmount;
  },

  /**
   * 获取最终金额
   */
  getFinalAmount(): number {
    return this.finalAmount;
  },

  /**
   * 检查是否可以审批
   */
  canApprove(): boolean {
    return this.status === 'draft';
  },

  /**
   * 检查是否可以发送
   */
  canSend(): boolean {
    return this.status === 'draft' || this.status === 'confirmed';
  },

  /**
   * 检查是否可以确认
   */
  canConfirm(): boolean {
    return this.status === 'sent';
  },

  /**
   * 检查是否可以收货
   */
  canReceive(): boolean {
    return this.status === 'shipped';
  },

  /**
   * 检查是否可以完成
   */
  canComplete(): boolean {
    return this.status === 'received' && this.isFullyReceived();
  },

  /**
   * 检查是否可以取消
   */
  canCancel(): boolean {
    return this.status !== 'completed' && this.status !== 'cancelled';
  },

  /**
   * 审批采购订单
   */
  async approve(approverId: string): Promise<IPurchaseOrder> {
    if (!this.canApprove()) {
      throw new Error(`Cannot approve purchase order with status: ${this.status}`);
    }
    this.status = 'confirmed';
    this.approvedBy = approverId;
    this.approvedAt = new Date();
    return this.save();
  },

  /**
   * 发送采购订单
   */
  async send(): Promise<IPurchaseOrder> {
    if (!this.canSend()) {
      throw new Error(`Cannot send purchase order with status: ${this.status}`);
    }
    this.status = 'sent';
    return this.save();
  },

  /**
   * 确认采购订单
   */
  async confirm(): Promise<IPurchaseOrder> {
    if (!this.canConfirm()) {
      throw new Error(`Cannot confirm purchase order with status: ${this.status}`);
    }
    this.status = 'confirmed';
    return this.save();
  },

  /**
   * 收货
   */
  async receive(receivedBy: string): Promise<IPurchaseOrder> {
    if (!this.canReceive()) {
      throw new Error(`Cannot receive purchase order with status: ${this.status}`);
    }
    this.status = 'received';
    this.receivedBy = receivedBy;
    this.receivedAt = new Date();
    this.actualDelivery = new Date();

    // 更新收货数量
    this.items.forEach(item => {
      item.receivedQuantity = item.quantity;
      item.pendingQuantity = 0;
    });

    return this.save();
  },

  /**
   * 完成采购订单
   */
  async complete(): Promise<IPurchaseOrder> {
    if (!this.canComplete()) {
      throw new Error(`Cannot complete purchase order with status: ${this.status}`);
    }
    this.status = 'completed';
    return this.save();
  },

  /**
   * 取消采购订单
   */
  async cancel(reason: string): Promise<IPurchaseOrder> {
    if (!this.canCancel()) {
      throw new Error(`Cannot cancel purchase order with status: ${this.status}`);
    }
    this.status = 'cancelled';
    this.cancellationReason = reason;
    return this.save();
  },

  /**
   * 获取待收货项目
   */
  getPendingItems(): IPurchaseItem[] {
    return this.items.filter(item => item.pendingQuantity > 0);
  },

  /**
   * 获取已收货项目
   */
  getReceivedItems(): IPurchaseItem[] {
    return this.items.filter(item => item.receivedQuantity > 0);
  },

  /**
   * 获取完成率
   */
  getCompletionRate(): number {
    if (this.items.length === 0) return 0;
    const total = this.items.reduce((sum, item) => sum + item.quantity, 0);
    const received = this.items.reduce((sum, item) => sum + item.receivedQuantity, 0);
    return (received / total) * 100;
  },

  /**
   * 检查是否已全部收货
   */
  isFullyReceived(): boolean {
    return this.items.every(item => item.receivedQuantity >= item.quantity);
  }
};

// ============================================
// Purchase Order 静态方法
// ============================================

PurchaseOrderSchema.statics = {
  /**
   * 按状态统计
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
   * 获取待处理采购订单
   */
  async getPendingOrders(): Promise<IPurchaseOrder[]> {
    return this.find({
      status: { $in: ['draft', 'sent', 'confirmed', 'shipped'] }
    }).sort({ createdAt: 1 }).exec();
  },

  /**
   * 获取即将到货的采购订单
   */
  async getUpcomingDeliveries(days: number = 7): Promise<IPurchaseOrder[]> {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() + days);
    return this.find({
      status: { $in: ['confirmed', 'shipped'] },
      expectedDelivery: { $lte: threshold, $gte: new Date() }
    }).sort({ expectedDelivery: 1 }).exec();
  },

  /**
   * 获取采购统计
   */
  async getPurchaseStats(startDate: Date, endDate: Date): Promise<any> {
    return this.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: { $in: ['completed', 'received'] }
        }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$finalAmount' },
          avgAmount: { $avg: '$finalAmount' },
          totalItems: { $sum: { $sum: '$items.quantity' } }
        }
      }
    ]);
  }
};

// ============================================
// Purchase Order 中间件
// ============================================

PurchaseOrderSchema.pre('save', function(next) {
  if (!this.poNo) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.poNo = `PO-${year}${month}-${random}`;
  }

  this.calculateTotals();
  next();
});

// ============================================
// Purchase Requisition Schema
// ============================================

const RequisitionItemSchema = new Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unit: { type: String, required: true },
  reason: { type: String },
  estimatedPrice: { type: Number, default: 0, min: 0 },
  total: { type: Number, default: 0, min: 0 }
}, { _id: true });

const PurchaseRequisitionSchema = new Schema<IPurchaseRequisition>({
  prNo: {
    type: String,
    required: true,
    unique: true,
    index: true,
    uppercase: true,
    trim: true
  },
  department: { type: String, required: true, index: true },
  requestedBy: { type: String, required: true },
  items: [RequisitionItemSchema],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'converted'],
    default: 'pending',
    index: true
  },
  approvedBy: { type: String },
  approvedAt: { type: Date },
  rejectionReason: { type: String },
  convertedTo: { type: String },
  notes: { type: String }
}, {
  timestamps: true,
  collection: 'purchase_requisitions'
});

// ============================================
// Purchase Requisition 实例方法
// ============================================

PurchaseRequisitionSchema.methods = {
  /**
   * 检查是否可以审批
   */
  canApprove(): boolean {
    return this.status === 'pending';
  },

  /**
   * 检查是否可以拒绝
   */
  canReject(): boolean {
    return this.status === 'pending';
  },

  /**
   * 检查是否可以转换
   */
  canConvert(): boolean {
    return this.status === 'approved';
  },

  /**
   * 审批采购申请
   */
  async approve(approverId: string): Promise<IPurchaseRequisition> {
    if (!this.canApprove()) {
      throw new Error(`Cannot approve requisition with status: ${this.status}`);
    }
    this.status = 'approved';
    this.approvedBy = approverId;
    this.approvedAt = new Date();
    return this.save();
  },

  /**
   * 拒绝采购申请
   */
  async reject(reason: string): Promise<IPurchaseRequisition> {
    if (!this.canReject()) {
      throw new Error(`Cannot reject requisition with status: ${this.status}`);
    }
    this.status = 'rejected';
    this.rejectionReason = reason;
    return this.save();
  },

  /**
   * 转换为采购订单
   */
  async convert(poNo: string): Promise<IPurchaseRequisition> {
    if (!this.canConvert()) {
      throw new Error(`Cannot convert requisition with status: ${this.status}`);
    }
    this.status = 'converted';
    this.convertedTo = poNo;
    return this.save();
  },

  /**
   * 获取总预估成本
   */
  getTotalEstimatedCost(): number {
    return this.items.reduce((sum, item) => sum + (item.estimatedPrice * item.quantity), 0);
  },

  /**
   * 获取项目数量
   */
  getItemCount(): number {
    return this.items.length;
  }
};

// ============================================
// Purchase Requisition 中间件
// ============================================

PurchaseRequisitionSchema.pre('save', function(next) {
  if (!this.prNo) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.prNo = `PR-${year}${month}-${random}`;
  }

  // 计算每个项目的总计
  this.items.forEach(item => {
    item.total = item.estimatedPrice * item.quantity;
  });

  next();
});

// ============================================
// 模型导出
// ============================================

export const PurchaseOrderModel = mongoose.model<IPurchaseOrder>('PurchaseOrder', PurchaseOrderSchema);
export const PurchaseRequisitionModel = mongoose.model<IPurchaseRequisition>('PurchaseRequisition', PurchaseRequisitionSchema);

export default {
  PurchaseOrderModel,
  PurchaseRequisitionModel
};