import { Request, Response } from 'express';
import { BaseController } from '../controllers/BaseController';
import { ProductService } from '../services/Product.service';

export class ProductController extends BaseController<any> {
  private productService: ProductService;
  
  constructor() {
    super(new ProductService());
    this.productService = new ProductService();
  }
  
  async search(req: Request, res: Response) {
    try {
      const { keyword } = req.query;
      if (!keyword) {
        return this.getAll(req, res);
      }
      const data = await this.productService.search(keyword as string);
      res.json({ code: 200, data, message: 'success' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async getByCode(req: Request, res: Response) {
    try {
      const data = await this.productService.findByCode(req.params.code);
      if (!data) {
        return res.json({ code: 404, message: 'Product not found' });
      }
      res.json({ code: 200, data, message: 'success' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async getByCategory(req: Request, res: Response) {
    try {
      const data = await this.productService.findByCategory(req.params.category);
      res.json({ code: 200, data, message: 'success' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async updateStock(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const data = await this.productService.updateStock(id, quantity);
      if (!data) {
        return res.json({ code: 404, message: 'Product not found' });
      }
      res.json({ code: 200, data, message: 'Stock updated successfully' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async getLowStock(req: Request, res: Response) {
    try {
      const threshold = parseInt(req.query.threshold as string) || 10;
      const data = await this.productService.getLowStockProducts(threshold);
      res.json({ code: 200, data, message: 'success' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async getCategoryStats(req: Request, res: Response) {
    try {
      const data = await this.productService.getCategoryStatistics();
      res.json({ code: 200, data, message: 'success' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
}
