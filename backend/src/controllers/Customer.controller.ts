import { Request, Response } from 'express';
import { BaseController } from '../controllers/BaseController';
import { CustomerService } from '../services/Customer.service';

export class CustomerController extends BaseController<any> {
  private customerService: CustomerService;
  
  constructor() {
    super(new CustomerService());
    this.customerService = new CustomerService();
  }
  
  async search(req: Request, res: Response) {
    try {
      const { keyword } = req.query;
      if (!keyword) {
        return this.getAll(req, res);
      }
      const data = await this.customerService.search(keyword as string);
      res.json({ code: 200, data, message: 'success' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async getByEmail(req: Request, res: Response) {
    try {
      const data = await this.customerService.findByEmail(req.params.email);
      if (!data) {
        return res.json({ code: 404, message: 'Customer not found' });
      }
      res.json({ code: 200, data, message: 'success' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async getByCode(req: Request, res: Response) {
    try {
      const data = await this.customerService.findByCode(req.params.code);
      if (!data) {
        return res.json({ code: 404, message: 'Customer not found' });
      }
      res.json({ code: 200, data, message: 'success' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async updateBalance(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { amount } = req.body;
      const data = await this.customerService.updateBalance(id, amount);
      if (!data) {
        return res.json({ code: 404, message: 'Customer not found' });
      }
      res.json({ code: 200, data, message: 'Balance updated successfully' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async toggleStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await this.customerService.toggleStatus(id);
      if (!data) {
        return res.json({ code: 404, message: 'Customer not found' });
      }
      res.json({ code: 200, data, message: 'Status toggled successfully' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
}
