import { Request, Response } from 'express';
import { BaseController } from '../controllers/BaseController';
import { EmployeeService, AttendanceService, LeaveService } from '../services/HR.service';

export class EmployeeController extends BaseController<any> {
  private employeeService: EmployeeService;
  
  constructor() {
    super(new EmployeeService());
    this.employeeService = new EmployeeService();
  }
  
  async search(req: Request, res: Response) {
    try {
      const { keyword } = req.query;
      if (!keyword) {
        return this.getAll(req, res);
      }
      const data = await this.employeeService.search(keyword as string);
      res.json({ code: 200, data, message: 'success' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async getByNo(req: Request, res: Response) {
    try {
      const data = await this.employeeService.findByEmployeeNo(req.params.no);
      if (!data) {
        return res.json({ code: 404, message: 'Employee not found' });
      }
      res.json({ code: 200, data, message: 'success' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async getByDepartment(req: Request, res: Response) {
    try {
      const data = await this.employeeService.findByDepartment(req.params.department);
      res.json({ code: 200, data, message: 'success' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async getDepartmentStats(req: Request, res: Response) {
    try {
      const data = await this.employeeService.getDepartmentStats();
      res.json({ code: 200, data, message: 'success' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
}

export class AttendanceController extends BaseController<any> {
  private attendanceService: AttendanceService;
  
  constructor() {
    super(new AttendanceService());
    this.attendanceService = new AttendanceService();
  }
  
  async checkIn(req: Request, res: Response) {
    try {
      const { employeeId } = req.body;
      const data = await this.attendanceService.checkIn(employeeId);
      res.json({ code: 200, data, message: 'Checked in successfully' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async checkOut(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await this.attendanceService.checkOut(id);
      if (!data) {
        return res.json({ code: 404, message: 'Attendance record not found' });
      }
      res.json({ code: 200, data, message: 'Checked out successfully' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async getMonthlySummary(req: Request, res: Response) {
    try {
      const { employeeId, year, month } = req.params;
      const data = await this.attendanceService.getMonthlySummary(
        employeeId,
        parseInt(year),
        parseInt(month)
      );
      res.json({ code: 200, data, message: 'success' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
}

export class LeaveController extends BaseController<any> {
  private leaveService: LeaveService;
  
  constructor() {
    super(new LeaveService());
    this.leaveService = new LeaveService();
  }
  
  async requestLeave(req: Request, res: Response) {
    try {
      const data = await this.leaveService.requestLeave(req.body);
      res.json({ code: 200, data, message: 'Leave requested successfully' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async approveLeave(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { approvedBy } = req.body;
      const data = await this.leaveService.approveLeave(id, approvedBy);
      if (!data) {
        return res.json({ code: 404, message: 'Leave request not found' });
      }
      res.json({ code: 200, data, message: 'Leave approved' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async rejectLeave(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      const data = await this.leaveService.rejectLeave(id, notes);
      if (!data) {
        return res.json({ code: 404, message: 'Leave request not found' });
      }
      res.json({ code: 200, data, message: 'Leave rejected' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async getPendingLeaves(req: Request, res: Response) {
    try {
      const data = await this.leaveService.getPendingLeaves();
      res.json({ code: 200, data, message: 'success' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async getEmployeeLeaves(req: Request, res: Response) {
    try {
      const { employeeId } = req.params;
      const data = await this.leaveService.getEmployeeLeaves(employeeId);
      res.json({ code: 200, data, message: 'success' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
}
