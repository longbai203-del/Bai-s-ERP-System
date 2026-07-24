/**
 * HR Model - 人力资源数据模型
 * 提供员工、考勤、请假的完整 Schema 定义、验证、索引和业务方法
 */

import mongoose, { Schema, Document, Types } from 'mongoose';

// ============================================
// 类型定义
// ============================================

export interface IEmployee extends Document {
  employeeNo: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  title: string;
  supervisorId: string;
  hireDate: Date;
  salary: number;
  bankAccount: string;
  status: 'active' | 'inactive' | 'on_leave' | 'terminated';
  address: string;
  city: string;
  province: string;
  postalCode: string;
  birthDate: Date;
  gender: 'male' | 'female';
  nationality: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  documents: {
    type: string;
    number: string;
    expiryDate: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;

  // 实例方法
  getFullName(): string;
  getAge(): number;
  getSupervisor(): Promise<IEmployee | null>;
  getSubordinates(): Promise<IEmployee[]>;
  updateStatus(status: string, reason?: string): Promise<IEmployee>;
  hasDocument(type: string): boolean;
  getExpiringDocuments(days: number): any[];
}

export interface IAttendance extends Document {
  employeeId: string;
  date: Date;
  checkInTime: Date;
  checkOutTime: Date;
  hoursWorked: number;
  overtime: number;
  status: 'present' | 'absent' | 'leave' | 'holiday' | 'late' | 'early_leave';
  location: string;
  deviceInfo: string;
  latitude: number;
  longitude: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;

  // 实例方法
  calculateHours(): number;
  getStatus(): string;
  isLate(): boolean;
  isEarlyLeave(): boolean;
}

export interface ILeave extends Document {
  employeeId: string;
  type: 'annual' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'unpaid' | 'other';
  startDate: Date;
  endDate: Date;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approvedBy: string;
  approvedAt: Date;
  rejectionReason: string;
  notes: string;
  attachment: string;
  createdAt: Date;
  updatedAt: Date;

  // 实例方法
  getDuration(): number;
  isPending(): boolean;
  isApproved(): boolean;
  isOverlappingWith(other: ILeave): boolean;
  approve(approverId: string): Promise<ILeave>;
  reject(reason: string): Promise<ILeave>;
}

// ============================================
// Employee Schema
// ============================================

const EmergencyContactSchema = new Schema({
  name: { type: String, required: true },
  relationship: { type: String, required: true },
  phone: { type: String, required: true }
}, { _id: false });

const DocumentSchema = new Schema({
  type: { type: String, required: true },
  number: { type: String, required: true },
  expiryDate: { type: Date, required: true }
}, { _id: false });

const EmployeeSchema = new Schema<IEmployee>({
  employeeNo: {
    type: String,
    required: true,
    unique: true,
    index: true,
    uppercase: true,
    trim: true
  },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true,
    lowercase: true
  },
  phone: { type: String, required: true, trim: true },
  department: { type: String, required: true, index: true },
  position: { type: String, required: true },
  title: { type: String },
  supervisorId: { type: String, ref: 'Employee' },
  hireDate: { type: Date, required: true },
  salary: { type: Number, required: true, min: 0 },
  bankAccount: { type: String },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on_leave', 'terminated'],
    default: 'active',
    index: true
  },
  address: { type: String },
  city: { type: String },
  province: { type: String },
  postalCode: { type: String },
  birthDate: { type: Date },
  gender: { type: String, enum: ['male', 'female'] },
  nationality: { type: String },
  emergencyContact: EmergencyContactSchema,
  documents: [DocumentSchema]
}, {
  timestamps: true,
  collection: 'employees',
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ============================================
// Employee 虚拟字段
// ============================================

EmployeeSchema.virtual('fullName').get(function(this: IEmployee) {
  return `${this.firstName} ${this.lastName}`;
});

EmployeeSchema.virtual('age').get(function(this: IEmployee) {
  if (!this.birthDate) return null;
  const age = new Date().getFullYear() - this.birthDate.getFullYear();
  return age;
});

// ============================================
// Employee 索引
// ============================================

EmployeeSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });
EmployeeSchema.index({ department: 1, status: 1 });
EmployeeSchema.index({ supervisorId: 1 });
EmployeeSchema.index({ hireDate: -1 });

// ============================================
// Employee 实例方法
// ============================================

EmployeeSchema.methods = {
  /**
   * 获取完整名称
   */
  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  },

  /**
   * 获取年龄
   */
  getAge(): number {
    if (!this.birthDate) return 0;
    return new Date().getFullYear() - this.birthDate.getFullYear();
  },

  /**
   * 获取上级
   */
  async getSupervisor(): Promise<IEmployee | null> {
    if (!this.supervisorId) return null;
    return (this.constructor as any).findById(this.supervisorId).exec();
  },

  /**
   * 获取下属
   */
  async getSubordinates(): Promise<IEmployee[]> {
    return (this.constructor as any).find({ supervisorId: this._id }).exec();
  },

  /**
   * 更新状态
   */
  async updateStatus(status: string, reason?: string): Promise<IEmployee> {
    this.status = status as any;
    if (reason) {
      this.notes = reason;
    }
    return this.save();
  },

  /**
   * 检查是否有特定类型的文档
   */
  hasDocument(type: string): boolean {
    return this.documents.some(d => d.type === type);
  },

  /**
   * 获取即将到期的文档
   */
  getExpiringDocuments(days: number): any[] {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() + days);
    return this.documents.filter(d => d.expiryDate <= threshold);
  }
};

// ============================================
// Employee 静态方法
// ============================================

EmployeeSchema.statics = {
  /**
   * 按部门统计
   */
  async countByDepartment(): Promise<any[]> {
    return this.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          avgSalary: { $avg: '$salary' }
        }
      },
      { $sort: { count: -1 } }
    ]);
  },

  /**
   * 获取活跃员工
   */
  async getActiveEmployees(): Promise<IEmployee[]> {
    return this.find({ status: 'active' }).sort({ firstName: 1 }).exec();
  },

  /**
   * 获取即将到期的文档
   */
  async getExpiringDocuments(days: number): Promise<any[]> {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() + days);
    return this.aggregate([
      { $match: { status: 'active' } },
      { $unwind: '$documents' },
      { $match: { 'documents.expiryDate': { $lte: threshold } } }
    ]);
  }
};

// ============================================
// Employee 中间件
// ============================================

EmployeeSchema.pre('save', function(next) {
  if (!this.employeeNo) {
    const timestamp = Date.now().toString(36);
    this.employeeNo = `EMP-${timestamp}`;
  }
  next();
});

// ============================================
// Attendance Schema
// ============================================

const AttendanceSchema = new Schema<IAttendance>({
  employeeId: { type: String, required: true, index: true },
  date: { type: Date, required: true, index: true },
  checkInTime: { type: Date },
  checkOutTime: { type: Date },
  hoursWorked: { type: Number, default: 0, min: 0 },
  overtime: { type: Number, default: 0, min: 0 },
  status: {
    type: String,
    enum: ['present', 'absent', 'leave', 'holiday', 'late', 'early_leave'],
    default: 'present',
    index: true
  },
  location: { type: String },
  deviceInfo: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  notes: { type: String }
}, {
  timestamps: true,
  collection: 'attendances'
});

// ============================================
// Attendance 索引
// ============================================

AttendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });
AttendanceSchema.index({ date: -1, status: 1 });

// ============================================
// Attendance 实例方法
// ============================================

AttendanceSchema.methods = {
  /**
   * 计算工作时长
   */
  calculateHours(): number {
    if (!this.checkInTime || !this.checkOutTime) return 0;
    const hours = (this.checkOutTime.getTime() - this.checkInTime.getTime()) / (1000 * 60 * 60);
    return Math.round(hours * 100) / 100;
  },

  /**
   * 获取状态
   */
  getStatus(): string {
    return this.status;
  },

  /**
   * 检查是否迟到
   */
  isLate(): boolean {
    if (!this.checkInTime) return false;
    const startTime = new Date(this.date);
    startTime.setHours(9, 0, 0, 0);
    return this.checkInTime > startTime;
  },

  /**
   * 检查是否早退
   */
  isEarlyLeave(): boolean {
    if (!this.checkOutTime) return false;
    const endTime = new Date(this.date);
    endTime.setHours(18, 0, 0, 0);
    return this.checkOutTime < endTime;
  }
};

// ============================================
// Leave Schema
// ============================================

const LeaveSchema = new Schema<ILeave>({
  employeeId: { type: String, required: true, index: true },
  type: {
    type: String,
    enum: ['annual', 'sick', 'personal', 'maternity', 'paternity', 'unpaid', 'other'],
    required: true,
    index: true
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  days: { type: Number, required: true, min: 0 },
  reason: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending',
    index: true
  },
  approvedBy: { type: String },
  approvedAt: { type: Date },
  rejectionReason: { type: String },
  notes: { type: String },
  attachment: { type: String }
}, {
  timestamps: true,
  collection: 'leaves'
});

// ============================================
// Leave 索引
// ============================================

LeaveSchema.index({ employeeId: 1, startDate: -1 });
LeaveSchema.index({ status: 1, startDate: 1 });
LeaveSchema.index({ startDate: 1, endDate: 1 });

// ============================================
// Leave 实例方法
// ============================================

LeaveSchema.methods = {
  /**
   * 获取请假天数
   */
  getDuration(): number {
    return this.days;
  },

  /**
   * 检查是否待审批
   */
  isPending(): boolean {
    return this.status === 'pending';
  },

  /**
   * 检查是否已批准
   */
  isApproved(): boolean {
    return this.status === 'approved';
  },

  /**
   * 检查是否与另一个请假重叠
   */
  isOverlappingWith(other: ILeave): boolean {
    return this.startDate <= other.endDate && this.endDate >= other.startDate;
  },

  /**
   * 批准请假
   */
  async approve(approverId: string): Promise<ILeave> {
    if (!this.isPending()) {
      throw new Error(`Cannot approve leave with status: ${this.status}`);
    }
    this.status = 'approved';
    this.approvedBy = approverId;
    this.approvedAt = new Date();
    return this.save();
  },

  /**
   * 拒绝请假
   */
  async reject(reason: string): Promise<ILeave> {
    if (!this.isPending()) {
      throw new Error(`Cannot reject leave with status: ${this.status}`);
    }
    this.status = 'rejected';
    this.rejectionReason = reason;
    return this.save();
  }
};

// ============================================
// 模型导出
// ============================================

export const EmployeeModel = mongoose.model<IEmployee>('Employee', EmployeeSchema);
export const AttendanceModel = mongoose.model<IAttendance>('Attendance', AttendanceSchema);
export const LeaveModel = mongoose.model<ILeave>('Leave', LeaveSchema);

export default {
  EmployeeModel,
  AttendanceModel,
  LeaveModel
};