import { Request, Response } from 'express';
import { BaseController } from '../controllers/BaseController';
import { InventoryService } from '../services/Inventory.service';

export class InventoryController extends BaseController<any> {
  private inventoryService: InventoryService;
  
  constructor() {
    super(new InventoryService());
    this.inventoryService = new InventoryService();
  }
  
  async getByCode(req: Request, res: Response) {
    try {
      const data = await this.inventoryService.findByCode(req.params.code);
      if (!data) {
        return res.json({ code: 404, message: 'Inventory not found' });
      }
      res.json({ code: 200, data, message: 'success' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async updateStock(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const data = await this.inventoryService.updateStock(id, quantity);
      if (!data) {
        return res.json({ code: 404, message: 'Inventory not found' });
      }
      res.json({ code: 200, data, message: 'Stock updated successfully' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async search(req: Request, res: Response) {
    try {
      const { keyword } = req.query;
      if (!keyword) {
        return this.getAll(req, res);
      }
      const data = await this.inventoryService.search(keyword as string);
      res.json({ code: 200, data, message: 'success' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
}
