import { Request, Response } from 'express';
import { BaseService } from '../services/BaseService';

export abstract class BaseController<T> {
  protected service: BaseService<T>;
  
  constructor(service: BaseService<T>) {
    this.service = service;
  }
  
  async getAll(req: Request, res: Response) {
    try {
      const { page, limit, ...filter } = req.query;
      const result = await this.service.paginate(
        filter,
        Number(page) || 1,
        Number(limit) || 10
      );
      res.json({ code: 200, data: result, message: 'success' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async getById(req: Request, res: Response) {
    try {
      const data = await this.service.findById(req.params.id);
      if (!data) {
        return res.json({ code: 404, message: 'Record not found' });
      }
      res.json({ code: 200, data, message: 'success' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async create(req: Request, res: Response) {
    try {
      const data = await this.service.create(req.body);
      res.json({ code: 200, data, message: 'success' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async update(req: Request, res: Response) {
    try {
      const data = await this.service.update(req.params.id, req.body);
      if (!data) {
        return res.json({ code: 404, message: 'Record not found' });
      }
      res.json({ code: 200, data, message: 'success' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async delete(req: Request, res: Response) {
    try {
      const result = await this.service.delete(req.params.id);
      if (!result) {
        return res.json({ code: 404, message: 'Record not found' });
      }
      res.json({ code: 200, message: 'Deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
}
