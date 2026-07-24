/**
 * Finance Model - 财务数据模型
 * 提供交易、账户的完整 Schema 定义、验证、索引和业务方法
 */

import mongoose, { Schema, Document, Types } from 'mongoose';

// ============================================
// 类型定义
// ============================================

export interface ITransaction extends Document {
  transactionNo: string;
  type: 'income' | 'expense' | 'transfer' | 'adjustment';
  category: string;
  subCategory: string;
  amount: number;
  currency: string;
  exchangeRate: number;
  description: string;
  reference: string;
  referenceType: string;
  accountId: string;
  accountName: string;
  customerId: string;
  supplierId: string;
  transactionDate: Date;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  attachments: string[];
  createdBy: string;
  approvedBy: string;
  approvedAt: Date;
  notes: string;
  createdAt: Date;
  updatedAt: Date;

  // 实例方法
  getFormattedAmount(): string;
  isCompleted(): boolean;
  isCancelled(): boolean;
  canApprove(): boolean;
  canCancel(): boolean;
  approve(approverId: string): Promise<ITransaction>;
  cancel(reason: string): Promise<ITransaction>;
}

export interface IAccount extends Document {
  accountCode: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  balance: number;
  currency: string;
  parentAccountId: string;
  description: string;
  status: 'active' | 'inactive';
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;

  // 实例方法
  getBalance(): number;
  updateBalance(amount: number): Promise<IAccount>;
  getChildAccounts(): Promise<IAccount[]>;
}

// ============================================
// Transaction Schema
// ============================================

const TransactionSchema = new Schema<ITransaction>({
  transactionNo: {
    type: String,
    required: true,
    unique: true,
    index: true,
    uppercase: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['income', 'expense', 'transfer', 'adjustment'],
    required: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  subCategory: { type: String },
  amount: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function(value: number) {
        return value > 0;
      },
      message: 'Amount must be greater than 0'
    }
  },
  currency: { type: String, default: 'SAR', uppercase: true, trim: true },
  exchangeRate: { type: Number, default: 1, min: 0 },
  description: { type: String, required: true, trim: true },
  reference: { type: String, trim: true },
  referenceType: { type: String, trim: true },
  accountId: { type: String, required: true, index: true },
  accountName: { type: String, required: true },
  customerId: { type: String, index: true },
  supplierId: { type: String, index: true },
  transactionDate: { type: Date, default: Date.now, index: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'completed', 'cancelled'],
    default: 'pending',
    index: true
  },
  attachments: [{ type: String }],
  createdBy: { type: String, required: true },
  approvedBy: { type: String },
  approvedAt: { type: Date },
  notes: { type: String, trim: true }
}, {
  timestamps: true,
  collection: 'transactions'
});

// ============================================
// Transaction 索引
// ============================================

TransactionSchema.index({ transactionDate: -1, type: 1 });
TransactionSchema.index({ customerId: 1, transactionDate: -1 });
TransactionSchema.index({ accountId: 1, transactionDate: -1 });
TransactionSchema.index({ status: 1, transactionDate: -1 });

// ============================================
// Transaction 实例方法
// ============================================

TransactionSchema.methods = {
  /**
   * 获取格式化金额
   */
  getFormattedAmount(): string {
    return `${this.currency} ${this.amount.toFixed(2)}`;
  },

  /**
   * 检查是否已完成
   */
  isCompleted(): boolean {
    return this.status === 'completed';
  },

  /**
   * 检查是否已取消
   */
  isCancelled(): boolean {
    return this.status === 'cancelled';
  },

  /**
   * 检查是否可以审批
   */
  canApprove(): boolean {
    return this.status === 'pending';
  },

  /**
   * 检查是否可以取消
   */
  canCancel(): boolean {
    return this.status === 'pending' || this.status === 'approved';
  },

  /**
   * 审批交易
   */
  async approve(approverId: string): Promise<ITransaction> {
    if (!this.canApprove()) {
      throw new Error(`Cannot approve transaction with status: ${this.status}`);
    }
    this.status = 'approved';
    this.approvedBy = approverId;
    this.approvedAt = new Date();
    return this.save();
  },

  /**
   * 取消交易
   */
  async cancel(reason: string): Promise<ITransaction> {
    if (!this.canCancel()) {
      throw new Error(`Cannot cancel transaction with status: ${this.status}`);
    }
    this.status = 'cancelled';
    this.notes = this.notes ? `${this.notes}\nCancelled: ${reason}` : `Cancelled: ${reason}`;
    return this.save();
  },

  /**
   * 完成交易
   */
  async complete(): Promise<ITransaction> {
    if (this.status !== 'approved') {
      throw new Error('Only approved transactions can be completed');
    }
    this.status = 'completed';
    return this.save();
  }
};

// ============================================
// Transaction 静态方法
// ============================================

TransactionSchema.statics = {
  /**
   * 按类型统计
   */
  async countByType(): Promise<Record<string, number>> {
    const result = await this.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    return result.reduce((acc: any, item: any) => {
      acc[item._id] = item.count;
      return acc;
    }, {});
  },

  /**
   * 获取收入汇总
   */
  async getRevenueSummary(startDate: Date, endDate: Date): Promise<any> {
    return this.aggregate([
      {
        $match: {
          transactionDate: { $gte: startDate, $lte: endDate },
          type: 'income',
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          average: { $avg: '$amount' }
        }
      }
    ]);
  },

  /**
   * 获取支出汇总（按分类）
   */
  async getExpenseByCategory(startDate: Date, endDate: Date): Promise<any[]> {
    return this.aggregate([
      {
        $match: {
          transactionDate: { $gte: startDate, $lte: endDate },
          type: 'expense',
          status: 'completed'
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);
  }
};

// ============================================
// Account Schema
// ============================================

const AccountSchema = new Schema<IAccount>({
  accountCode: {
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
    index: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['asset', 'liability', 'equity', 'revenue', 'expense'],
    required: true,
    index: true
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  currency: { type: String, default: 'SAR', uppercase: true, trim: true },
  parentAccountId: { type: String, index: true },
  description: { type: String, trim: true },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
    index: true
  },
  isSystem: { type: Boolean, default: false }
}, {
  timestamps: true,
  collection: 'accounts'
});

// ============================================
// Account 索引
// ============================================

AccountSchema.index({ type: 1, status: 1 });
AccountSchema.index({ parentAccountId: 1 });

// ============================================
// Account 虚拟字段
// ============================================

AccountSchema.virtual('isActive').get(function(this: IAccount) {
  return this.status === 'active';
});

// ============================================
// Account 实例方法
// ============================================

AccountSchema.methods = {
  /**
   * 获取余额
   */
  getBalance(): number {
    return this.balance;
  },

  /**
   * 更新余额
   */
  async updateBalance(amount: number): Promise<IAccount> {
    this.balance = Math.max(0, this.balance + amount);
    return this.save();
  },

  /**
   * 获取子账户
   */
  async getChildAccounts(): Promise<IAccount[]> {
    return (this.constructor as any).find({ parentAccountId: this._id }).exec();
  }
};

// ============================================
// Account 静态方法
// ============================================

AccountSchema.statics = {
  /**
   * 按类型获取余额
   */
  async getBalanceByType(): Promise<any[]> {
    return this.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$type',
          totalBalance: { $sum: '$balance' },
          count: { $sum: 1 }
        }
      }
    ]);
  },

  /**
   * 获取账户树
   */
  async getAccountTree(): Promise<any[]> {
    return this.aggregate([
      { $match: { status: 'active' } },
      {
        $graphLookup: {
          from: 'accounts',
          startWith: '$_id',
          connectFromField: '_id',
          connectToField: 'parentAccountId',
          as: 'children',
          maxDepth: 5
        }
      },
      { $match: { parentAccountId: null } }
    ]);
  }
};

// ============================================
// Account 中间件
// ============================================

AccountSchema.pre('save', function(next) {
  if (!this.accountCode) {
    const timestamp = Date.now().toString(36);
    const prefix = this.type.substring(0, 3).toUpperCase();
    this.accountCode = `${prefix}-${timestamp}`;
  }
  next();
});

// ============================================
// 模型导出
// ============================================

export const TransactionModel = mongoose.model<ITransaction>('Transaction', TransactionSchema);
export const AccountModel = mongoose.model<IAccount>('Account', AccountSchema);

export default {
  TransactionModel,
  AccountModel
};