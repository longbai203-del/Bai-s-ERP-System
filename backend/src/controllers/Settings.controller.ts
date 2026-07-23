import { Request, Response } from 'express';
import { BaseController } from '../controllers/BaseController';
import { SystemSettingService, CompanyInfoService, EmailConfigService } from '../services/Settings.service';

export class SystemSettingController extends BaseController<any> {
  private systemSettingService: SystemSettingService;
  
  constructor() {
    super(new SystemSettingService());
    this.systemSettingService = new SystemSettingService();
  }
  
  async getByKey(req: Request, res: Response) {
    try {
      const data = await this.systemSettingService.getByKey(req.params.key);
      res.json({ code: 200, data, message: 'success' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async getByCategory(req: Request, res: Response) {
    try {
      const data = await this.systemSettingService.getByCategory(req.params.category);
      res.json({ code: 200, data, message: 'success' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async setSetting(req: Request, res: Response) {
    try {
      const { key, value, category, description } = req.body;
      const data = await this.systemSettingService.setSetting(key, value, category, description);
      res.json({ code: 200, data, message: 'Setting saved successfully' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async getMultipleKeys(req: Request, res: Response) {
    try {
      const { keys } = req.body;
      const data = await this.systemSettingService.getMultipleKeys(keys);
      res.json({ code: 200, data, message: 'success' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
}

export class CompanyInfoController extends BaseController<any> {
  private companyInfoService: CompanyInfoService;
  
  constructor() {
    super(new CompanyInfoService());
    this.companyInfoService = new CompanyInfoService();
  }
  
  async getCompanyInfo(req: Request, res: Response) {
    try {
      const data = await this.companyInfoService.getCompanyInfo();
      res.json({ code: 200, data, message: 'success' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async updateCompanyInfo(req: Request, res: Response) {
    try {
      const data = await this.companyInfoService.updateCompanyInfo(req.body);
      res.json({ code: 200, data, message: 'Company info updated successfully' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
}
