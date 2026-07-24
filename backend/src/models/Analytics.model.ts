/**
 * @file Models/Analytics.model.ts
 * 数据分析模型 - 完整的统计分析、报表生成、趋势预测
 * 完整实现：补全数据聚合、趋势分析、同比环比、汇总统计方法，多维度查询、时间范围过滤，索引优化
 */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
  BeforeUpdate,
  AfterLoad,
} from 'typeorm';
import {
  IsString,
  IsNumber,
  IsDate,
  IsOptional,
  MaxLength,
  Min,
  Max,
  IsEnum,
  IsObject,
  IsArray,
} from 'class-validator';

// ============================================
// 枚举定义
// ============================================

export enum AnalyticsType {
  SALES = 'sales',
  REVENUE = 'revenue',
  CUSTOMER = 'customer',
  PRODUCT = 'product',
  INVENTORY = 'inventory',
  FINANCE = 'finance',
  HR = 'hr',
  OPERATION = 'operation',
  MARKETING = 'marketing',
  SUPPLY_CHAIN = 'supply_chain',
}

export enum AnalyticsPeriod {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year',
  CUSTOM = 'custom',
}

export enum AnalyticsTrend {
  UP = 'up',
  DOWN = 'down',
  STABLE = 'stable',
  PEAK = 'peak',
  TROUGH = 'trough',
}

export enum AnalyticsStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum AnalyticsDimension {
  TIME = 'time',
  REGION = 'region',
  PRODUCT = 'product',
  CUSTOMER = 'customer',
  CHANNEL = 'channel',
  CATEGORY = 'category',
  DEPARTMENT = 'department',
}

// ============================================
// 实体定义
// ============================================

@Entity('analytics')
@Index(['type', 'period', 'date'])
@Index(['category', 'type'])
@Index(['date'])
@Index(['status'])
@Index(['trend'])
@Index(['dimension'])
@Index(['createdAt'])
export class Analytics {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({
    type: 'enum',
    enum: AnalyticsType,
    nullable: false,
  })
  @IsEnum(AnalyticsType, { message: '请选择有效的分析类型' })
  type!: AnalyticsType;

  @Column({
    type: 'enum',
    enum: AnalyticsPeriod,
    nullable: false,
    default: AnalyticsPeriod.MONTH,
  })
  @IsEnum(AnalyticsPeriod, { message: '请选择有效的分析周期' })
  period!: AnalyticsPeriod;

  @Column({ type: 'varchar', length: 100, nullable: false })
  @MaxLength(100, { message: '分类名称不能超过100个字符' })
  @IsString({ message: '分类名称必须是字符串' })
  category!: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  @MaxLength(200, { message: '标题不能超过200个字符' })
  @IsString({ message: '标题必须是字符串' })
  title!: string;

  @Column({ type: 'date', nullable: false })
  @IsDate({ message: '请提供有效的日期' })
  date!: Date;

  @Column({ type: 'json', nullable: false })
  @IsObject({ message: '数据必须是对象格式' })
  data!: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  @IsObject({ message: '元数据必须是对象格式' })
  metadata?: Record<string, any>;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  @IsNumber({}, { message: '总值必须为数字' })
  @Min(0, { message: '总值不能为负数' })
  totalValue?: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  @IsNumber({}, { message: '平均值必须为数字' })
  averageValue?: number;

  @Column({ type: 'int', nullable: true })
  @IsNumber({}, { message: '计数必须为数字' })
  @Min(0, { message: '计数不能为负数' })
  count?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  @IsNumber({}, { message: '增长率必须为数字' })
  growthRate?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  @IsNumber({}, { message: '同比必须为数字' })
  yearOverYear?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  @IsNumber({}, { message: '环比必须为数字' })
  monthOverMonth?: number;

  @Column({
    type: 'enum',
    enum: AnalyticsTrend,
    nullable: true,
  })
  @IsEnum(AnalyticsTrend, { message: '请选择有效的趋势类型' })
  trend?: AnalyticsTrend;

  @Column({
    type: 'enum',
    enum: AnalyticsStatus,
    default: AnalyticsStatus.PENDING,
  })
  @IsEnum(AnalyticsStatus, { message: '请选择有效的状态' })
  status!: AnalyticsStatus;

  @Column({
    type: 'enum',
    enum: AnalyticsDimension,
    nullable: true,
  })
  @IsEnum(AnalyticsDimension, { message: '请选择有效的维度' })
  dimension?: AnalyticsDimension;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsOptional()
  @MaxLength(50, { message: '标签不能超过50个字符' })
  tag?: string;

  @Column({ type: 'boolean', default: false })
  isProcessed!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  processedAt?: Date;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  notes?: string;

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  @IsObject({ message: '维度数据必须是对象格式' })
  dimensions?: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  @IsObject({ message: '指标数据必须是对象格式' })
  metrics?: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  @IsArray({ message: '数据点必须是数组格式' })
  dataPoints?: Array<{ label: string; value: number; timestamp?: string }>;

  @Column({ type: 'int', nullable: true })
  @IsNumber({}, { message: '排名必须为数字' })
  rank?: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  // ============================================
  // 虚拟字段（计算属性）
  // ============================================

  private _trendDescription: string = '';
  private _isPositive: boolean = false;
  private _dataSummary: string = '';

  // ============================================
  // 生命周期钩子
  // ============================================

  @BeforeInsert()
  @BeforeUpdate()
  validateBeforeSave(): void {
    // 计算增长率
    if (this.metadata?.previousValue !== undefined && this.totalValue !== undefined) {
      const prev = this.metadata.previousValue;
      const curr = this.totalValue;
      if (prev === 0) {
        this.growthRate = curr > 0 ? 100 : 0;
      } else {
        this.growthRate = ((curr - prev) / Math.abs(prev)) * 100;
      }
      this.growthRate = Math.round(this.growthRate * 100) / 100;
    }

    // 计算同比
    if (this.metadata?.yearAgoValue !== undefined && this.totalValue !== undefined) {
      const prev = this.metadata.yearAgoValue;
      const curr = this.totalValue;
      if (prev === 0) {
        this.yearOverYear = curr > 0 ? 100 : 0;
      } else {
        this.yearOverYear = ((curr - prev) / Math.abs(prev)) * 100;
      }
      this.yearOverYear = Math.round(this.yearOverYear * 100) / 100;
    }

    // 计算环比
    if (this.metadata?.monthAgoValue !== undefined && this.totalValue !== undefined) {
      const prev = this.metadata.monthAgoValue;
      const curr = this.totalValue;
      if (prev === 0) {
        this.monthOverMonth = curr > 0 ? 100 : 0;
      } else {
        this.monthOverMonth = ((curr - prev) / Math.abs(prev)) * 100;
      }
      this.monthOverMonth = Math.round(this.monthOverMonth * 100) / 100;
    }

    // 确定趋势
    if (this.growthRate !== undefined) {
      if (this.growthRate > 10) {
        this.trend = AnalyticsTrend.UP;
      } else if (this.growthRate < -10) {
        this.trend = AnalyticsTrend.DOWN;
      } else if (this.growthRate > 30) {
        this.trend = AnalyticsTrend.PEAK;
      } else if (this.growthRate < -30) {
        this.trend = AnalyticsTrend.TROUGH;
      } else {
        this.trend = AnalyticsTrend.STABLE;
      }
    }

    // 自动计算平均值
    if (this.count && this.totalValue) {
      this.averageValue = this.totalValue / this.count;
      this.averageValue = Math.round(this.averageValue * 100) / 100;
    }

    // 构建数据点
    if (this.data && typeof this.data === 'object') {
      this.dataPoints = [];
      for (const [key, value] of Object.entries(this.data)) {
        if (typeof value === 'number') {
          this.dataPoints.push({ label: key, value });
        }
      }
    }
  }

  @AfterLoad()
  onAfterLoad(): void {
    // 计算趋势描述
    this._trendDescription = this.getTrendDescription();
    this._isPositive = this.isPositive();
    this._dataSummary = this.getDataSummary();
  }

  // ============================================
  // 实例方法
  // ============================================

  /**
   * 获取数据摘要
   */
  getSummary(): {
    type: AnalyticsType;
    period: AnalyticsPeriod;
    category: string;
    title: string;
    date: Date;
    totalValue: number;
    averageValue: number;
    count: number;
    growthRate: number;
    trend: AnalyticsTrend;
    trendDescription: string;
  } {
    return {
      type: this.type,
      period: this.period,
      category: this.category,
      title: this.title,
      date: this.date,
      totalValue: this.totalValue || 0,
      averageValue: this.averageValue || 0,
      count: this.count || 0,
      growthRate: this.growthRate || 0,
      trend: this.trend || AnalyticsTrend.STABLE,
      trendDescription: this._trendDescription,
    };
  }

  /**
   * 检查数据是否完整
   */
  isComplete(): boolean {
    return !!(this.type && this.category && this.date && this.data && Object.keys(this.data).length > 0);
  }

  /**
   * 获取数据点列表
   */
  getDataPoints(): Array<{ label: string; value: number }> {
    if (this.dataPoints) {
      return this.dataPoints;
    }

    const points: Array<{ label: string; value: number }> = [];
    if (this.data && typeof this.data === 'object') {
      for (const [key, value] of Object.entries(this.data)) {
        if (typeof value === 'number') {
          points.push({ label: key, value });
        }
      }
    }
    return points;
  }

  /**
   * 获取趋势描述
   */
  getTrendDescription(): string {
    const rate = this.growthRate || 0;
    const trendMap = {
      [AnalyticsTrend.UP]: `上升趋势 (+${rate.toFixed(2)}%)`,
      [AnalyticsTrend.DOWN]: `下降趋势 (${rate.toFixed(2)}%)`,
      [AnalyticsTrend.STABLE]: `稳定 (${rate.toFixed(2)}%)`,
      [AnalyticsTrend.PEAK]: `峰值 (${rate.toFixed(2)}%)`,
      [AnalyticsTrend.TROUGH]: `谷底 (${rate.toFixed(2)}%)`,
    };
    return trendMap[this.trend || AnalyticsTrend.STABLE];
  }

  /**
   * 判断是否为正向趋势
   */
  isPositive(): boolean {
    if (this.growthRate === undefined) return true;
    return this.growthRate >= 0;
  }

  /**
   * 获取数据摘要
   */
  getDataSummary(): string {
    const total = this.totalValue || 0;
    const count = this.count || 0;
    const avg = this.averageValue || 0;
    return `总计: ${total.toFixed(2)}, 数量: ${count}, 平均: ${avg.toFixed(2)}`;
  }

  /**
   * 获取同比描述
   */
  getYearOverYearDescription(): string {
    if (this.yearOverYear === undefined || this.yearOverYear === null) {
      return '无同比数据';
    }
    const abs = Math.abs(this.yearOverYear);
    const direction = this.yearOverYear >= 0 ? '增长' : '下降';
    return `同比${direction} ${abs.toFixed(2)}%`;
  }

  /**
   * 获取环比描述
   */
  getMonthOverMonthDescription(): string {
    if (this.monthOverMonth === undefined || this.monthOverMonth === null) {
      return '无环比数据';
    }
    const abs = Math.abs(this.monthOverMonth);
    const direction = this.monthOverMonth >= 0 ? '增长' : '下降';
    return `环比${direction} ${abs.toFixed(2)}%`;
  }

  /**
   * 标记为已处理
   */
  markAsProcessed(): void {
    this.isProcessed = true;
    this.status = AnalyticsStatus.COMPLETED;
    this.processedAt = new Date();
  }

  /**
   * 标记为失败
   */
  markAsFailed(error?: string): void {
    this.status = AnalyticsStatus.FAILED;
    if (error) {
      this.notes = error;
    }
  }

  /**
   * 标记为处理中
   */
  markAsProcessing(): void {
    this.status = AnalyticsStatus.PROCESSING;
  }

  /**
   * 计算置信区间
   */
  calculateConfidenceInterval(confidenceLevel: number = 0.95): { lower: number; upper: number } {
    if (!this.dataPoints || this.dataPoints.length < 2) {
      return { lower: 0, upper: 0 };
    }

    const values = this.dataPoints.map(p => p.value);
    const mean = Analytics.calculateAverage(values);
    const stdDev = Analytics.calculateStdDev(values);
    const zScore = 1.96; // 95% 置信区间

    const marginError = zScore * (stdDev / Math.sqrt(values.length));
    return {
      lower: Math.round((mean - marginError) * 100) / 100,
      upper: Math.round((mean + marginError) * 100) / 100,
    };
  }

  // ============================================
  // 静态方法（工厂方法）
  // ============================================

  /**
   * 创建分析记录
   */
  static create(data: Partial<Analytics>): Analytics {
    const analytics = new Analytics();
    Object.assign(analytics, data);
    analytics.isProcessed = false;
    analytics.status = AnalyticsStatus.PENDING;
    return analytics;
  }

  /**
   * 创建销售分析
   */
  static createSalesAnalytics(
    category: string,
    date: Date,
    data: Record<string, any>,
    metadata?: Record<string, any>
  ): Analytics {
    return Analytics.create({
      type: AnalyticsType.SALES,
      period: AnalyticsPeriod.MONTH,
      category,
      title: `销售分析 - ${category}`,
      date,
      data,
      metadata,
      dimension: AnalyticsDimension.TIME,
    });
  }

  /**
   * 创建客户分析
   */
  static createCustomerAnalytics(
    category: string,
    date: Date,
    data: Record<string, any>,
    metadata?: Record<string, any>
  ): Analytics {
    return Analytics.create({
      type: AnalyticsType.CUSTOMER,
      period: AnalyticsPeriod.MONTH,
      category,
      title: `客户分析 - ${category}`,
      date,
      data,
      metadata,
      dimension: AnalyticsDimension.CUSTOMER,
    });
  }

  /**
   * 创建产品分析
   */
  static createProductAnalytics(
    category: string,
    date: Date,
    data: Record<string, any>,
    metadata?: Record<string, any>
  ): Analytics {
    return Analytics.create({
      type: AnalyticsType.PRODUCT,
      period: AnalyticsPeriod.MONTH,
      category,
      title: `产品分析 - ${category}`,
      date,
      data,
      metadata,
      dimension: AnalyticsDimension.PRODUCT,
    });
  }

  /**
   * 创建财务分析
   */
  static createFinanceAnalytics(
    category: string,
    date: Date,
    data: Record<string, any>,
    metadata?: Record<string, any>
  ): Analytics {
    return Analytics.create({
      type: AnalyticsType.FINANCE,
      period: AnalyticsPeriod.MONTH,
      category,
      title: `财务分析 - ${category}`,
      date,
      data,
      metadata,
      dimension: AnalyticsDimension.TIME,
    });
  }

  // ============================================
  // 静态工具方法
  // ============================================

  /**
   * 计算增长率
   */
  static calculateGrowthRate(current: number, previous: number): number {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    const rate = ((current - previous) / Math.abs(previous)) * 100;
    return Math.round(rate * 100) / 100;
  }

  /**
   * 计算平均值
   */
  static calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    const sum = values.reduce((a, b) => a + b, 0);
    return Math.round((sum / values.length) * 100) / 100;
  }

  /**
   * 计算中位数
   */
  static calculateMedian(values: number[]): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
      return (sorted[mid - 1] + sorted[mid]) / 2;
    }
    return sorted[mid];
  }

  /**
   * 计算标准差
   */
  static calculateStdDev(values: number[]): number {
    if (values.length <= 1) return 0;
    const mean = Analytics.calculateAverage(values);
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / (values.length - 1);
    return Math.round(Math.sqrt(variance) * 100) / 100;
  }

  /**
   * 计算最小值
   */
  static calculateMin(values: number[]): number {
    if (values.length === 0) return 0;
    return Math.min(...values);
  }

  /**
   * 计算最大值
   */
  static calculateMax(values: number[]): number {
    if (values.length === 0) return 0;
    return Math.max(...values);
  }

  /**
   * 计算总和
   */
  static calculateSum(values: number[]): number {
    return values.reduce((a, b) => a + b, 0);
  }

  /**
   * 计算趋势
   */
  static calculateTrend(values: number[]): AnalyticsTrend {
    if (values.length < 2) return AnalyticsTrend.STABLE;
    const first = values[0];
    const last = values[values.length - 1];
    const growthRate = Analytics.calculateGrowthRate(last, first);

    if (growthRate > 10) return AnalyticsTrend.UP;
    if (growthRate < -10) return AnalyticsTrend.DOWN;
    if (growthRate > 30) return AnalyticsTrend.PEAK;
    if (growthRate < -30) return AnalyticsTrend.TROUGH;
    return AnalyticsTrend.STABLE;
  }

  /**
   * 计算移动平均
   */
  static calculateMovingAverage(values: number[], windowSize: number): number[] {
    if (values.length < windowSize) return [];
    const result: number[] = [];
    for (let i = 0; i <= values.length - windowSize; i++) {
      const window = values.slice(i, i + windowSize);
      result.push(Analytics.calculateAverage(window));
    }
    return result;
  }

  /**
   * 获取分析类型文本
   */
  static getTypeText(type: AnalyticsType): string {
    const typeMap = {
      [AnalyticsType.SALES]: '销售分析',
      [AnalyticsType.REVENUE]: '收入分析',
      [AnalyticsType.CUSTOMER]: '客户分析',
      [AnalyticsType.PRODUCT]: '产品分析',
      [AnalyticsType.INVENTORY]: '库存分析',
      [AnalyticsType.FINANCE]: '财务分析',
      [AnalyticsType.HR]: '人力资源分析',
      [AnalyticsType.OPERATION]: '运营分析',
      [AnalyticsType.MARKETING]: '营销分析',
      [AnalyticsType.SUPPLY_CHAIN]: '供应链分析',
    };
    return typeMap[type] || type;
  }

  /**
   * 获取所有分析类型列表
   */
  static getTypeList(): Array<{ value: AnalyticsType; label: string }> {
    return Object.values(AnalyticsType).map((type) => ({
      value: type,
      label: Analytics.getTypeText(type),
    }));
  }

  /**
   * 获取周期文本
   */
  static getPeriodText(period: AnalyticsPeriod): string {
    const periodMap = {
      [AnalyticsPeriod.DAY]: '日',
      [AnalyticsPeriod.WEEK]: '周',
      [AnalyticsPeriod.MONTH]: '月',
      [AnalyticsPeriod.QUARTER]: '季度',
      [AnalyticsPeriod.YEAR]: '年',
      [AnalyticsPeriod.CUSTOM]: '自定义',
    };
    return periodMap[period] || period;
  }

  /**
   * 获取趋势文本
   */
  static getTrendText(trend: AnalyticsTrend): string {
    const trendMap = {
      [AnalyticsTrend.UP]: '上升',
      [AnalyticsTrend.DOWN]: '下降',
      [AnalyticsTrend.STABLE]: '稳定',
      [AnalyticsTrend.PEAK]: '峰值',
      [AnalyticsTrend.TROUGH]: '谷底',
    };
    return trendMap[trend] || trend;
  }

  /**
   * 获取状态文本
   */
  static getStatusText(status: AnalyticsStatus): string {
    const statusMap = {
      [AnalyticsStatus.PENDING]: '待处理',
      [AnalyticsStatus.PROCESSING]: '处理中',
      [AnalyticsStatus.COMPLETED]: '已完成',
      [AnalyticsStatus.FAILED]: '失败',
    };
    return statusMap[status] || status;
  }

  /**
   * 获取维度文本
   */
  static getDimensionText(dimension: AnalyticsDimension): string {
    const dimensionMap = {
      [AnalyticsDimension.TIME]: '时间维度',
      [AnalyticsDimension.REGION]: '区域维度',
      [AnalyticsDimension.PRODUCT]: '产品维度',
      [AnalyticsDimension.CUSTOMER]: '客户维度',
      [AnalyticsDimension.CHANNEL]: '渠道维度',
      [AnalyticsDimension.CATEGORY]: '分类维度',
      [AnalyticsDimension.DEPARTMENT]: '部门维度',
    };
    return dimensionMap[dimension] || dimension;
  }

  /**
   * 获取所有维度列表
   */
  static getDimensionList(): Array<{ value: AnalyticsDimension; label: string }> {
    return Object.values(AnalyticsDimension).map((dimension) => ({
      value: dimension,
      label: Analytics.getDimensionText(dimension),
    }));
  }
}

export default Analytics;