/**
 * @file Models/Customer.model.ts
 * 客户模型 - 完整的企业级客户数据模型
 */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { IsEmail, IsPhoneNumber, IsUrl, Length, MaxLength, IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { Order } from './Order.model';

export enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

export enum CustomerIndustry {
  TECHNOLOGY = 'technology',
  MANUFACTURING = 'manufacturing',
  RETAIL = 'retail',
  HEALTHCARE = 'healthcare',
  FINANCE = 'finance',
  EDUCATION = 'education',
  CONSTRUCTION = 'construction',
  HOSPITALITY = 'hospitality',
  LOGISTICS = 'logistics',
  ENERGY = 'energy',
  AGRICULTURE = 'agriculture',
  OTHER = 'other',
}

@Entity('customers')
@Index(['contactEmail'], { unique: true })
@Index(['contactPhone'])
@Index(['companyName', 'status'])
@Index(['industry', 'status'])
export class Customer {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  @Length(2, 100, { message: '公司名称长度必须在2-100个字符之间' })
  companyName!: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  @Length(2, 50, { message: '联系人姓名长度必须在2-50个字符之间' })
  contactName!: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  @MaxLength(100, { message: '邮箱地址不能超过100个字符' })
  contactEmail!: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  @IsPhoneNumber('CN', { message: '请输入有效的手机号' })
  contactPhone!: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  @IsOptional()
  @MaxLength(200, { message: '地址不能超过200个字符' })
  address?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsOptional()
  @MaxLength(50, { message: '税号不能超过50个字符' })
  taxId?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsOptional()
  @MaxLength(50, { message: '行业不能超过50个字符' })
  industry?: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  @IsOptional()
  @IsUrl({}, { message: '请输入有效的网址' })
  @MaxLength(200, { message: '网址不能超过200个字符' })
  website?: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @MaxLength(500, { message: '备注不能超过500个字符' })
  notes?: string;

  @Column({
    type: 'enum',
    enum: CustomerStatus,
    default: CustomerStatus.ACTIVE,
  })
  status!: CustomerStatus;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  @IsNumber({}, { message: '信用额度必须为数字' })
  @Min(0, { message: '信用额度不能为负数' })
  @Max(999999999999.99, { message: '信用额度超出最大限制' })
  creditLimit!: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  @IsNumber({}, { message: '余额必须为数字' })
  balance!: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsOptional()
  @MaxLength(50, { message: '客户等级不能超过50个字符' })
  customerLevel?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @IsOptional()
  @MaxLength(20, { message: '客户来源不能超过20个字符' })
  source?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsOptional()
  @MaxLength(50, { message: '所属销售不能超过50个字符' })
  salesRep?: string;

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  customFields?: Record<string, any>;

  @Column({ type: 'timestamp', nullable: true })
  lastContactDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  nextFollowUpDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastOrderDate?: Date;

  @Column({ type: 'int', default: 0 })
  orderCount!: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalSpent!: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  // ==================== 关系映射 ====================

  @OneToMany(() => Order, (order) => order.customer)
  orders!: Order[];

  // ==================== 生命周期钩子 ====================

  @BeforeInsert()
  @BeforeUpdate()
  validateBeforeSave() {
    // 自动格式化邮箱
    if (this.contactEmail) {
      this.contactEmail = this.contactEmail.toLowerCase().trim();
    }

    // 自动格式化手机号
    if (this.contactPhone) {
      this.contactPhone = this.contactPhone.trim();
    }

    // 自动格式化公司名称
    if (this.companyName) {
      this.companyName = this.companyName.trim();
    }

    // 设置默认客户等级
    if (!this.customerLevel) {
      if (this.totalSpent > 100000) {
        this.customerLevel = 'VIP';
      } else if (this.totalSpent > 50000) {
        this.customerLevel = 'Premium';
      } else if (this.totalSpent > 10000) {
        this.customerLevel = 'Gold';
      } else {
        this.customerLevel = 'Standard';
      }
    }
  }

  // ==================== 实例方法 ====================

  /**
   * 检查客户是否活跃
   */
  isActive(): boolean {
    return this.status === CustomerStatus.ACTIVE;
  }

  /**
   * 检查客户是否可交易
   */
  isTradeable(): boolean {
    return this.status === CustomerStatus.ACTIVE || this.status === CustomerStatus.PENDING;
  }

  /**
   * 更新客户余额
   */
  updateBalance(amount: number): void {
    this.balance += amount;
    this.balance = Math.round(this.balance * 100) / 100;
  }

  /**
   * 更新总消费金额
   */
  updateTotalSpent(amount: number): void {
    this.totalSpent += amount;
    this.totalSpent = Math.round(this.totalSpent * 100) / 100;
    this.orderCount += 1;
    this.lastOrderDate = new Date();
    this.updateCustomerLevel();
  }

  /**
   * 更新客户等级
   */
  private updateCustomerLevel(): void {
    if (this.totalSpent > 100000) {
      this.customerLevel = 'VIP';
    } else if (this.totalSpent > 50000) {
      this.customerLevel = 'Premium';
    } else if (this.totalSpent > 10000) {
      this.customerLevel = 'Gold';
    } else {
      this.customerLevel = 'Standard';
    }
  }

  /**
   * 获取客户摘要信息
   */
  getSummary(): {
    id: number;
    companyName: string;
    contactName: string;
    contactEmail: string;
    status: CustomerStatus;
    creditLimit: number;
    balance: number;
    totalSpent: number;
    orderCount: number;
  } {
    return {
      id: this.id,
      companyName: this.companyName,
      contactName: this.contactName,
      contactEmail: this.contactEmail,
      status: this.status,
      creditLimit: this.creditLimit,
      balance: this.balance,
      totalSpent: this.totalSpent,
      orderCount: this.orderCount,
    };
  }

  /**
   * 检查是否超出信用额度
   */
  isCreditExceeded(amount: number): boolean {
    return this.balance + amount > this.creditLimit;
  }

  /**
   * 获取可用信用额度
   */
  getAvailableCredit(): number {
    return Math.max(0, this.creditLimit - this.balance);
  }

  // ==================== 静态方法 ====================

  /**
   * 创建客户实例（工厂方法）
   */
  static create(data: Partial<Customer>): Customer {
    const customer = new Customer();
    Object.assign(customer, data);
    customer.status = CustomerStatus.PENDING;
    customer.creditLimit = customer.creditLimit || 0;
    customer.balance = 0;
    customer.totalSpent = 0;
    customer.orderCount = 0;
    return customer;
  }

  /**
   * 验证客户数据
   */
  static validate(data: Partial<Customer>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.companyName || data.companyName.length < 2) {
      errors.push('公司名称至少需要2个字符');
    }

    if (!data.contactEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail)) {
      errors.push('请输入有效的邮箱地址');
    }

    if (!data.contactPhone || !/^1[3-9]\d{9}$/.test(data.contactPhone)) {
      errors.push('请输入有效的手机号');
    }

    if (data.creditLimit !== undefined && data.creditLimit < 0) {
      errors.push('信用额度不能为负数');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * 获取状态文本
   */
  static getStatusText(status: CustomerStatus): string {
    const statusMap = {
      [CustomerStatus.ACTIVE]: '活跃',
      [CustomerStatus.INACTIVE]: '非活跃',
      [CustomerStatus.SUSPENDED]: '已暂停',
      [CustomerStatus.PENDING]: '待审核',
    };
    return statusMap[status] || status;
  }

  /**
   * 获取所有状态列表
   */
  static getStatusList(): Array<{ value: CustomerStatus; label: string }> {
    return Object.values(CustomerStatus).map((status) => ({
      value: status,
      label: Customer.getStatusText(status),
    }));
  }
}

export default Customer;