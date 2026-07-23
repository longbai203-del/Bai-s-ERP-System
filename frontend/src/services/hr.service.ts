import { BaseService } from './base.service';

export interface Employee {
  id: string;
  employeeNo: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  title: string;
  supervisorId: string;
  hireDate: string;
  salary: number;
  status: 'active' | 'inactive' | 'terminated';
  address: string;
  city: string;
  province: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  hoursWorked: number;
  overtime: number;
  status: 'present' | 'absent' | 'leave' | 'holiday';
  notes: string;
}

export interface Leave {
  id: string;
  employeeId: string;
  type: 'annual' | 'sick' | 'personal' | 'maternity' | 'other';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approvedBy: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeQuery {
  page?: number;
  limit?: number;
  keyword?: string;
  department?: string;
  status?: string;
}

export class EmployeeService extends BaseService {
  constructor() {
    super();
  }
  
  // 获取员工列表
  async getList(params: EmployeeQuery) {
    return this.get('/hr/employees', { params });
  }
  
  // 获取员工详情
  async getById(id: string) {
    return this.get(`/hr/employees/${id}`);
  }
  
  // 根据工号获取
  async getByNo(no: string) {
    return this.get(`/hr/employees/no/${no}`);
  }
  
  // 根据部门获取
  async getByDepartment(department: string) {
    return this.get(`/hr/employees/department/${department}`);
  }
  
  // 搜索员工
  async search(keyword: string) {
    return this.get('/hr/employees/search', { params: { keyword } });
  }
  
  // 获取部门统计
  async getDepartmentStats() {
    return this.get('/hr/employees/department-stats');
  }
  
  // 创建员工
  async create(data: Partial<Employee>) {
    return this.post('/hr/employees', data);
  }
  
  // 更新员工
  async update(id: string, data: Partial<Employee>) {
    return this.put(`/hr/employees/${id}`, data);
  }
  
  // 删除员工
  async delete(id: string) {
    return this.delete(`/hr/employees/${id}`);
  }
}

export class AttendanceService extends BaseService {
  constructor() {
    super();
  }
  
  // 打卡签到
  async checkIn(employeeId: string) {
    return this.post('/hr/attendance/check-in', { employeeId });
  }
  
  // 打卡签退
  async checkOut(id: string) {
    return this.patch(`/hr/attendance/${id}/check-out`);
  }
  
  // 获取月度汇总
  async getMonthlySummary(employeeId: string, year: number, month: number) {
    return this.get(`/hr/attendance/${employeeId}/${year}/${month}`);
  }
}

export class LeaveService extends BaseService {
  constructor() {
    super();
  }
  
  // 获取待审批请假
  async getPendingLeaves() {
    return this.get('/hr/leaves/pending');
  }
  
  // 获取员工请假记录
  async getEmployeeLeaves(employeeId: string) {
    return this.get(`/hr/leaves/employee/${employeeId}`);
  }
  
  // 申请请假
  async requestLeave(data: Partial<Leave>) {
    return this.post('/hr/leaves', data);
  }
  
  // 审批请假
  async approveLeave(id: string, approvedBy: string) {
    return this.patch(`/hr/leaves/${id}/approve`, { approvedBy });
  }
  
  // 拒绝请假
  async rejectLeave(id: string, notes: string) {
    return this.patch(`/hr/leaves/${id}/reject`, { notes });
  }
}

export const employeeService = new EmployeeService();
export const attendanceService = new AttendanceService();
export const leaveService = new LeaveService();
