import mongoose, { Schema, Document } from 'mongoose';

export interface IPurchaseOrder extends Document {
  poNo: string;
  supplierId: string;
  supplierName: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  totalAmount: number;
  tax: number;
  shippingCost: number;
  finalAmount: number;
  status: 'draft' | 'sent' | 'confirmed' | 'shipped' | 'received' | 'cancelled';
  expectedDelivery: Date;
  actualDelivery: Date;
  paymentTerms: string;
  shippingAddress: string;
  notes: string;
  createdBy: string;
  approvedBy: string;
  createdAt: Date;
  updatedAt: Date;
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
  }[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'rejected' | 'converted';
  approvedBy: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const PurchaseOrderSchema = new Schema<IPurchaseOrder>({
  poNo: { type: String, required: true, unique: true },
  supplierId: { type: String, required: true },
  supplierName: { type: String, required: true },
  items: [{
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 }
  }],
  totalAmount: { type: Number, required: true, min: 0 },
  tax: { type: Number, default: 0 },
  shippingCost: { type: Number, default: 0 },
  finalAmount: { type: Number, required: true, min: 0 },
  status: { 
    type: String, 
    enum: ['draft', 'sent', 'confirmed', 'shipped', 'received', 'cancelled'],
    default: 'draft'
  },
  expectedDelivery: { type: Date },
  actualDelivery: { type: Date },
  paymentTerms: { type: String },
  shippingAddress: { type: String },
  notes: { type: String },
  createdBy: { type: String, required: true },
  approvedBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const PurchaseRequisitionSchema = new Schema<IPurchaseRequisition>({
  prNo: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  requestedBy: { type: String, required: true },
  items: [{
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, required: true },
    reason: { type: String }
  }],
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'converted'],
    default: 'pending'
  },
  approvedBy: { type: String },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const PurchaseOrderModel = mongoose.model<IPurchaseOrder>('PurchaseOrder', PurchaseOrderSchema);
export const PurchaseRequisitionModel = mongoose.model<IPurchaseRequisition>('PurchaseRequisition', PurchaseRequisitionSchema);
