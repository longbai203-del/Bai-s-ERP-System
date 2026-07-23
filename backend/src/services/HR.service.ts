import { BaseService } from '../services/BaseService';
import { EmployeeRepository, AttendanceRepository, LeaveRepository } from '../repositories/HR.repository';
import { IEmployee, IAttendance, ILeave } from '../models/HR.model';
import { generateCode } from '../utils';

export class EmployeeService extends BaseService<IEmployee> {
  private employeeRepository: EmployeeRepository;
  
  constructor() {
    super(new EmployeeRepository());
    this.employeeRepository = new EmployeeRepository();
  }
  
  async createEmployee(data: Partial<IEmployee>): Promise<IEmployee> {
    data.employeeNo = generateCode('EMP');
    return this.repository.create(data);
  }
  
  async findByEmployeeNo(no: string): Promise<IEmployee | null> {
    return this.employeeRepository.findByEmployeeNo(no);
  }
  
  async findByEmail(email: string): Promise<IEmployee | null> {
    return this.employeeRepository.findByEmail(email);
  }
  
  async findByDepartment(department: string): Promise<IEmployee[]> {
    return this.employeeRepository.findByDepartment(department);
  }
  
  async search(keyword: string): Promise<IEmployee[]> {
    return this.employeeRepository.search(keyword);
  }
  
  async getDepartmentStats(): Promise<any[]> {
    const employees = await this.repository.findAll({ status: 'active' });
    const stats: any = {};
    employees.forEach(emp => {
      if (!stats[emp.department]) {
        stats[emp.department] = { count: 0, totalSalary: 0 };
      }
      stats[emp.department].count++;
      stats[emp.department].totalSalary += emp.salary;
    });
    return Object.entries(stats).map(([department, data]) => ({ department, ...data }));
  }
}

export class AttendanceService extends BaseService<IAttendance> {
  private attendanceRepository: AttendanceRepository;
  
  constructor() {
    super(new AttendanceRepository());
    this.attendanceRepository = new AttendanceRepository();
  }
  
  async checkIn(employeeId: string): Promise<IAttendance> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.repository.create({
      employeeId,
      date: today,
      checkIn: new Date(),
      status: 'present'
    });
  }
  
  async checkOut(id: string): Promise<IAttendance | null> {
    const attendance = await this.repository.findById(id);
    if (!attendance) return null;
    const checkOut = new Date();
    const hoursWorked = (checkOut.getTime() - attendance.checkIn.getTime()) / (1000 * 60 * 60);
    const overtime = Math.max(0, hoursWorked - 8);
    return this.repository.update(id, {
      checkOut,
      hoursWorked,
      overtime,
      updatedAt: new Date()
    });
  }
  
  async getMonthlySummary(employeeId: string, year: number, month: number): Promise<any> {
    return this.attendanceRepository.getMonthlySummary(employeeId, year, month);
  }
}

export class LeaveService extends BaseService<ILeave> {
  private leaveRepository: LeaveRepository;
  
  constructor() {
    super(new LeaveRepository());
    this.leaveRepository = new LeaveRepository();
  }
  
  async requestLeave(data: Partial<ILeave>): Promise<ILeave> {
    return this.repository.create(data);
  }
  
  async approveLeave(id: string, approvedBy: string): Promise<ILeave | null> {
    return this.repository.update(id, {
      status: 'approved',
      approvedBy,
      updatedAt: new Date()
    });
  }
  
  async rejectLeave(id: string, notes: string): Promise<ILeave | null> {
    return this.repository.update(id, {
      status: 'rejected',
      notes,
      updatedAt: new Date()
    });
  }
  
  async getPendingLeaves(): Promise<ILeave[]> {
    return this.leaveRepository.getPendingLeaves();
  }
  
  async getEmployeeLeaves(employeeId: string): Promise<ILeave[]> {
    return this.leaveRepository.findByEmployee(employeeId);
  }
}
