/**
 * HR Repository - 人力资源数据访问层
 * 提供员工、考勤、请假相关的数据库操作
 * 
 * @extends BaseRepository
 */

import { BaseRepository } from './BaseRepository';
import { EmployeeModel, AttendanceModel, LeaveModel } from '../models/HR.model';
import { Types } from 'mongoose';

export interface EmployeeQueryOptions {
  department?: string;
  status?: string;
  position?: string;
  keyword?: string;
  startDate?: Date;
  endDate?: Date;
  minSalary?: number;
  maxSalary?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DepartmentStats {
  _id: string;
  count: number;
  totalSalary: number;
  averageSalary: number;
  maxSalary: number;
  minSalary: number;
}

// ===== Employee Repository =====

export class EmployeeRepository extends BaseRepository<any> {
  constructor() {
    super(EmployeeModel);
  }

  /**
   * 根据工号查找员工
   */
  async findByEmployeeNo(no: string): Promise<any | null> {
    if (!no) return null;
    return this.model.findOne({ employeeNo: no });
  }

  /**
   * 根据邮箱查找员工
   */
  async findByEmail(email: string): Promise<any | null> {
    if (!email) return null;
    return this.model.findOne({ email: email.toLowerCase() });
  }

  /**
   * 根据部门查找员工
   */
  async findByDepartment(department: string): Promise<any[]> {
    if (!department) return [];
    return this.model.find({ department, status: 'active' }).sort({ firstName: 1 });
  }

  /**
   * 根据职位查找员工
   */
  async findByPosition(position: string): Promise<any[]> {
    if (!position) return [];
    return this.model.find({ position, status: 'active' });
  }

  /**
   * 根据状态查找员工
   */
  async findByStatus(status: string): Promise<any[]> {
    if (!status) return [];
    return this.model.find({ status });
  }

  /**
   * 搜索员工
   */
  async search(keyword: string): Promise<any[]> {
    if (!keyword) return [];
    const regex = new RegExp(keyword, 'i');
    return this.model.find({
      $or: [
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { employeeNo: regex },
        { position: regex },
        { department: regex }
      ]
    });
  }

  /**
   * 高级搜索
   */
  async advancedSearch(options: EmployeeQueryOptions): Promise<any[]> {
    const filter: any = {};

    if (options.department) filter.department = options.department;
    if (options.status) filter.status = options.status;
    if (options.position) filter.position = options.position;

    if (options.keyword) {
      const regex = new RegExp(options.keyword, 'i');
      filter.$or = [
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { employeeNo: regex }
      ];
    }

    if (options.minSalary !== undefined || options.maxSalary !== undefined) {
      filter.salary = {};
      if (options.minSalary !== undefined) filter.salary.$gte = options.minSalary;
      if (options.maxSalary !== undefined) filter.salary.$lte = options.maxSalary;
    }

    if (options.startDate || options.endDate) {
      filter.hireDate = {};
      if (options.startDate) filter.hireDate.$gte = options.startDate;
      if (options.endDate) filter.hireDate.$lte = options.endDate;
    }

    const sort: any = {};
    sort[options.sortBy || 'createdAt'] = options.sortOrder === 'asc' ? 1 : -1;

    return this.model.find(filter).sort(sort);
  }

  /**
   * 获取部门统计
   */
  async getDepartmentStats(): Promise<DepartmentStats[]> {
    return this.model.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          totalSalary: { $sum: '$salary' },
          averageSalary: { $avg: '$salary' },
          maxSalary: { $max: '$salary' },
          minSalary: { $min: '$salary' }
        }
      },
      { $sort: { count: -1 } }
    ]);
  }

  /**
   * 获取员工统计
   */
  async getEmployeeStats(): Promise<any> {
    const stats = await this.model.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          byStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],
          byDepartment: [
            { $group: { _id: '$department', count: { $sum: 1 } } }
          ],
          salaryStats: [
            {
              $group: {
                _id: null,
                totalSalary: { $sum: '$salary' },
                averageSalary: { $avg: '$salary' },
                maxSalary: { $max: '$salary' },
                minSalary: { $min: '$salary' }
              }
            }
          ]
        }
      }
    ]);

    const result = stats[0] || {};
    const statusMap: Record<string, number> = {};
    (result.byStatus || []).forEach((item: any) => {
      statusMap[item._id] = item.count;
    });

    return {
      total: result.total?.[0]?.count || 0,
      active: statusMap.active || 0,
      inactive: statusMap.inactive || 0,
      onLeave: statusMap.on_leave || 0,
      terminated: statusMap.terminated || 0,
      byDepartment: result.byDepartment || [],
      salaryStats: result.salaryStats?.[0] || { totalSalary: 0, averageSalary: 0, maxSalary: 0, minSalary: 0 }
    };
  }

  /**
   * 获取员工详细信息（含关联数据）
   */
  async getEmployeeDetail(id: string): Promise<any> {
    if (!id) return null;
    return this.model.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'attendances',
          localField: '_id',
          foreignField: 'employeeId',
          as: 'attendances'
        }
      },
      {
        $lookup: {
          from: 'leaves',
          localField: '_id',
          foreignField: 'employeeId',
          as: 'leaves'
        }
      },
      {
        $addFields: {
          attendanceCount: { $size: '$attendances' },
          leaveCount: { $size: '$leaves' },
          pendingLeaves: {
            $size: {
              $filter: {
                input: '$leaves',
                as: 'leave',
                cond: { $eq: ['$$leave.status', 'pending'] }
              }
            }
          }
        }
      }
    ]);
  }

  /**
   * 更新员工状态
   */
  async updateStatus(id: string, status: string, reason?: string): Promise<any | null> {
    if (!id) return null;
    const updateData: any = { status };
    if (reason) updateData.statusReason = reason;
    return this.model.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
  }

  /**
   * 获取近期入职员工
   */
  async getRecentHires(days: number = 30): Promise<any[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    return this.model.find({
      hireDate: { $gte: startDate },
      status: 'active'
    }).sort({ hireDate: -1 });
  }

  /**
   * 获取生日员工（本月）
   */
  async getBirthdayEmployees(): Promise<any[]> {
    const now = new Date();
    const month = now.getMonth() + 1;
    return this.model.find({
      birthDate: { $regex: `-${String(month).padStart(2, '0')}-` },
      status: 'active'
    });
  }
}

// ===== Attendance Repository =====

export class AttendanceRepository extends BaseRepository<any> {
  constructor() {
    super(AttendanceModel);
  }

  /**
   * 根据员工查找考勤记录
   */
  async findByEmployee(employeeId: string, startDate: Date, endDate: Date): Promise<any[]> {
    if (!employeeId) return [];
    return this.model.find({
      employeeId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });
  }

  /**
   * 获取今日考勤
   */
  async getTodayAttendance(department?: string): Promise<any[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const filter: any = {
      date: { $gte: today, $lt: tomorrow }
    };

    if (department) {
      const employees = await EmployeeModel.find({ department, status: 'active' });
      filter.employeeId = { $in: employees.map((e: any) => e._id) };
    }

    return this.model.find(filter).populate('employeeId', 'firstName lastName department');
  }

  /**
   * 获取月度考勤汇总
   */
  async getMonthlySummary(employeeId: string, year: number, month: number): Promise<any> {
    if (!employeeId) return [];
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return this.model.aggregate([
      {
        $match: {
          employeeId: new Types.ObjectId(employeeId),
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

  /**
   * 获取考勤统计
   */
  async getAttendanceStats(startDate: Date, endDate: Date, department?: string): Promise<any> {
    const match: any = {
      date: { $gte: startDate, $lte: endDate }
    };

    if (department) {
      const employees = await EmployeeModel.find({ department, status: 'active' });
      match.employeeId = { $in: employees.map((e: any) => e._id) };
    }

    return this.model.aggregate([
      { $match: match },
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

  /**
   * 打卡签到
   */
  async checkIn(
    employeeId: string,
    location?: string,
    deviceInfo?: string,
    latitude?: number,
    longitude?: number
  ): Promise<any> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 检查是否已经签到
    const existing = await this.model.findOne({
      employeeId,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    });

    if (existing) {
      throw new Error('Employee already checked in today');
    }

    return this.model.create({
      employeeId,
      date: new Date(),
      checkInTime: new Date(),
      status: 'present',
      location,
      deviceInfo,
      latitude,
      longitude
    });
  }

  /**
   * 打卡签退
   */
  async checkOut(id: string, location?: string, latitude?: number, longitude?: number): Promise<any | null> {
    if (!id) return null;
    const attendance = await this.model.findById(id);
    if (!attendance) return null;

    const checkOutTime = new Date();
    const hoursWorked = (checkOutTime.getTime() - attendance.checkInTime.getTime()) / (1000 * 60 * 60);

    return this.model.findByIdAndUpdate(
      id,
      {
        checkOutTime,
        hoursWorked: Math.round(hoursWorked * 100) / 100,
        location: location || attendance.location,
        latitude: latitude || attendance.latitude,
        longitude: longitude || attendance.longitude,
        updatedAt: new Date()
      },
      { new: true }
    );
  }
}

// ===== Leave Repository =====

export class LeaveRepository extends BaseRepository<any> {
  constructor() {
    super(LeaveModel);
  }

  /**
   * 根据员工查找请假记录
   */
  async findByEmployee(employeeId: string): Promise<any[]> {
    if (!employeeId) return [];
    return this.model.find({ employeeId }).sort({ startDate: -1 });
  }

  /**
   * 根据状态查找请假记录
   */
  async findByStatus(status: string): Promise<any[]> {
    if (!status) return [];
    return this.model.find({ status }).sort({ startDate: 1 });
  }

  /**
   * 获取待审批请假
   */
  async getPendingLeaves(department?: string): Promise<any[]> {
    const filter: any = { status: 'pending' };

    if (department) {
      const employees = await EmployeeModel.find({ department, status: 'active' });
      filter.employeeId = { $in: employees.map((e: any) => e._id) };
    }

    return this.model.find(filter)
      .populate('employeeId', 'firstName lastName department position')
      .sort({ startDate: 1 });
  }

  /**
   * 检查请假日期冲突
   */
  async checkConflict(employeeId: string, startDate: Date, endDate: Date): Promise<boolean> {
    const count = await this.model.countDocuments({
      employeeId,
      status: { $in: ['pending', 'approved'] },
      $or: [
        { startDate: { $lte: endDate, $gte: startDate } },
        { endDate: { $lte: endDate, $gte: startDate } },
        { startDate: { $lte: startDate }, endDate: { $gte: endDate } }
      ]
    });
    return count > 0;
  }

  /**
   * 获取员工可用假期天数
   */
  async getAvailableLeaveDays(employeeId: string): Promise<number> {
    const year = new Date().getFullYear();
    const usedLeaves = await this.model.aggregate([
      {
        $match: {
          employeeId: new Types.ObjectId(employeeId),
          status: 'approved',
          startDate: { $gte: new Date(year, 0, 1), $lte: new Date(year, 11, 31) }
        }
      },
      {
        $project: {
          days: {
            $ceil: {
              $divide: [
                { $subtract: ['$endDate', '$startDate'] },
                1000 * 60 * 60 * 24
              ]
            }
          }
        }
      },
      { $group: { _id: null, total: { $sum: '$days' } } }
    ]);

    const totalUsed = usedLeaves[0]?.total || 0;
    const annualLeave = 21; // 默认年假天数
    return Math.max(0, annualLeave - totalUsed);
  }

  /**
   * 审批请假
   */
  async approveLeave(id: string, approverId: string, comments?: string): Promise<any | null> {
    if (!id) return null;
    return this.model.findByIdAndUpdate(
      id,
      {
        status: 'approved',
        approvedBy: approverId,
        approvedAt: new Date(),
        comments
      },
      { new: true }
    );
  }

  /**
   * 拒绝请假
   */
  async rejectLeave(id: string, approverId: string, reason: string): Promise<any | null> {
    if (!id) return null;
    return this.model.findByIdAndUpdate(
      id,
      {
        status: 'rejected',
        approvedBy: approverId,
        approvedAt: new Date(),
        rejectionReason: reason
      },
      { new: true }
    );
  }

  /**
   * 获取请假统计
   */
  async getLeaveStats(year: number, department?: string): Promise<any> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const filter: any = {
      startDate: { $gte: startDate, $lte: endDate },
      status: 'approved'
    };

    if (department) {
      const employees = await EmployeeModel.find({ department, status: 'active' });
      filter.employeeId = { $in: employees.map((e: any) => e._id) };
    }

    return this.model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalDays: {
            $sum: {
              $ceil: {
                $divide: [
                  { $subtract: ['$endDate', '$startDate'] },
                  1000 * 60 * 60 * 24
                ]
              }
            }
          }
        }
      }
    ]);
  }
}

export default {
  EmployeeRepository,
  AttendanceRepository,
  LeaveRepository
};