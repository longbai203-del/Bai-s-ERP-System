import { Router } from 'express';
import { EmployeeController, AttendanceController, LeaveController } from '../controllers/HR.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const employeeController = new EmployeeController();
const attendanceController = new AttendanceController();
const leaveController = new LeaveController();

// 员工路由
router.get('/employees/search', employeeController.search.bind(employeeController));
router.get('/employees/department/:department', employeeController.getByDepartment.bind(employeeController));
router.get('/employees/department-stats', employeeController.getDepartmentStats.bind(employeeController));
router.get('/employees/no/:no', employeeController.getByNo.bind(employeeController));

router.use(authMiddleware);
router.get('/employees', employeeController.getAll.bind(employeeController));
router.get('/employees/:id', employeeController.getById.bind(employeeController));
router.post('/employees', employeeController.create.bind(employeeController));
router.put('/employees/:id', employeeController.update.bind(employeeController));
router.delete('/employees/:id', employeeController.delete.bind(employeeController));

// 考勤路由
router.post('/attendance/check-in', attendanceController.checkIn.bind(attendanceController));
router.patch('/attendance/:id/check-out', attendanceController.checkOut.bind(attendanceController));
router.get('/attendance/:employeeId/:year/:month', attendanceController.getMonthlySummary.bind(attendanceController));

// 请假路由
router.get('/leaves/pending', leaveController.getPendingLeaves.bind(leaveController));
router.get('/leaves/employee/:employeeId', leaveController.getEmployeeLeaves.bind(leaveController));
router.post('/leaves', leaveController.requestLeave.bind(leaveController));
router.patch('/leaves/:id/approve', leaveController.approveLeave.bind(leaveController));
router.patch('/leaves/:id/reject', leaveController.rejectLeave.bind(leaveController));

export default router;
