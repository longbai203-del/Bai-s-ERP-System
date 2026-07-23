import mongoose, { Schema, Document } from 'mongoose';

export interface IInventory extends Document {
  name: string;
  code: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  supplier: string;
  warehouse: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  createdAt: Date;
  updatedAt: Date;
}

const InventorySchema = new Schema<IInventory>({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  unit: { type: String, required: true },
  price: { type: Number, required: true },
  supplier: { type: String, required: true },
  warehouse: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['in_stock', 'low_stock', 'out_of_stock'],
    default: 'out_of_stock'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const InventoryModel = mongoose.model<IInventory>('Inventory', InventorySchema);
