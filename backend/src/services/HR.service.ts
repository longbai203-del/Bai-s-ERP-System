import { BaseService } from './BaseService';
import { EmployeeRepository, AttendanceRepository, LeaveRepository } from '../repositories/HR.repository';
import { generateCode } from '../utils';

export class EmployeeService extends BaseService<any> {
  private employeeRepository: EmployeeRepository;
  
  constructor() {
    super(new EmployeeRepository());
    this.employeeRepository = new EmployeeRepository();
  }

  async createEmployee(data: any): Promise<any> {
    data.employeeNo = generateCode('EMP');
    return this.create(data);
  }

  async findByEmployeeNo(no: string): Promise<any | null> {
    if (!no) return null;
    return this.employeeRepository.findByEmployeeNo(no);
  }

  async findByEmail(email: string): Promise<any | null> {
    if (!email) return null;
    return this.employeeRepository.findByEmail(email);
  }

  async findByDepartment(department: string): Promise<any[]> {
    if (!department) return [];
    return this.employeeRepository.findByDepartment(department);
  }

  async findByStatus(status: string): Promise<any[]> {
    if (!status) return [];
    return this.employeeRepository.findByStatus(status);
  }

  async search(keyword: string): Promise<any[]> {
    if (!keyword) return [];
    return this.employeeRepository.search(keyword);
  }

  async getDepartmentStats(): Promise<any> {
    return this.employeeRepository.getDepartmentStats();
  }

  async toggleStatus(id: string): Promise<any | null> {
    this.validateId(id);
    const employee = await this.findById(id);
    if (!employee) return null;
    
    const statusMap: any = {
      'active': 'inactive',
      'inactive': 'active',
      'terminated': 'active'
    };
    return this.update(id, { status: statusMap[employee.status] });
  }
}

export class AttendanceService extends BaseService<any> {
  private attendanceRepository: AttendanceRepository;
  
  constructor() {
    super(new AttendanceRepository());
    this.attendanceRepository = new AttendanceRepository();
  }

  async checkIn(employeeId: string): Promise<any> {
    if (!employeeId) throw new Error('Employee ID is required');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.create({
      employeeId,
      date: today,
      checkIn: new Date(),
      status: 'present'
    });
  }

  async checkOut(id: string): Promise<any | null> {
    this.validateId(id);
    const attendance = await this.findById(id);
    if (!attendance) return null;
    
    const checkOut = new Date();
    const hoursWorked = (checkOut.getTime() - attendance.checkIn.getTime()) / (1000 * 60 * 60);
    const overtime = Math.max(0, hoursWorked - 8);
    
    return this.update(id, { checkOut, hoursWorked, overtime });
  }

  async getMonthlySummary(employeeId: string, year: number, month: number): Promise<any> {
    if (!employeeId) return [];
    return this.attendanceRepository.getMonthlySummary(employeeId, year, month);
  }
}

export class LeaveService extends BaseService<any> {
  private leaveRepository: LeaveRepository;
  
  constructor() {
    super(new LeaveRepository());
    this.leaveRepository = new LeaveRepository();
  }

  async requestLeave(data: any): Promise<any> {
    return this.create(data);
  }

  async approveLeave(id: string, approvedBy: string): Promise<any | null> {
    this.validateId(id);
    return this.update(id, { status: 'approved', approvedBy });
  }

  async rejectLeave(id: string, notes: string): Promise<any | null> {
    this.validateId(id);
    return this.update(id, { status: 'rejected', notes });
  }

  async getPendingLeaves(): Promise<any[]> {
    return this.leaveRepository.getPendingLeaves();
  }

  async getEmployeeLeaves(employeeId: string): Promise<any[]> {
    if (!employeeId) return [];
    return this.leaveRepository.findByEmployee(employeeId);
  }
}
