/**
 * HR Service - 人力资源业务逻辑层
 * 提供员工、考勤、请假相关的完整业务逻辑处理
 */

import { BaseService } from './BaseService';
import {
  EmployeeRepository,
  AttendanceRepository,
  LeaveRepository
} from '../repositories/HR.repository';
import { generateCode, formatDate } from '../utils';
import { ApiError } from '../exceptions/api.error';
import logger from '../utils/logger';

export interface EmployeeQueryOptions {
  department?: string;
  status?: string;
  position?: string;
  keyword?: string;
  minSalary?: number;
  maxSalary?: number;
  startDate?: Date;
  endDate?: Date;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface EmployeeStats {
  total: number;
  active: number;
  inactive: number;
  onLeave: number;
  terminated: number;
  byDepartment: any[];
  salaryStats: {
    totalSalary: number;
    averageSalary: number;
    maxSalary: number;
    minSalary: number;
  };
}

// ===== Employee Service =====

export class EmployeeService extends BaseService<any> {
  private employeeRepository: EmployeeRepository;

  constructor() {
    super(new EmployeeRepository());
    this.employeeRepository = new EmployeeRepository();
  }

  /**
   * 创建员工（自动生成工号）
   */
  async createEmployee(data: any): Promise<any> {
    try {
      // 验证数据
      if (!data.firstName || !data.lastName) {
        throw new ApiError(400, 'First name and last name are required');
      }

      // 检查邮箱是否已存在
      if (data.email) {
        const existing = await this.employeeRepository.findByEmail(data.email);
        if (existing) {
          throw new ApiError(409, 'Email already exists');
        }
      }

      // 生成工号
      data.employeeNo = data.employeeNo || generateCode('EMP');
      data.status = data.status || 'active';
      data.hireDate = data.hireDate || new Date();

      const employee = await this.create(data);
      logger.info(`Employee created: ${employee.employeeNo} - ${employee.firstName} ${employee.lastName}`);
      return employee;
    } catch (error) {
      logger.error('Error creating employee:', error);
      throw error;
    }
  }

  /**
   * 更新员工信息
   */
  async updateEmployee(id: string, data: any): Promise<any | null> {
    try {
      this.validateId(id);

      // 检查邮箱是否被其他员工使用
      if (data.email) {
        const existing = await this.employeeRepository.findByEmail(data.email);
        if (existing && existing._id.toString() !== id) {
          throw new ApiError(409, 'Email already exists');
        }
      }

      const employee = await this.update(id, data);
      if (!employee) {
        throw new ApiError(404, 'Employee not found');
      }

      logger.info(`Employee updated: ${employee.employeeNo}`);
      return employee;
    } catch (error) {
      logger.error('Error updating employee:', error);
      throw error;
    }
  }

  /**
   * 删除员工
   */
  async deleteEmployee(id: string): Promise<boolean> {
    try {
      this.validateId(id);
      const employee = await this.findById(id);
      if (!employee) {
        throw new ApiError(404, 'Employee not found');
      }

      // 检查是否有未完成的考勤或请假记录
      // 实际实现中需要检查关联数据

      const result = await this.delete(id);
      logger.info(`Employee deleted: ${employee.employeeNo}`);
      return result;
    } catch (error) {
      logger.error('Error deleting employee:', error);
      throw error;
    }
  }

  /**
   * 根据工号查询员工
   */
  async getByEmployeeNo(no: string): Promise<any | null> {
    if (!no) return null;
    return this.employeeRepository.findByEmployeeNo(no);
  }

  /**
   * 根据邮箱查询员工
   */
  async getByEmail(email: string): Promise<any | null> {
    if (!email) return null;
    return this.employeeRepository.findByEmail(email);
  }

  /**
   * 根据部门查询员工
   */
  async getByDepartment(department: string): Promise<any[]> {
    if (!department) return [];
    return this.employeeRepository.findByDepartment(department);
  }

  /**
   * 根据职位查询员工
   */
  async getByPosition(position: string): Promise<any[]> {
    if (!position) return [];
    return this.employeeRepository.findByPosition(position);
  }

  /**
   * 根据状态查询员工
   */
  async getByStatus(status: string): Promise<any[]> {
    if (!status) return [];
    return this.employeeRepository.findByStatus(status);
  }

  /**
   * 搜索员工
   */
  async searchEmployees(keyword: string): Promise<any[]> {
    if (!keyword || keyword.length < 2) {
      throw new ApiError(400, 'Keyword must be at least 2 characters');
    }
    return this.employeeRepository.search(keyword);
  }

  /**
   * 高级搜索
   */
  async advancedSearch(options: EmployeeQueryOptions): Promise<any[]> {
    return this.employeeRepository.advancedSearch(options);
  }

  /**
   * 获取员工列表（分页）
   */
  async getEmployeeList(page: number = 1, limit: number = 10, filters?: any): Promise<any> {
    return this.paginate(filters || {}, page, limit);
  }

  /**
   * 获取员工统计
   */
  async getEmployeeStats(): Promise<EmployeeStats> {
    return this.employeeRepository.getEmployeeStats();
  }

  /**
   * 获取部门统计
   */
  async getDepartmentStats(): Promise<any[]> {
    return this.employeeRepository.getDepartmentStats();
  }

  /**
   * 获取员工详情（含考勤和请假记录）
   */
  async getEmployeeDetail(id: string): Promise<any> {
    this.validateId(id);
    const detail = await this.employeeRepository.getEmployeeDetail(id);
    if (!detail || detail.length === 0) {
      throw new ApiError(404, 'Employee not found');
    }
    return detail[0];
  }

  /**
   * 更新员工状态
   */
  async updateEmployeeStatus(id: string, status: string, reason?: string): Promise<any | null> {
    try {
      this.validateId(id);
      const validStatuses = ['active', 'inactive', 'on_leave', 'terminated'];
      if (!validStatuses.includes(status)) {
        throw new ApiError(400, 'Invalid status');
      }

      const employee = await this.employeeRepository.updateStatus(id, status, reason);
      if (!employee) {
        throw new ApiError(404, 'Employee not found');
      }

      logger.info(`Employee status updated: ${employee.employeeNo} -> ${status}`);
      return employee;
    } catch (error) {
      logger.error('Error updating employee status:', error);
      throw error;
    }
  }

  /**
   * 获取近期入职员工
   */
  async getRecentHires(days: number = 30): Promise<any[]> {
    return this.employeeRepository.getRecentHires(days);
  }

  /**
   * 获取本月生日员工
   */
  async getBirthdayEmployees(): Promise<any[]> {
    return this.employeeRepository.getBirthdayEmployees();
  }
}

// ===== Attendance Service =====

export class AttendanceService extends BaseService<any> {
  private attendanceRepository: AttendanceRepository;

  constructor() {
    super(new AttendanceRepository());
    this.attendanceRepository = new AttendanceRepository();
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
    try {
      if (!employeeId) {
        throw new ApiError(400, 'Employee ID is required');
      }

      // 检查员工是否存在
      const employee = await new EmployeeService().findById(employeeId);
      if (!employee) {
        throw new ApiError(404, 'Employee not found');
      }

      // 检查是否已经签到
      const existing = await this.attendanceRepository.checkIn(
        employeeId,
        location,
        deviceInfo,
        latitude,
        longitude
      );

      logger.info(`Employee checked in: ${employeeId}`);
      return existing;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error during check-in:', error);
      throw new ApiError(500, 'Failed to check in');
    }
  }

  /**
   * 打卡签退
   */
  async checkOut(
    id: string,
    location?: string,
    latitude?: number,
    longitude?: number
  ): Promise<any | null> {
    try {
      this.validateId(id);

      const attendance = await this.attendanceRepository.checkOut(id, location, latitude, longitude);
      if (!attendance) {
        throw new ApiError(404, 'Attendance record not found');
      }

      logger.info(`Employee checked out: ${attendance.employeeId}`);
      return attendance;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error during check-out:', error);
      throw new ApiError(500, 'Failed to check out');
    }
  }

  /**
   * 获取员工考勤记录
   */
  async getEmployeeAttendance(
    employeeId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any[]> {
    if (!employeeId) {
      throw new ApiError(400, 'Employee ID is required');
    }
    if (!startDate || !endDate) {
      throw new ApiError(400, 'Start date and end date are required');
    }

    return this.attendanceRepository.findByEmployee(employeeId, startDate, endDate);
  }

  /**
   * 获取月度考勤汇总
   */
  async getMonthlySummary(employeeId: string, year: number, month: number): Promise<any> {
    if (!employeeId) {
      throw new ApiError(400, 'Employee ID is required');
    }
    if (!year || !month || month < 1 || month > 12) {
      throw new ApiError(400, 'Invalid year or month');
    }

    return this.attendanceRepository.getMonthlySummary(employeeId, year, month);
  }

  /**
   * 获取今日考勤
   */
  async getTodayAttendance(department?: string): Promise<any[]> {
    return this.attendanceRepository.getTodayAttendance(department);
  }

  /**
   * 获取考勤统计
   */
  async getAttendanceStats(startDate: Date, endDate: Date, department?: string): Promise<any> {
    if (!startDate || !endDate) {
      throw new ApiError(400, 'Start date and end date are required');
    }

    return this.attendanceRepository.getAttendanceStats(startDate, endDate, department);
  }
}

// ===== Leave Service =====

export class LeaveService extends BaseService<any> {
  private leaveRepository: LeaveRepository;

  constructor() {
    super(new LeaveRepository());
    this.leaveRepository = new LeaveRepository();
  }

  /**
   * 申请请假
   */
  async requestLeave(data: any): Promise<any> {
    try {
      // 验证数据
      if (!data.employeeId) {
        throw new ApiError(400, 'Employee ID is required');
      }
      if (!data.startDate || !data.endDate) {
        throw new ApiError(400, 'Start date and end date are required');
      }

      // 计算请假天数
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      if (days < 1) {
        throw new ApiError(400, 'End date must be after start date');
      }

      // 检查请假冲突
      const hasConflict = await this.leaveRepository.checkConflict(
        data.employeeId,
        startDate,
        endDate
      );

      if (hasConflict) {
        throw new ApiError(409, 'Leave request conflicts with existing leave');
      }

      data.days = days;
      data.status = data.status || 'pending';

      const leave = await this.create(data);
      logger.info(`Leave request created: ${leave.employeeId} - ${leave.type} (${leave.days} days)`);
      return leave;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error creating leave request:', error);
      throw new ApiError(500, 'Failed to create leave request');
    }
  }

  /**
   * 审批请假（通过）
   */
  async approveLeave(id: string, approverId: string, comments?: string): Promise<any | null> {
    try {
      this.validateId(id);

      const leave = await this.findById(id);
      if (!leave) {
        throw new ApiError(404, 'Leave request not found');
      }

      if (leave.status !== 'pending') {
        throw new ApiError(400, `Leave request is already ${leave.status}`);
      }

      const result = await this.leaveRepository.approveLeave(id, approverId, comments);
      logger.info(`Leave approved: ${leave.employeeId} - ${leave.type}`);
      return result;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error approving leave:', error);
      throw new ApiError(500, 'Failed to approve leave');
    }
  }

  /**
   * 审批请假（拒绝）
   */
  async rejectLeave(id: string, approverId: string, reason: string): Promise<any | null> {
    try {
      this.validateId(id);

      const leave = await this.findById(id);
      if (!leave) {
        throw new ApiError(404, 'Leave request not found');
      }

      if (leave.status !== 'pending') {
        throw new ApiError(400, `Leave request is already ${leave.status}`);
      }

      const result = await this.leaveRepository.rejectLeave(id, approverId, reason);
      logger.info(`Leave rejected: ${leave.employeeId} - ${leave.type}`);
      return result;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error rejecting leave:', error);
      throw new ApiError(500, 'Failed to reject leave');
    }
  }

  /**
   * 取消请假
   */
  async cancelLeave(id: string, reason: string): Promise<any | null> {
    try {
      this.validateId(id);

      const leave = await this.findById(id);
      if (!leave) {
        throw new ApiError(404, 'Leave request not found');
      }

      if (leave.status !== 'pending' && leave.status !== 'approved') {
        throw new ApiError(400, `Cannot cancel leave with status: ${leave.status}`);
      }

      const result = await this.update(id, {
        status: 'cancelled',
        notes: reason
      });

      logger.info(`Leave cancelled: ${leave.employeeId} - ${leave.type}`);
      return result;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error cancelling leave:', error);
      throw new ApiError(500, 'Failed to cancel leave');
    }
  }

  /**
   * 获取待审批请假
   */
  async getPendingLeaves(department?: string): Promise<any[]> {
    return this.leaveRepository.getPendingLeaves(department);
  }

  /**
   * 获取员工请假记录
   */
  async getEmployeeLeaves(employeeId: string): Promise<any[]> {
    if (!employeeId) {
      throw new ApiError(400, 'Employee ID is required');
    }
    return this.leaveRepository.findByEmployee(employeeId);
  }

  /**
   * 根据状态获取请假记录
   */
  async getLeavesByStatus(status: string, page: number = 1, limit: number = 10): Promise<any> {
    if (!status) {
      throw new ApiError(400, 'Status is required');
    }
    const validStatuses = ['pending', 'approved', 'rejected', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new ApiError(400, 'Invalid status');
    }

    const filter = { status };
    return this.paginate(filter, page, limit);
  }

  /**
   * 获取请假统计
   */
  async getLeaveStats(year: number, department?: string): Promise<any> {
    if (!year || year < 2000 || year > 2100) {
      throw new ApiError(400, 'Invalid year');
    }
    return this.leaveRepository.getLeaveStats(year, department);
  }

  /**
   * 获取员工可用假期天数
   */
  async getAvailableLeaveDays(employeeId: string): Promise<{ available: number; used: number; total: number }> {
    if (!employeeId) {
      throw new ApiError(400, 'Employee ID is required');
    }

    const used = await this.leaveRepository.getAvailableLeaveDays(employeeId);
    const totalAnnualLeave = 21; // 默认年假天数

    return {
      available: Math.max(0, totalAnnualLeave - used),
      used: used,
      total: totalAnnualLeave
    };
  }

  /**
   * 检查请假冲突
   */
  async checkLeaveConflict(employeeId: string, startDate: Date, endDate: Date): Promise<boolean> {
    if (!employeeId) {
      throw new ApiError(400, 'Employee ID is required');
    }
    if (!startDate || !endDate) {
      throw new ApiError(400, 'Start date and end date are required');
    }

    return this.leaveRepository.checkConflict(employeeId, startDate, endDate);
  }
}

// ============================================
// 默认导出
// ============================================

export default {
  EmployeeService,
  AttendanceService,
  LeaveService
};