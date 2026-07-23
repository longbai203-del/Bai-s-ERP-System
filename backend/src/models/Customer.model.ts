import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  customerCode: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  type: 'individual' | 'company';
  taxId: string;
  creditLimit: number;
  currentBalance: number;
  status: 'active' | 'inactive' | 'blocked';
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>({
  customerCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String },
  city: { type: String },
  province: { type: String },
  postalCode: { type: String },
  country: { type: String, default: 'China' },
  type: { type: String, enum: ['individual', 'company'], default: 'individual' },
  taxId: { type: String },
  creditLimit: { type: Number, default: 0 },
  currentBalance: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive', 'blocked'], default: 'active' },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const CustomerModel = mongoose.model<ICustomer>('Customer', CustomerSchema);
