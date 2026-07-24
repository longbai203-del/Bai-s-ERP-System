/**
 * @file Repositories/Finance.repository.ts
 * 财务仓储 - 财务数据访问层
 */

import { Repository, DataSource, Like, In, Between, FindOptionsWhere, Sum } from 'typeorm';
import { Finance } from '../Models/Finance.model';
import { BaseRepository, PaginationOptions, PaginatedResult } from './BaseRepository';
import { logger } from '../Config/winston.config';
import dataSource from '../Config/database';

export interface InvoiceFilters {
  status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  customerId?: number;
  dateFrom?: Date;
  dateTo?: Date;
  minAmount?: number;
  maxAmount?: number;
  keyword?: string;
}

export class FinanceRepository extends BaseRepository<Finance> {
  private financeRepository: Repository<Finance>;

  constructor(dataSource: DataSource) {
    super(dataSource, Finance);
    this.financeRepository = dataSource.getRepository(Finance);
  }

  /**
   * 根据发票号查找
   */
  async findByInvoiceNumber(invoiceNumber: string): Promise<Finance | null> {
    try {
      return await this.financeRepository.findOne({
        where: { invoiceNumber },
      });
    } catch (error) {
      logger.error('[FinanceRepository] 根据发票号查找失败', { invoiceNumber, error });
      throw error;
    }
  }

  /**
   * 根据客户ID查找发票
   */
  async findByCustomerId(customerId: number): Promise<Finance[]> {
    try {
      return await this.financeRepository.find({
        where: { customerId },
        order: { issueDate: 'DESC' },
      });
    } catch (error) {
      logger.error('[FinanceRepository] 根据客户ID查找失败', { customerId, error });
      throw error;
    }
  }

  /**
   * 分页查询发票
   */
  async searchInvoices(
    filters: InvoiceFilters,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<Finance>> {
    try {
      const where: FindOptionsWhere<Finance> = {};

      if (filters.status) {
        where.status = filters.status;
      }
      if (filters.customerId) {
        where.customerId = filters.customerId;
      }
      if (filters.dateFrom || filters.dateTo) {
        const dateRange: any = {};
        if (filters.dateFrom) {
          dateRange.gte = filters.dateFrom;
        }
        if (filters.dateTo) {
          dateRange.lte = filters.dateTo;
        }
        where.issueDate = dateRange;
      }
      if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
        const amountRange: any = {};
        if (filters.minAmount !== undefined) {
          amountRange.gte = filters.minAmount;
        }
        if (filters.maxAmount !== undefined) {
          amountRange.lte = filters.maxAmount;
        }
        where.totalAmount = amountRange;
      }
      if (filters.keyword) {
        where.invoiceNumber = Like(`%${filters.keyword}%`);
      }

      return await this.findWithPagination(pagination, where);
    } catch (error) {
      logger.error('[FinanceRepository] 搜索发票失败', { filters, error });
      throw error;
    }
  }

  /**
   * 获取财务统计数据
   */
  async getFinancialStats(): Promise<{
    totalInvoices: number;
    totalAmount: number;
    totalPaid: number;
    totalOverdue: number;
    paidAmount: number;
    overdueAmount: number;
    averageInvoiceAmount: number;
  }> {
    try {
      const stats = await this.financeRepository
        .createQueryBuilder('finance')
        .select([
          'COUNT(*) as totalInvoices',
          'SUM(totalAmount) as totalAmount',
          'SUM(CASE WHEN status = "paid" THEN totalAmount ELSE 0 END) as paidAmount',
          'SUM(CASE WHEN status = "overdue" THEN totalAmount ELSE 0 END) as overdueAmount',
          'SUM(CASE WHEN status = "paid" THEN 1 ELSE 0 END) as totalPaid',
          'SUM(CASE WHEN status = "overdue" THEN 1 ELSE 0 END) as totalOverdue',
          'AVG(totalAmount) as averageInvoiceAmount',
        ])
        .getRawOne();

      return {
        totalInvoices: parseInt(stats.totalInvoices, 10) || 0,
        totalAmount: parseFloat(stats.totalAmount) || 0,
        totalPaid: parseInt(stats.totalPaid, 10) || 0,
        totalOverdue: parseInt(stats.totalOverdue, 10) || 0,
        paidAmount: parseFloat(stats.paidAmount) || 0,
        overdueAmount: parseFloat(stats.overdueAmount) || 0,
        averageInvoiceAmount: parseFloat(stats.averageInvoiceAmount) || 0,
      };
    } catch (error) {
      logger.error('[FinanceRepository] 获取财务统计失败', { error });
      throw error;
    }
  }

  /**
   * 获取月度收入趋势
   */
  async getMonthlyRevenue(year: number): Promise<Array<{ month: number; amount: number }>> {
    try {
      const results = await this.financeRepository
        .createQueryBuilder('finance')
        .select([
          'MONTH(issueDate) as month',
          'SUM(totalAmount) as amount',
        ])
        .where('YEAR(issueDate) = :year', { year })
        .andWhere('status = "paid"')
        .groupBy('MONTH(issueDate)')
        .orderBy('month', 'ASC')
        .getRawMany();

      return results.map(r => ({
        month: parseInt(r.month, 10),
        amount: parseFloat(r.amount) || 0,
      }));
    } catch (error) {
      logger.error('[FinanceRepository] 获取月度收入失败', { year, error });
      throw error;
    }
  }

  /**
   * 更新发票状态
   */
  async updateInvoiceStatus(id: number, status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'): Promise<boolean> {
    try {
      const result = await this.financeRepository.update(
        { id },
        { status }
      );
      return result.affected !== undefined && result.affected > 0;
    } catch (error) {
      logger.error('[FinanceRepository] 更新发票状态失败', { id, status, error });
      throw error;
    }
  }

  /**
   * 标记过期发票
   */
  async markOverdueInvoices(): Promise<number> {
    try {
      const result = await this.financeRepository
        .createQueryBuilder()
        .update(Finance)
        .set({ status: 'overdue' })
        .where('status = "sent"')
        .andWhere('dueDate < NOW()')
        .execute();

      return result.affected || 0;
    } catch (error) {
      logger.error('[FinanceRepository] 标记过期发票失败', { error });
      throw error;
    }
  }

  /**
   * 获取客户应收账款
   */
  async getCustomerReceivables(customerId: number): Promise<{
    totalReceivables: number;
    overdueReceivables: number;
    paidReceivables: number;
  }> {
    try {
      const stats = await this.financeRepository
        .createQueryBuilder('finance')
        .select([
          'SUM(CASE WHEN status != "paid" AND status != "cancelled" THEN totalAmount ELSE 0 END) as totalReceivables',
          'SUM(CASE WHEN status = "overdue" THEN totalAmount ELSE 0 END) as overdueReceivables',
          'SUM(CASE WHEN status = "paid" THEN totalAmount ELSE 0 END) as paidReceivables',
        ])
        .where('customerId = :customerId', { customerId })
        .getRawOne();

      return {
        totalReceivables: parseFloat(stats.totalReceivables) || 0,
        overdueReceivables: parseFloat(stats.overdueReceivables) || 0,
        paidReceivables: parseFloat(stats.paidReceivables) || 0,
      };
    } catch (error) {
      logger.error('[FinanceRepository] 获取客户应收账款失败', { customerId, error });
      throw error;
    }
  }

  /**
   * 获取发票项统计
   */
  async getInvoiceItemStats(invoiceId: number): Promise<{
    totalItems: number;
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    total: number;
  }> {
    try {
      const invoice = await this.financeRepository.findOne({
        where: { id: invoiceId },
      });

      if (!invoice) {
        return { totalItems: 0, subtotal: 0, taxAmount: 0, discountAmount: 0, total: 0 };
      }

      // 这里假设 items 是 JSON 字段
      const items = invoice.items || [];
      let subtotal = 0;
      let taxAmount = 0;
      let discountAmount = 0;

      for (const item of items) {
        const itemTotal = item.quantity * item.unitPrice;
        subtotal += itemTotal;
        taxAmount += itemTotal * (item.taxRate || 0) / 100;
        discountAmount += itemTotal * (item.discount || 0) / 100;
      }

      return {
        totalItems: items.length,
        subtotal,
        taxAmount,
        discountAmount,
        total: subtotal + taxAmount - discountAmount,
      };
    } catch (error) {
      logger.error('[FinanceRepository] 获取发票项统计失败', { invoiceId, error });
      throw error;
    }
  }
}

export const financeRepository = new FinanceRepository(dataSource);
export default financeRepository;