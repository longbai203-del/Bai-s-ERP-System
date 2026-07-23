import { BaseRepository } from '../repositories/BaseRepository';
import { EmployeeModel, AttendanceModel, LeaveModel, IEmployee, IAttendance, ILeave } from '../models/HR.model';

export class EmployeeRepository extends BaseRepository<IEmployee> {
  constructor() {
    super(EmployeeModel);
  }
  
  async findByEmployeeNo(no: string): Promise<IEmployee | null> {
    return this.model.findOne({ employeeNo: no });
  }
  
  async findByEmail(email: string): Promise<IEmployee | null> {
    return this.model.findOne({ email });
  }
  
  async findByDepartment(department: string): Promise<IEmployee[]> {
    return this.model.find({ department, status: 'active' });
  }
  
  async search(keyword: string): Promise<IEmployee[]> {
    return this.model.find({
      $or: [
        { firstName: { $regex: keyword, $options: 'i' } },
        { lastName: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } },
        { employeeNo: { $regex: keyword, $options: 'i' } }
      ]
    });
  }
}

export class AttendanceRepository extends BaseRepository<IAttendance> {
  constructor() {
    super(AttendanceModel);
  }
  
  async findByEmployee(employeeId: string, startDate: Date, endDate: Date): Promise<IAttendance[]> {
    return this.model.find({
      employeeId,
      date: { $gte: startDate, $lte: endDate }
    });
  }
  
  async getMonthlySummary(employeeId: string, year: number, month: number): Promise<any> {
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

export class LeaveRepository extends BaseRepository<ILeave> {
  constructor() {
    super(LeaveModel);
  }
  
  async findByEmployee(employeeId: string): Promise<ILeave[]> {
    return this.model.find({ employeeId }).sort({ startDate: -1 });
  }
  
  async findByStatus(status: string): Promise<ILeave[]> {
    return this.model.find({ status }).sort({ startDate: 1 });
  }
  
  async getPendingLeaves(): Promise<ILeave[]> {
    return this.model.find({ status: 'pending' }).sort({ startDate: 1 });
  }
}
