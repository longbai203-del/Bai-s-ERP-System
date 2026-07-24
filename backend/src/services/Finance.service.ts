/**
 * Finance Service - 财务业务逻辑层
 * 提供交易和账户相关的完整业务逻辑处理
 * 包含交易管理、账户管理、报表生成、财务分析等
 */

import { BaseService } from './BaseService';
import { TransactionRepository, AccountRepository } from '../repositories/Finance.repository';
import { generateCode } from '../utils';
import { ApiError } from '../exceptions/api.error';
import logger from '../utils/logger';

export interface TransactionQueryOptions {
  type?: string;
  status?: string;
  category?: string;
  accountId?: string;
  customerId?: string;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FinancialReportOptions {
  startDate: Date;
  endDate: Date;
  groupBy?: 'day' | 'week' | 'month' | 'year';
  accountId?: string;
  category?: string;
}

// ===== Transaction Service =====

export class TransactionService extends BaseService<any> {
  private transactionRepository: TransactionRepository;

  constructor() {
    super(new TransactionRepository());
    this.transactionRepository = new TransactionRepository();
  }

  // ============================================
  // 基础 CRUD（增强版）
  // ============================================

  /**
   * 创建交易（自动生成交易编号）
   */
  async createTransaction(data: any): Promise<any> {
    try {
      // 验证数据
      if (!data.amount || data.amount <= 0) {
        throw new ApiError(400, 'Amount must be greater than 0');
      }

      // 生成交易编号
      data.transactionNo = generateCode('TXN');
      data.status = data.status || 'pending';
      data.transactionDate = data.transactionDate || new Date();

      const transaction = await this.create(data);
      logger.info(`Transaction created: ${transaction.transactionNo} - ${transaction.amount}`);
      return transaction;
    } catch (error) {
      logger.error('Error creating transaction:', error);
      throw error;
    }
  }

  /**
   * 更新交易
   */
  async updateTransaction(id: string, data: any): Promise<any | null> {
    try {
      this.validateId(id);
      const transaction = await this.transactionRepository.findById(id);
      if (!transaction) {
        throw new ApiError(404, 'Transaction not found');
      }

      if (transaction.status === 'completed') {
        throw new ApiError(400, 'Cannot update completed transaction');
      }

      if (transaction.status === 'cancelled') {
        throw new ApiError(400, 'Cannot update cancelled transaction');
      }

      const result = await this.update(id, data);
      logger.info(`Transaction updated: ${transaction.transactionNo}`);
      return result;
    } catch (error) {
      logger.error('Error updating transaction:', error);
      throw error;
    }
  }

  // ============================================
  // 查询方法
  // ============================================

  /**
   * 根据交易编号查询
   */
  async getByTransactionNo(no: string): Promise<any | null> {
    if (!no) return null;
    return this.transactionRepository.findByTransactionNo(no);
  }

  /**
   * 根据类型查询
   */
  async getByType(type: string): Promise<any[]> {
    if (!type) return [];
    return this.transactionRepository.findByType(type);
  }

  /**
   * 根据状态查询
   */
  async getByStatus(status: string): Promise<any[]> {
    if (!status) return [];
    return this.transactionRepository.findByStatus(status);
  }

  /**
   * 根据日期范围查询
   */
  async getByDateRange(startDate: Date, endDate: Date): Promise<any[]> {
    if (!startDate || !endDate) {
      throw new ApiError(400, 'Start date and end date are required');
    }
    return this.transactionRepository.findByDateRange(startDate, endDate);
  }

  /**
   * 高级搜索
   */
  async advancedSearch(options: TransactionQueryOptions): Promise<any[]> {
    return this.transactionRepository.advancedSearch(options);
  }

  /**
   * 获取交易列表（分页）
   */
  async getTransactionList(page: number = 1, limit: number = 10, filters?: any): Promise<any> {
    return this.paginate(filters || {}, page, limit);
  }

  // ============================================
  // 财务分析方法
  // ============================================

  /**
   * 获取交易汇总
   */
  async getSummary(startDate: Date, endDate: Date): Promise<any> {
    if (!startDate || !endDate) {
      throw new ApiError(400, 'Start date and end date are required');
    }
    return this.transactionRepository.getSummary(startDate, endDate);
  }

  /**
   * 获取收入统计（按日/周/月分组）
   */
  async getRevenueStats(
    startDate: Date,
    endDate: Date,
    groupBy: 'day' | 'week' | 'month' = 'day'
  ): Promise<any[]> {
    if (!startDate || !endDate) {
      throw new ApiError(400, 'Start date and end date are required');
    }
    return this.transactionRepository.getRevenueByPeriod(startDate, endDate, groupBy);
  }

  /**
   * 获取支出统计（按分类）
   */
  async getExpenseStats(startDate: Date, endDate: Date): Promise<any[]> {
    if (!startDate || !endDate) {
      throw new ApiError(400, 'Start date and end date are required');
    }
    return this.transactionRepository.getExpensesByCategory(startDate, endDate);
  }

  /**
   * 获取利润/损益报告
   */
  async getProfitLoss(startDate: Date, endDate: Date): Promise<any> {
    if (!startDate || !endDate) {
      throw new ApiError(400, 'Start date and end date are required');
    }
    return this.transactionRepository.getProfitLoss(startDate, endDate);
  }

  /**
   * 获取账户余额
   */
  async getAccountBalance(accountId: string): Promise<number> {
    if (!accountId) {
      throw new ApiError(400, 'Account ID is required');
    }
    return this.transactionRepository.getBalance(accountId);
  }

  /**
   * 获取月度财务趋势
   */
  async getMonthlyTrend(year: number): Promise<any[]> {
    if (!year || year < 2000 || year > 2100) {
      throw new ApiError(400, 'Invalid year');
    }
    return this.transactionRepository.getMonthlyTrend(year);
  }

  /**
   * 生成财务报告
   */
  async generateFinancialReport(options: FinancialReportOptions): Promise<any> {
    const { startDate, endDate, accountId, category } = options;

    const summary = await this.getSummary(startDate, endDate);
    const profitLoss = await this.getProfitLoss(startDate, endDate);
    const revenueStats = await this.getRevenueStats(startDate, endDate, options.groupBy || 'month');
    const expenseStats = await this.getExpenseStats(startDate, endDate);

    let transactions = await this.getByDateRange(startDate, endDate);
    if (accountId) {
      transactions = transactions.filter((t: any) => t.accountId === accountId);
    }
    if (category) {
      transactions = transactions.filter((t: any) => t.category === category);
    }

    return {
      period: { startDate, endDate },
      summary,
      profitLoss,
      revenueStats,
      expenseStats,
      transactions,
      generatedAt: new Date().toISOString()
    };
  }

  // ============================================
  // 操作方法
  // ============================================

  /**
   * 审批交易
   */
  async approveTransaction(id: string, approverId: string): Promise<any | null> {
    try {
      this.validateId(id);
      const transaction = await this.findById(id);
      if (!transaction) {
        throw new ApiError(404, 'Transaction not found');
      }

      if (transaction.status === 'completed') {
        throw new ApiError(400, 'Transaction already approved');
      }

      if (transaction.status === 'cancelled') {
        throw new ApiError(400, 'Cannot approve cancelled transaction');
      }

      const result = await this.transactionRepository.approveTransaction(id, approverId);
      logger.info(`Transaction approved: ${transaction.transactionNo}`);
      return result;
    } catch (error) {
      logger.error('Error approving transaction:', error);
      throw error;
    }
  }

  /**
   * 取消交易
   */
  async cancelTransaction(id: string, reason: string): Promise<any | null> {
    try {
      this.validateId(id);
      const transaction = await this.findById(id);
      if (!transaction) {
        throw new ApiError(404, 'Transaction not found');
      }

      if (transaction.status === 'completed') {
        throw new ApiError(400, 'Cannot cancel completed transaction');
      }

      if (transaction.status === 'cancelled') {
        throw new ApiError(400, 'Transaction already cancelled');
      }

      const result = await this.transactionRepository.cancelTransaction(id, reason);
      logger.info(`Transaction cancelled: ${transaction.transactionNo}`);
      return result;
    } catch (error) {
      logger.error('Error cancelling transaction:', error);
      throw error;
    }
  }

  /**
   * 处理支付
   */
  async processPayment(data: any): Promise<any> {
    try {
      // 创建收入交易
      const transaction = await this.createTransaction({
        type: 'income',
        amount: data.amount,
        category: data.category || 'payment',
        description: data.description || 'Payment received',
        customerId: data.customerId,
        accountId: data.accountId,
        paymentMethod: data.paymentMethod,
        transactionDate: new Date()
      });

      return transaction;
    } catch (error) {
      logger.error('Error processing payment:', error);
      throw error;
    }
  }

  /**
   * 计算税费
   */
  async calculateTax(
    amount: number,
    taxRate: number = 0.15
  ): Promise<{ taxAmount: number; totalAmount: number }> {
    if (amount < 0) {
      throw new ApiError(400, 'Amount must be positive');
    }
    const taxAmount = amount * taxRate;
    return {
      taxAmount,
      totalAmount: amount + taxAmount
    };
  }
}

// ===== Account Service =====

export class AccountService extends BaseService<any> {
  private accountRepository: AccountRepository;

  constructor() {
    super(new AccountRepository());
    this.accountRepository = new AccountRepository();
  }

  /**
   * 创建账户
   */
  async createAccount(data: any): Promise<any> {
    try {
      data.accountCode = generateCode('ACC');
      data.balance = data.balance || 0;
      data.status = data.status || 'active';

      const account = await this.create(data);
      logger.info(`Account created: ${account.accountCode} - ${account.name}`);
      return account;
    } catch (error) {
      logger.error('Error creating account:', error);
      throw error;
    }
  }

  /**
   * 根据编码查询账户
   */
  async getByCode(code: string): Promise<any | null> {
    if (!code) return null;
    return this.accountRepository.findByCode(code);
  }

  /**
   * 根据类型查询账户
   */
  async getByType(type: string): Promise<any[]> {
    if (!type) return [];
    return this.accountRepository.findByType(type);
  }

  /**
   * 获取余额汇总
   */
  async getBalanceSummary(): Promise<any[]> {
    return this.accountRepository.getBalanceSummary();
  }

  /**
   * 获取账户详情（含交易记录）
   */
  async getAccountDetail(id: string, startDate?: Date, endDate?: Date): Promise<any> {
    this.validateId(id);
    return this.accountRepository.getAccountDetail(id, startDate, endDate);
  }

  /**
   * 更新账户余额
   */
  async updateAccountBalance(id: string, amount: number): Promise<any | null> {
    try {
      this.validateId(id);
      const account = await this.accountRepository.updateBalance(id, amount);
      if (!account) {
        throw new ApiError(404, 'Account not found');
      }
      logger.info(`Account balance updated: ${account.accountCode} - ${account.balance}`);
      return account;
    } catch (error) {
      logger.error('Error updating account balance:', error);
      throw error;
    }
  }
}

export default { TransactionService, AccountService };