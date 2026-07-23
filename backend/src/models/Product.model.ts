import mongoose, { Schema, Document } from 'mongoose';

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
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  productCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  subCategory: { type: String },
  brand: { type: String },
  unit: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  costPrice: { type: Number, min: 0 },
  wholesalePrice: { type: Number, min: 0 },
  minStock: { type: Number, default: 0 },
  maxStock: { type: Number, default: 999 },
  currentStock: { type: Number, default: 0 },
  weight: { type: Number, min: 0 },
  dimensions: {
    length: { type: Number, min: 0 },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 }
  },
  images: [{ type: String }],
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'discontinued'],
    default: 'active'
  },
  tags: [{ type: String }],
  specifications: { type: Map, of: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const ProductModel = mongoose.model<IProduct>('Product', ProductSchema);
