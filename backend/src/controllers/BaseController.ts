/**
 * 基础控制器
 * @module Controllers/BaseController
 * @description 提供通用的 CRUD 控制器方法
 */

import { Request, Response, NextFunction } from 'express';
import { BaseService } from '../services/BaseService';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response';
import { AppError } from '../middlewares/validator';
import { logger } from '../utils/logger';

export abstract class BaseController<T> {
  protected service: BaseService<T>;

  constructor(service: BaseService<T>) {
    this.service = service;
  }

  /**
   * 分页查询列表
   */
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.filter ? JSON.parse(req.query.filter as string) : {};
      const sort = req.query.sort ? JSON.parse(req.query.sort as string) : { createdAt: -1 };

      const result = await this.service.findAll({ page, limit, filter, sort });
      paginatedResponse(res, result.data, result.total, result.page, result.limit);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 按 ID 查询
   */
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const data = await this.service.findById(id);

      if (!data) {
        throw new AppError('记录不存在', 404, 'NOT_FOUND');
      }

      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 创建
   */
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = req.body;
      const result = await this.service.create(data);
      successResponse(res, result, '创建成功', 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 更新
   */
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const data = req.body;

      const result = await this.service.update(id, data);
      if (!result) {
        throw new AppError('记录不存在', 404, 'NOT_FOUND');
      }

      successResponse(res, result, '更新成功');
    } catch (error) {
      next(error);
    }
  };

  /**
   * 删除（软删除）
   */
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.service.delete(id);

      if (!result) {
        throw new AppError('记录不存在', 404, 'NOT_FOUND');
      }

      successResponse(res, null, '删除成功');
    } catch (error) {
      next(error);
    }
  };
}