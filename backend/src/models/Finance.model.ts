import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  transactionNo: string;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  subCategory: string;
  amount: number;
  currency: string;
  description: string;
  reference: string;
  referenceType: string;
  accountId: string;
  accountName: string;
  customerId: string;
  supplierId: string;
  transactionDate: Date;
  status: 'pending' | 'completed' | 'cancelled';
  attachments: string[];
  createdBy: string;
  approvedBy: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
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
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  transactionNo: { type: String, required: true, unique: true },
  type: { type: String, enum: ['income', 'expense', 'transfer'], required: true },
  category: { type: String, required: true },
  subCategory: { type: String },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'CNY' },
  description: { type: String, required: true },
  reference: { type: String },
  referenceType: { type: String },
  accountId: { type: String, required: true },
  accountName: { type: String, required: true },
  customerId: { type: String },
  supplierId: { type: String },
  transactionDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
  attachments: [{ type: String }],
  createdBy: { type: String, required: true },
  approvedBy: { type: String },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const AccountSchema = new Schema<IAccount>({
  accountCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['asset', 'liability', 'equity', 'revenue', 'expense'], required: true },
  balance: { type: Number, default: 0 },
  currency: { type: String, default: 'CNY' },
  parentAccountId: { type: String },
  description: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const TransactionModel = mongoose.model<ITransaction>('Transaction', TransactionSchema);
export const AccountModel = mongoose.model<IAccount>('Account', AccountSchema);
