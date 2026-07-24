/**
 * @file Routes/finance.routes.ts
 * 财务管理路由 - 发票、账务、报表、对账、导出
 * 完整实现：补全所有财务相关接口，报表统计、对账、导出接口，RBAC权限控制
 */

import { Router } from 'express';
import { asyncHandler } from '../src/middlewares/error-handler.middleware';
import { authMiddleware } from '../src/middlewares/auth.middleware';
import { validate } from '../src/middlewares/validation.middleware';
import { financeController } from '../src/Controllers';
import * as Joi from 'joi';

const router = Router();

// ============================================
// 验证 Schema
// ============================================

const createInvoiceSchema = Joi.object({
  customerId: Joi.number().integer().positive().required(),
  invoiceNumber: Joi.string().max(50).required(),
  issueDate: Joi.date().required(),
  dueDate: Joi.date().greater(Joi.ref('issueDate')).required(),
  items: Joi.array().items(
    Joi.object({
      description: Joi.string().max(200).required(),
      quantity: Joi.number().positive().required(),
      unitPrice: Joi.number().positive().required(),
      taxRate: Joi.number().min(0).max(100).default(0),
      discount: Joi.number().min(0).default(0),
    })
  ).min(1).required(),
  notes: Joi.string().max(500).optional(),
  status: Joi.string().valid('draft', 'sent', 'paid', 'overdue', 'cancelled').default('draft'),
});

const listQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  status: Joi.string().valid('draft', 'sent', 'paid', 'overdue', 'cancelled').optional(),
  customerId: Joi.number().integer().positive().optional(),
  dateFrom: Joi.date().optional(),
  dateTo: Joi.date().optional(),
  minAmount: Joi.number().positive().optional(),
  maxAmount: Joi.number().positive().optional(),
  keyword: Joi.string().optional(),
  sortBy: Joi.string().valid('issueDate', 'dueDate', 'totalAmount', 'status', 'createdAt').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const reportQuerySchema = Joi.object({
  year: Joi.number().integer().min(2000).max(2100).default(new Date().getFullYear()),
  month: Joi.number().integer().min(1).max(12).optional(),
  dateFrom: Joi.date().optional(),
  dateTo: Joi.date().optional(),
  type: Joi.string().valid('income', 'expense', 'all').default('all'),
});

// ============================================
// 路由定义
// ============================================

/**
 * 创建发票
 * POST /api/v1/finance/invoices
 */
router.post(
  '/invoices',
  authMiddleware({ required: true, permissions: ['finance:invoice:create'] }),
  validate(createInvoiceSchema, 'body'),
  asyncHandler(async (req, res) => {
    const result = await financeController.createInvoice(req.validatedBody);
    res.status(201).json({
      success: true,
      data: result,
      message: '发票创建成功',
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 获取发票列表
 * GET /api/v1/finance/invoices
 */
router.get(
  '/invoices',
  authMiddleware({ required: true, permissions: ['finance:invoice:list'] }),
  validate(listQuerySchema, 'query'),
  asyncHandler(async (req, res) => {
    const { page, limit, sortBy, sortOrder, ...filters } = req.validatedQuery;
    const result = await financeController.getInvoiceList({
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
 * 获取发票详情
 * GET /api/v1/finance/invoices/:id
 */
router.get(
  '/invoices/:id',
  authMiddleware({ required: true, permissions: ['finance:invoice:view'] }),
  validate(idParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const id = req.validatedParams.id;
    const result = await financeController.getInvoiceById(id);
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 更新发票
 * PUT /api/v1/finance/invoices/:id
 */
router.put(
  '/invoices/:id',
  authMiddleware({ required: true, permissions: ['finance:invoice:update'] }),
  validate(idParamSchema, 'params'),
  validate(createInvoiceSchema.optional(), 'body'),
  asyncHandler(async (req, res) => {
    const id = req.validatedParams.id;
    const result = await financeController.updateInvoice(id, req.validatedBody);
    res.json({
      success: true,
      data: result,
      message: '发票更新成功',
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 删除发票
 * DELETE /api/v1/finance/invoices/:id
 */
router.delete(
  '/invoices/:id',
  authMiddleware({ required: true, permissions: ['finance:invoice:delete'] }),
  validate(idParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const id = req.validatedParams.id;
    await financeController.deleteInvoice(id);
    res.json({
      success: true,
      message: '发票删除成功',
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 标记发票为已支付
 * POST /api/v1/finance/invoices/:id/pay
 */
router.post(
  '/invoices/:id/pay',
  authMiddleware({ required: true, permissions: ['finance:invoice:pay'] }),
  validate(idParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const id = req.validatedParams.id;
    const result = await financeController.markInvoiceAsPaid(id);
    res.json({
      success: true,
      data: result,
      message: '发票已标记为已支付',
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 获取财务统计概览
 * GET /api/v1/finance/stats
 */
router.get(
  '/stats/overview',
  authMiddleware({ required: true, permissions: ['finance:stats'] }),
  asyncHandler(async (req, res) => {
    const result = await financeController.getFinancialOverview();
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 获取月度收入趋势
 * GET /api/v1/finance/stats/revenue
 */
router.get(
  '/stats/revenue',
  authMiddleware({ required: true, permissions: ['finance:stats'] }),
  validate(reportQuerySchema, 'query'),
  asyncHandler(async (req, res) => {
    const { year } = req.validatedQuery;
    const result = await financeController.getMonthlyRevenue(year);
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 获取客户应收账款
 * GET /api/v1/finance/customers/:customerId/receivables
 */
router.get(
  '/customers/:customerId/receivables',
  authMiddleware({ required: true, permissions: ['finance:view'] }),
  validate(idParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const customerId = req.validatedParams.id;
    const result = await financeController.getCustomerReceivables(customerId);
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 导出财务报表
 * GET /api/v1/finance/reports/export
 */
router.get(
  '/reports/export',
  authMiddleware({ required: true, permissions: ['finance:reports'] }),
  validate(reportQuerySchema, 'query'),
  asyncHandler(async (req, res) => {
    const result = await financeController.exportFinancialReport(req.validatedQuery);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=financial_report_${Date.now()}.xlsx`);
    res.send(result);
  })
);

/**
 * 生成财务报表
 * GET /api/v1/finance/reports
 */
router.get(
  '/reports',
  authMiddleware({ required: true, permissions: ['finance:reports'] }),
  validate(reportQuerySchema, 'query'),
  asyncHandler(async (req, res) => {
    const result = await financeController.generateFinancialReport(req.validatedQuery);
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * 对账接口
 * POST /api/v1/finance/reconciliation
 */
router.post(
  '/reconciliation',
  authMiddleware({ required: true, permissions: ['finance:reconciliation'] }),
  asyncHandler(async (req, res) => {
    const result = await financeController.reconcileAccounts(req.body);
    res.json({
      success: true,
      data: result,
      message: '对账完成',
      timestamp: new Date().toISOString(),
    });
  })
);

export default router;