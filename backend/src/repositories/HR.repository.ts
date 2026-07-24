import { BaseRepository } from './BaseRepository';
import { EmployeeModel, AttendanceModel, LeaveModel } from '../models/HR.model';

export class EmployeeRepository extends BaseRepository<any> {
  constructor() {
    super(EmployeeModel);
  }

  async findByEmployeeNo(no: string): Promise<any | null> {
    if (!no) return null;
    return this.model.findOne({ employeeNo: no });
  }

  async findByEmail(email: string): Promise<any | null> {
    if (!email) return null;
    return this.model.findOne({ email });
  }

  async findByDepartment(department: string): Promise<any[]> {
    if (!department) return [];
    return this.model.find({ department, status: 'active' });
  }

  async findByStatus(status: string): Promise<any[]> {
    if (!status) return [];
    return this.model.find({ status });
  }

  async search(keyword: string): Promise<any[]> {
    if (!keyword) return [];
    return this.model.find({
      $or: [
        { firstName: { $regex: keyword, $options: 'i' } },
        { lastName: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } },
        { employeeNo: { $regex: keyword, $options: 'i' } }
      ]
    });
  }

  async getDepartmentStats(): Promise<any> {
    return this.model.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          totalSalary: { $sum: '$salary' },
          avgSalary: { $avg: '$salary' }
        }
      }
    ]);
  }
}

export class AttendanceRepository extends BaseRepository<any> {
  constructor() {
    super(AttendanceModel);
  }

  async findByEmployee(employeeId: string, startDate: Date, endDate: Date): Promise<any[]> {
    if (!employeeId) return [];
    return this.model.find({
      employeeId,
      date: { $gte: startDate, $lte: endDate }
    });
  }

  async getMonthlySummary(employeeId: string, year: number, month: number): Promise<any> {
    if (!employeeId) return [];
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    return this.model.aggregate([
      {
        $match: {
          employeeId,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalHours: { $sum: '$hoursWorked' },
          totalOvertime: { $sum: '$overtime' }
        }
      }
    ]);
  }
}

export class LeaveRepository extends BaseRepository<any> {
  constructor() {
    super(LeaveModel);
  }

  async findByEmployee(employeeId: string): Promise<any[]> {
    if (!employeeId) return [];
    return this.model.find({ employeeId }).sort({ startDate: -1 });
  }

  async findByStatus(status: string): Promise<any[]> {
    if (!status) return [];
    return this.model.find({ status }).sort({ startDate: 1 });
  }

  async getPendingLeaves(): Promise<any[]> {
    return this.model.find({ status: 'pending' }).sort({ startDate: 1 });
  }
}
