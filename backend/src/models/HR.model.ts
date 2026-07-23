import mongoose, { Schema, Document } from 'mongoose';

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
  status: 'active' | 'inactive' | 'terminated';
  address: string;
  city: string;
  province: string;
  postalCode: string;
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
}

export interface IAttendance extends Document {
  employeeId: string;
  date: Date;
  checkIn: Date;
  checkOut: Date;
  hoursWorked: number;
  overtime: number;
  status: 'present' | 'absent' | 'leave' | 'holiday';
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILeave extends Document {
  employeeId: string;
  type: 'annual' | 'sick' | 'personal' | 'maternity' | 'other';
  startDate: Date;
  endDate: Date;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approvedBy: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema = new Schema<IEmployee>({
  employeeNo: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  department: { type: String, required: true },
  position: { type: String, required: true },
  title: { type: String },
  supervisorId: { type: String },
  hireDate: { type: Date, required: true },
  salary: { type: Number, required: true, min: 0 },
  bankAccount: { type: String },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'terminated'],
    default: 'active'
  },
  address: { type: String },
  city: { type: String },
  province: { type: String },
  postalCode: { type: String },
  emergencyContact: {
    name: { type: String },
    relationship: { type: String },
    phone: { type: String }
  },
  documents: [{
    type: { type: String },
    number: { type: String },
    expiryDate: { type: Date }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const AttendanceSchema = new Schema<IAttendance>({
  employeeId: { type: String, required: true },
  date: { type: Date, required: true },
  checkIn: { type: Date },
  checkOut: { type: Date },
  hoursWorked: { type: Number, default: 0 },
  overtime: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['present', 'absent', 'leave', 'holiday'],
    default: 'present'
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const LeaveSchema = new Schema<ILeave>({
  employeeId: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['annual', 'sick', 'personal', 'maternity', 'other'],
    required: true
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  days: { type: Number, required: true },
  reason: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  approvedBy: { type: String },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const EmployeeModel = mongoose.model<IEmployee>('Employee', EmployeeSchema);
export const AttendanceModel = mongoose.model<IAttendance>('Attendance', AttendanceSchema);
export const LeaveModel = mongoose.model<ILeave>('Leave', LeaveSchema);
