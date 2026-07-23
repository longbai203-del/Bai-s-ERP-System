import { Request, Response } from 'express';
import { BaseController } from '../controllers/BaseController';
import { OrderService } from '../services/Order.service';

export class OrderController extends BaseController<any> {
  private orderService: OrderService;
  
  constructor() {
    super(new OrderService());
    this.orderService = new OrderService();
  }
  
  async getByOrderNo(req: Request, res: Response) {
    try {
      const data = await this.orderService.findByOrderNo(req.params.orderNo);
      if (!data) {
        return res.json({ code: 404, message: 'Order not found' });
      }
      res.json({ code: 200, data, message: 'success' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async getByCustomer(req: Request, res: Response) {
    try {
      const data = await this.orderService.getOrdersByCustomer(req.params.customerId);
      res.json({ code: 200, data, message: 'success' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async getByStatus(req: Request, res: Response) {
    try {
      const data = await this.orderService.getOrdersByStatus(req.params.status);
      res.json({ code: 200, data, message: 'success' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const data = await this.orderService.updateOrderStatus(id, status);
      if (!data) {
        return res.json({ code: 404, message: 'Order not found' });
      }
      res.json({ code: 200, data, message: 'Status updated successfully' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async cancelOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const data = await this.orderService.cancelOrder(id, reason);
      if (!data) {
        return res.json({ code: 404, message: 'Order not found' });
      }
      res.json({ code: 200, data, message: 'Order cancelled successfully' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async getStatistics(req: Request, res: Response) {
    try {
      const data = await this.orderService.getOrderStatistics();
      res.json({ code: 200, data, message: 'success' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
}
