/**
 * 客户控制器
 * @module Controllers/CustomerController
 * @description 客户管理控制器
 */

import { Request, Response, NextFunction } from 'express';
import { BaseController } from './BaseController';
import { CustomerService } from '../services/Customer.service';
import { successResponse } from '../utils/response';
import { AppError } from '../middlewares/validator';
import { logger } from '../utils/logger';

const customerService = new CustomerService();

export class CustomerController extends BaseController<any> {
  constructor() {
    super(customerService);
  }

  /**
   * 搜索客户
   */
  search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { keyword, ...filter } = req.query;
      const result = await customerService.search(keyword as string, filter);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 更新客户状态
   */
  updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const result = await customerService.updateStatus(id, status);
      if (!result) {
        throw new AppError('客户不存在', 404, 'NOT_FOUND');
      }

      successResponse(res, result, '状态更新成功');
    } catch (error) {
      next(error);
    }
  };

  /**
   * 获取客户的订单
   */
  getOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await customerService.getOrders(id);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 获取客户统计
   */
  getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await customerService.getStats();
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  };
}