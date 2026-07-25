/**
 * HR模块类型定义
 * 包含员工、部门、职位等完整类型
 * @module modules/hr/store/types
 */

/**
 * 员工状态枚举
 */
export enum EmployeeStatus {
  /** 在职 */
  ACTIVE = 'active',
  /** 休假 */
  ON_LEAVE = 'on_leave',
  /** 已离职 */
  TERMINATED = 'terminated',
  /** 试用期 */
  PROBATION = 'probation',
}

/**
 * 员工性别枚举
 */
export enum EmployeeGender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

/**
 * 员工合同类型
 */
export enum ContractType {
  /** 全职 */
  FULL_TIME = 'full_time',
  /** 兼职 */
  PART_TIME = 'part_time',
  /** 实习 */
  INTERN = 'intern',
  /** 劳务 */
  CONTRACT = 'contract',
}

/**
 * 紧急联系人接口
 */
export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  address?: string;
}

/**
 * 员工接口
 */
export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  gender: EmployeeGender;
  department: string;
  departmentName?: string;
  position: string;
  managerId: string | null;
  managerName?: string;
  hireDate: string;
  birthDate: string;
  status: EmployeeStatus;
  contractType: ContractType;
  salary: number;
  address: string;
  emergencyContact: EmergencyContact;
  skills: string[];
  certifications: string[];
  education: Array<{
    degree: string;
    school: string;
    major: string;
    graduationYear: number;
  }>;
  workExperience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  createdAt: string;
  updatedAt: string;
  terminatedAt: string | null;
}

/**
 * 部门接口
 */
export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  managerId: string | null;
  managerName?: string;
  parentId: string | null;
  parentName?: string;
  employeeCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 薪资记录接口
 */
export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  period: string;
  baseSalary: number;
  bonus: number;
  overtime: number;
  deductions: number;
  taxes: number;
  netSalary: number;
  status: 'pending' | 'paid' | 'cancelled';
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * 考勤记录接口
 */
export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: 'present' | 'absent' | 'late' | 'early_leave' | 'leave';
  hours: number;
  overtimeHours: number;
  leaveType: string | null;
  note: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 创建员工请求
 */
export interface CreateEmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender?: EmployeeGender;
  department: string;
  position: string;
  managerId?: string;
  hireDate: string;
  birthDate: string;
  contractType?: ContractType;
  salary: number;
  address?: string;
  emergencyContact?: EmergencyContact;
  skills?: string[];
  certifications?: string[];
}

/**
 * 更新员工请求
 */
export interface UpdateEmployeeRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  gender?: EmployeeGender;
  department?: string;
  position?: string;
  managerId?: string | null;
  hireDate?: string;
  birthDate?: string;
  status?: EmployeeStatus;
  contractType?: ContractType;
  salary?: number;
  address?: string;
  emergencyContact?: Partial<EmergencyContact>;
  skills?: string[];
  certifications?: string[];
}

/**
 * 员工查询参数
 */
export interface EmployeeQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  status?: EmployeeStatus;
  position?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 员工统计信息
 */
export interface EmployeeStats {
  total: number;
  byStatus: Record<EmployeeStatus, number>;
  byDepartment: Record<string, number>;
  byGender: Record<EmployeeGender, number>;
  averageSalary: number;
  totalSalary: number;
  activeCount: number;
  newHiresThisMonth: number;
  terminatedThisMonth: number;
}

/**
 * HR状态接口
 */
export interface HrState {
  employees: Employee[];
  currentEmployee: Employee | null;
  departments: Department[];
  payrollRecords: PayrollRecord[];
  attendanceRecords: AttendanceRecord[];
  stats: EmployeeStats | null;
  total: number;
  loading: boolean;
  error: string | null;
  filters: EmployeeQueryParams;
}

export default {
  EmployeeStatus,
  EmployeeGender,
  ContractType,
  EmergencyContact,
  Employee,
  Department,
  PayrollRecord,
  AttendanceRecord,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  EmployeeQueryParams,
  EmployeeStats,
  HrState,
};