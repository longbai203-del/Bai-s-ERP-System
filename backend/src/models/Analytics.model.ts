import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  reportId: string;
  name: string;
  type: 'sales' | 'inventory' | 'finance' | 'hr' | 'custom' ;
  format: 'pdf' | 'excel' | 'csv' | 'json';
  parameters: Map<string, any>;
  data: Map<string, any>;
  generatedBy: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface IDashboard extends Document {
  name: string;
  layout: {
    widgets: {
      id: string;
      type: string;
      title: string;
      position: { x: number; y: number; w: number; h: number };
      config: Map<string, any>;
    }[];
  };
  isDefault: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>({
  reportId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['sales', 'inventory', 'finance', 'hr', 'custom'],
    required: true
  },
  format: { 
    type: String, 
    enum: ['pdf', 'excel', 'csv', 'json'],
    required: true
  },
  parameters: { type: Map, of: Schema.Types.Mixed },
  data: { type: Map, of: Schema.Types.Mixed },
  generatedBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }
});

const DashboardSchema = new Schema<IDashboard>({
  name: { type: String, required: true },
  layout: {
    widgets: [{
      id: { type: String, required: true },
      type: { type: String, required: true },
      title: { type: String, required: true },
      position: {
        x: { type: Number, required: true },
        y: { type: Number, required: true },
        w: { type: Number, required: true },
        h: { type: Number, required: true }
      },
      config: { type: Map, of: Schema.Types.Mixed }
    }]
  },
  isDefault: { type: Boolean, default: false },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const ReportModel = mongoose.model<IReport>('Report', ReportSchema);
export const DashboardModel = mongoose.model<IDashboard>('Dashboard', DashboardSchema);
