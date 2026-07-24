/**
 * @file Routes/hr.routes.ts
 * 人力资源管理路由 - 员工、部门、考勤、薪资
 * 完整实现：补全员工、部门、考勤、薪资相关接口，权限分级控制，敏感字段脱敏
 */

import { Router } from 'express';
import { asyncHandler } from '../src/middlewares/error-handler.middleware';
import { authMiddleware } from '../src/middlewares/auth.middleware';
import { validate } from '../src/middlewares/validation.middleware';
import { hrController } from '../src/Controllers';
import * as Joi from 'joi';

const router = Router();

// ============================================
// 验证 Schema
// ============================================

const createEmployeeSchema = Joi.object({
  employeeId: Joi.string().max(50).required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^1[3-9]\d{9}$/).required(),
  department: Joi.string().max(100).required(),
  position: Joi.string().max(100).required(),
  hireDate: Joi.date().required(),
  salary: Joi.number().min(0).required(),
  status: Joi.string().valid('active', 'on_leave', 'terminated', 'probation').default('active'),
  address: Joi.string().max(200).optional(),
  emergencyContact: Joi.string().max(200).optional(),
  birthDate: Joi.date().optional(),
  gender: Joi.string().valid('male', 'female', 'other').optional(),
  employeeType: Joi.string().valid('full_time', 'part_time', 'contract', 'intern').default('full_time'),
});

const listQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  department: Joi.string().optional(),
  status: Joi.string().valid('active', 'on_leave', 'terminated', 'probation').optional(),
  employeeType: Joi.string().valid('full_time', 'part_time', 'contract', 'intern').optional(),
  keyword: Joi.string().optional(),
  sortBy: Joi.string().valid('firstName', 'hireDate', 'salary', 'createdAt').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const attendanceSchema = Joi.object({
  employeeId: Joi.number().integer().positive().required(),
  date: Joi.date().required(),
  checkIn: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
  checkOut: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
  status: Joi.string().valid('present', 'absent', 'late', 'early_leave', 'overtime').default('present'),
  note: Joi.string().max(200).optional(),
});

const salarySchema = Joi.object({
  employeeId: Joi.number().integer().positive().required(),
  month: Joi.string().pattern(/^\d{4}-\d{2}$/).required(),
  baseSalary: Joi.number().min(0).required(),
  bonus: Joi.number().min(0).default(0),
  allowance: Joi.number().min(0).default(0),
  deductions: Joi.number().min(0).default(0),
  overtimePay: Joi.number().min(0).default(0),
  netPay: Joi.number().min(0).required(),
});

// ============================================
// 路由定义
// ============================================

/**
 * 创建员工
 * POST /api/v1/hr/employees
 */
router.post(
  '/employees',
  authMiddleware({ required: true, permissions: ['hr:employee:create'] }),
  validate(createEmployeeSchema, 'body'),
  asyncHandler(async (req, res) => {
    const result = await hrController.createEmployee(req.validatedBody);
    res.status(201).json({
      success: true,
      data: result,
      message: '员工创建成功',
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 获取员工列表
 * GET /api/v1/hr/employees
 */
router.get(
  '/employees',
  authMiddleware({ required: true, permissions: ['hr:employee:list'] }),
  validate(listQuerySchema, 'query'),
  asyncHandler(async (req, res) => {
    const { page, limit, sortBy, sortOrder, ...filters } = req.validatedQuery;
    const result = await hrController.getEmployeeList({
      page,
      limit,
      sortBy,
      sortOrder,
      filters,
    });
    res.json({
      success: true,
      data: result.items,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 获取员工详情（脱敏）
 * GET /api/v1/hr/employees/:id
 */
router.get(
  '/employees/:id',
  authMiddleware({ required: true, permissions: ['hr:employee:view'] }),
  validate(idParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const id = req.validatedParams.id;
    const result = await hrController.getEmployeeById(id);
    // 敏感字段脱敏
    if (result) {
      delete result.salary;
      delete result.bankAccount;
      delete result.idNumber;
    }
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 更新员工信息
 * PUT /api/v1/hr/employees/:id
 */
router.put(
  '/employees/:id',
  authMiddleware({ required: true, permissions: ['hr:employee:update'] }),
  validate(idParamSchema, 'params'),
  validate(createEmployeeSchema.optional(), 'body'),
  asyncHandler(async (req, res) => {
    const id = req.validatedParams.id;
    const result = await hrController.updateEmployee(id, req.validatedBody);
    res.json({
      success: true,
      data: result,
      message: '员工信息更新成功',
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 删除员工
 * DELETE /api/v1/hr/employees/:id
 */
router.delete(
  '/employees/:id',
  authMiddleware({ required: true, permissions: ['hr:employee:delete'] }),
  validate(idParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const id = req.validatedParams.id;
    await hrController.deleteEmployee(id);
    res.json({
      success: true,
      message: '员工删除成功',
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 记录考勤
 * POST /api/v1/hr/attendance
 */
router.post(
  '/attendance',
  authMiddleware({ required: true, permissions: ['hr:attendance:create'] }),
  validate(attendanceSchema, 'body'),
  asyncHandler(async (req, res) => {
    const result = await hrController.recordAttendance(req.validatedBody);
    res.status(201).json({
      success: true,
      data: result,
      message: '考勤记录成功',
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 获取员工考勤记录
 * GET /api/v1/hr/employees/:id/attendance
 */
router.get(
  '/employees/:id/attendance',
  authMiddleware({ required: true, permissions: ['hr:attendance:view'] }),
  validate(idParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const id = req.validatedParams.id;
    const result = await hrController.getEmployeeAttendance(id, req.query);
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 创建薪资记录
 * POST /api/v1/hr/salaries
 */
router.post(
  '/salaries',
  authMiddleware({ required: true, permissions: ['hr:salary:create'] }),
  validate(salarySchema, 'body'),
  asyncHandler(async (req, res) => {
    const result = await hrController.createSalaryRecord(req.validatedBody);
    res.status(201).json({
      success: true,
      data: result,
      message: '薪资记录创建成功',
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 获取HR统计概览
 * GET /api/v1/hr/stats
 */
router.get(
  '/stats/overview',
  authMiddleware({ required: true, permissions: ['hr:stats'] }),
  asyncHandler(async (req, res) => {
    const result = await hrController.getHRStatistics();
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 获取部门列表
 * GET /api/v1/hr/departments
 */
router.get(
  '/departments',
  authMiddleware({ required: true, permissions: ['hr:view'] }),
  asyncHandler(async (req, res) => {
    const result = await hrController.getDepartments();
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  })
);

export default router;