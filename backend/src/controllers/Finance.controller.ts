import { Request, Response } from 'express';
import { BaseController } from '../controllers/BaseController';
import { TransactionService, AccountService } from '../services/Finance.service';

export class TransactionController extends BaseController<any> {
  private transactionService: TransactionService;
  
  constructor() {
    super(new TransactionService());
    this.transactionService = new TransactionService();
  }
  
  async getByNo(req: Request, res: Response) {
    try {
      const data = await this.transactionService.findByTransactionNo(req.params.no);
      if (!data) {
        return res.json({ code: 404, message: 'Transaction not found' });
      }
      res.json({ code: 200, data, message: 'success' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async getByDateRange(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      const data = await this.transactionService.getByDateRange(
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.json({ code: 200, data, message: 'success' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async getSummary(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      const data = await this.transactionService.getSummary(
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.json({ code: 200, data, message: 'success' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async approve(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { approvedBy } = req.body;
      const data = await this.transactionService.approveTransaction(id, approvedBy);
      if (!data) {
        return res.json({ code: 404, message: 'Transaction not found' });
      }
      res.json({ code: 200, data, message: 'Transaction approved' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async cancel(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      const data = await this.transactionService.cancelTransaction(id, notes);
      if (!data) {
        return res.json({ code: 404, message: 'Transaction not found' });
      }
      res.json({ code: 200, data, message: 'Transaction cancelled' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
}

export class AccountController extends BaseController<any> {
  private accountService: AccountService;
  
  constructor() {
    super(new AccountService());
    this.accountService = new AccountService();
  }
  
  async getByCode(req: Request, res: Response) {
    try {
      const data = await this.accountService.findByCode(req.params.code);
      if (!data) {
        return res.json({ code: 404, message: 'Account not found' });
      }
      res.json({ code: 200, data, message: 'success' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
  
  async getBalanceSummary(req: Request, res: Response) {
    try {
      const data = await this.accountService.getBalanceSummary();
      res.json({ code: 200, data, message: 'success' });
    } catch (error: any) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
}
