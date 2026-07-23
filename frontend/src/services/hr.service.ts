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

export class EmployeeService extends BaseService {
  async getList(params?: any) {
    return this.get('/hr/employees', { params });
  }
  
  async getById(id: string) {
    return this.get(`/hr/employees/${id}`);
  }
  
  async getByNo(no: string) {
    return this.get(`/hr/employees/no/${no}`);
  }
  
  async getByDepartment(department: string) {
    return this.get(`/hr/employees/department/${department}`);
  }
  
  async search(keyword: string) {
    return this.get('/hr/employees/search', { params: { keyword } });
  }
  
  async getDepartmentStats() {
    return this.get('/hr/employees/department-stats');
  }
  
  async create(data: Partial<Employee>) {
    return this.post('/hr/employees', data);
  }
  
  async update(id: string, data: Partial<Employee>) {
    return this.put(`/hr/employees/${id}`, data);
  }
  
  async toggleStatus(id: string) {
    return this.patch(`/hr/employees/${id}/toggle-status`);
  }
  
  async delete(id: string) {
    return this.delete(`/hr/employees/${id}`);
  }
}

export class AttendanceService extends BaseService {
  async checkIn(employeeId: string) {
    return this.post('/hr/attendance/check-in', { employeeId });
  }
  
  async checkOut(id: string) {
    return this.patch(`/hr/attendance/${id}/check-out`);
  }
  
  async getMonthlySummary(employeeId: string, year: number, month: number) {
    return this.get(`/hr/attendance/${employeeId}/${year}/${month}`);
  }
}

export class LeaveService extends BaseService {
  async getPendingLeaves() {
    return this.get('/hr/leaves/pending');
  }
  
  async getEmployeeLeaves(employeeId: string) {
    return this.get(`/hr/leaves/employee/${employeeId}`);
  }
  
  async requestLeave(data: Partial<Leave>) {
    return this.post('/hr/leaves', data);
  }
  
  async approveLeave(id: string, approvedBy: string) {
    return this.patch(`/hr/leaves/${id}/approve`, { approvedBy });
  }
  
  async rejectLeave(id: string, notes: string) {
    return this.patch(`/hr/leaves/${id}/reject`, { notes });
  }
}

export const employeeService = new EmployeeService();
export const attendanceService = new AttendanceService();
export const leaveService = new LeaveService();
