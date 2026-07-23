import mongoose, { Schema, Document } from 'mongoose';

export interface ISystemSetting extends Document {
  key: string;
  value: any;
  category: 'general' | 'email' | 'payment' | 'shipping' | 'tax' | 'security';
  description: string;
  isEncrypted: boolean;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICompanyInfo extends Document {
  companyName: string;
  legalName: string;
  taxId: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
  currency: string;
  timezone: string;
  fiscalYearStart: Date;
  fiscalYearEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEmailConfig extends Document {
  provider: 'smtp' | 'sendgrid' | 'aws';
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
  testEmail: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SystemSettingSchema = new Schema<ISystemSetting>({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, required: true },
  category: {
    type: String,
    enum: ['general', 'email', 'payment', 'shipping', 'tax', 'security'],
    required: true
  },
  description: { type: String },
  isEncrypted: { type: Boolean, default: false },
  updatedBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const CompanyInfoSchema = new Schema<ICompanyInfo>({
  companyName: { type: String, required: true },
  legalName: { type: String },
  taxId: { type: String },
  address: { type: String },
  city: { type: String },
  province: { type: String },
  postalCode: { type: String },
  country: { type: String, default: 'China' },
  phone: { type: String },
  email: { type: String },
  website: { type: String },
  logo: { type: String },
  currency: { type: String, default: 'CNY' },
  timezone: { type: String, default: 'Asia/Shanghai' },
  fiscalYearStart: { type: Date },
  fiscalYearEnd: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const EmailConfigSchema = new Schema<IEmailConfig>({
  provider: {
    type: String,
    enum: ['smtp', 'sendgrid', 'aws'],
    required: true
  },
  host: { type: String },
  port: { type: Number },
  secure: { type: Boolean, default: true },
  username: { type: String },
  password: { type: String },
  fromEmail: { type: String, required: true },
  fromName: { type: String, required: true },
  testEmail: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const SystemSettingModel = mongoose.model<ISystemSetting>('SystemSetting', SystemSettingSchema);
export const CompanyInfoModel = mongoose.model<ICompanyInfo>('CompanyInfo', CompanyInfoSchema);
export const EmailConfigModel = mongoose.model<IEmailConfig>('EmailConfig', EmailConfigSchema);
