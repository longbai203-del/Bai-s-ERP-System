/**
 * 缓存键常量定义
 * 统一管理所有Redis缓存键，支持命名空间隔离和多环境部署
 * @module cache-keys
 */

/**
 * 缓存键命名空间
 * 用于区分不同环境/业务模块的缓存
 */
export enum CacheNamespace {
    /** 用户会话缓存 */
    SESSION = 'session',
    /** 用户认证缓存 */
    AUTH = 'auth',
    /** 客户数据缓存 */
    CUSTOMER = 'customer',
    /** 订单数据缓存 */
    ORDER = 'order',
    /** 产品数据缓存 */
    PRODUCT = 'product',
    /** 库存数据缓存 */
    INVENTORY = 'inventory',
    /** 财务数据缓存 */
    FINANCE = 'finance',
    /** HR数据缓存 */
    HR = 'hr',
    /** 系统配置缓存 */
    CONFIG = 'config',
    /** 字典数据缓存 */
    DICT = 'dict',
    /** 权限数据缓存 */
    PERMISSION = 'permission',
    /** 日志数据缓存 */
    LOG = 'log',
    /** 统计报表缓存 */
    REPORT = 'report',
    /** 临时数据缓存 */
    TEMP = 'temp',
  }
  
  /**
   * 默认TTL配置（秒）
   */
  export const DefaultTTL = {
    /** 永久缓存（不过期） */
    PERMANENT: -1,
    /** 短期缓存：5分钟 */
    SHORT: 5 * 60,
    /** 中期缓存：30分钟 */
    MEDIUM: 30 * 60,
    /** 长期缓存：2小时 */
    LONG: 2 * 60 * 60,
    /** 超长缓存：12小时 */
    EXTRA_LONG: 12 * 60 * 60,
    /** 日缓存：24小时 */
    DAILY: 24 * 60 * 60,
    /** 周缓存：7天 */
    WEEKLY: 7 * 24 * 60 * 60,
  } as const;
  
  /**
   * 缓存键前缀
   */
  const PREFIX = 'bai:erp';
  
  /**
   * 缓存键构建器类
   * 提供类型安全的缓存键生成方法
   */
  export class CacheKeyBuilder {
    private static instance: CacheKeyBuilder;
    private environment: string;
  
    private constructor() {
      this.environment = process.env.NODE_ENV || 'development';
    }
  
    /**
     * 获取单例实例
     */
    public static getInstance(): CacheKeyBuilder {
      if (!CacheKeyBuilder.instance) {
        CacheKeyBuilder.instance = new CacheKeyBuilder();
      }
      return CacheKeyBuilder.instance;
    }
  
    /**
     * 构建完整的缓存键
     * 格式: {prefix}:{env}:{namespace}:{key}
     */
    private buildKey(namespace: CacheNamespace, key: string | number): string {
      return `${PREFIX}:${this.environment}:${namespace}:${key}`;
    }
  
    /**
     * 构建带通配符的缓存键模式
     * 用于批量删除操作
     */
    private buildPattern(namespace: CacheNamespace, pattern: string): string {
      return `${PREFIX}:${this.environment}:${namespace}:${pattern}`;
    }
  
    // ============ 会话相关缓存键 ============
  
    /** 用户会话缓存键 */
    static session(sessionId: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.SESSION, sessionId);
    }
  
    /** 用户会话列表缓存键模式 */
    static sessionList(userId: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.SESSION, `list:${userId}`);
    }
  
    /** 用户会话过期时间键 */
    static sessionExpire(sessionId: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.SESSION, `expire:${sessionId}`);
    }
  
    // ============ 认证相关缓存键 ============
  
    /** 用户认证令牌缓存键 */
    static authToken(userId: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.AUTH, `token:${userId}`);
    }
  
    /** 用户刷新令牌缓存键 */
    static refreshToken(tokenId: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.AUTH, `refresh:${tokenId}`);
    }
  
    /** 用户权限缓存键 */
    static authPermissions(userId: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.AUTH, `perms:${userId}`);
    }
  
    /** 用户角色缓存键 */
    static authRoles(userId: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.AUTH, `roles:${userId}`);
    }
  
    /** 黑名单令牌缓存键 */
    static authBlacklist(tokenId: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.AUTH, `blacklist:${tokenId}`);
    }
  
    // ============ 客户相关缓存键 ============
  
    /** 客户详情缓存键 */
    static customer(id: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.CUSTOMER, `detail:${id}`);
    }
  
    /** 客户列表缓存键（带查询参数哈希） */
    static customerList(queryHash: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.CUSTOMER, `list:${queryHash}`);
    }
  
    /** 客户统计缓存键 */
    static customerStats(): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.CUSTOMER, 'stats');
    }
  
    /** 客户标签缓存键 */
    static customerTags(customerId: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.CUSTOMER, `tags:${customerId}`);
    }
  
    /** 客户联系人缓存键 */
    static customerContacts(customerId: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.CUSTOMER, `contacts:${customerId}`);
    }
  
    /** 客户活动历史缓存键 */
    static customerActivities(customerId: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.CUSTOMER, `activities:${customerId}`);
    }
  
    /** 客户分页列表缓存键模式 */
    static customerPage(page: number, size: number, filters: string): string {
      const hash = Buffer.from(filters).toString('base64').slice(0, 16);
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.CUSTOMER, `page:${page}:${size}:${hash}`);
    }
  
    // ============ 订单相关缓存键 ============
  
    /** 订单详情缓存键 */
    static order(id: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.ORDER, `detail:${id}`);
    }
  
    /** 订单列表缓存键 */
    static orderList(queryHash: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.ORDER, `list:${queryHash}`);
    }
  
    /** 用户订单列表缓存键 */
    static orderUserList(userId: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.ORDER, `user:${userId}`);
    }
  
    /** 订单统计缓存键 */
    static orderStats(): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.ORDER, 'stats');
    }
  
    /** 订单状态统计缓存键 */
    static orderStatusStats(): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.ORDER, 'status-stats');
    }
  
    /** 订单号生成计数器缓存键 */
    static orderCounter(date: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.ORDER, `counter:${date}`);
    }
  
    /** 订单分页列表缓存键模式 */
    static orderPage(page: number, size: number, status: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.ORDER, `page:${page}:${size}:${status}`);
    }
  
    // ============ 产品相关缓存键 ============
  
    /** 产品详情缓存键 */
    static product(id: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.PRODUCT, `detail:${id}`);
    }
  
    /** 产品列表缓存键 */
    static productList(queryHash: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.PRODUCT, `list:${queryHash}`);
    }
  
    /** 产品SKU缓存键 */
    static productSku(sku: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.PRODUCT, `sku:${sku}`);
    }
  
    /** 产品分类缓存键 */
    static productCategory(categoryId: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.PRODUCT, `category:${categoryId}`);
    }
  
    /** 热门产品缓存键 */
    static productHot(): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.PRODUCT, 'hot');
    }
  
    /** 推荐产品缓存键 */
    static productRecommended(): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.PRODUCT, 'recommended');
    }
  
    /** 产品库存缓存键 */
    static productStock(productId: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.PRODUCT, `stock:${productId}`);
    }
  
    /** 产品价格缓存键 */
    static productPrice(productId: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.PRODUCT, `price:${productId}`);
    }
  
    // ============ 库存相关缓存键 ============
  
    /** 库存详情缓存键 */
    static inventory(id: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.INVENTORY, `detail:${id}`);
    }
  
    /** 库存列表缓存键 */
    static inventoryList(queryHash: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.INVENTORY, `list:${queryHash}`);
    }
  
    /** 库存预警缓存键 */
    static inventoryAlert(): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.INVENTORY, 'alert');
    }
  
    /** 库存统计缓存键 */
    static inventoryStats(): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.INVENTORY, 'stats');
    }
  
    /** 仓库库存缓存键 */
    static inventoryWarehouse(warehouseId: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.INVENTORY, `warehouse:${warehouseId}`);
    }
  
    /** 库存流水缓存键 */
    static inventoryFlow(productId: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.INVENTORY, `flow:${productId}`);
    }
  
    // ============ 财务相关缓存键 ============
  
    /** 财务记录详情缓存键 */
    static finance(id: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.FINANCE, `detail:${id}`);
    }
  
    /** 财务列表缓存键 */
    static financeList(queryHash: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.FINANCE, `list:${queryHash}`);
    }
  
    /** 财务统计缓存键 */
    static financeStats(): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.FINANCE, 'stats');
    }
  
    /** 财务报表缓存键 */
    static financeReport(reportId: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.FINANCE, `report:${reportId}`);
    }
  
    /** 财务余额缓存键 */
    static financeBalance(accountId: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.FINANCE, `balance:${accountId}`);
    }
  
    /** 财务流水缓存键 */
    static financeTransaction(accountId: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.FINANCE, `transaction:${accountId}`);
    }
  
    // ============ HR相关缓存键 ============
  
    /** 员工详情缓存键 */
    static hrEmployee(id: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.HR, `employee:${id}`);
    }
  
    /** 员工列表缓存键 */
    static hrEmployeeList(queryHash: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.HR, `list:${queryHash}`);
    }
  
    /** 部门列表缓存键 */
    static hrDepartment(): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.HR, 'departments');
    }
  
    /** 员工统计缓存键 */
    static hrStats(): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.HR, 'stats');
    }
  
    /** 员工考勤缓存键 */
    static hrAttendance(employeeId: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.HR, `attendance:${employeeId}`);
    }
  
    /** 员工薪资缓存键 */
    static hrSalary(employeeId: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.HR, `salary:${employeeId}`);
    }
  
    // ============ 系统配置相关缓存键 ============
  
    /** 系统配置缓存键 */
    static config(key: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.CONFIG, key);
    }
  
    /** 系统配置分组缓存键 */
    static configGroup(group: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.CONFIG, `group:${group}`);
    }
  
    /** 系统配置列表缓存键 */
    static configList(): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.CONFIG, 'list');
    }
  
    // ============ 字典相关缓存键 ============
  
    /** 字典数据缓存键 */
    static dict(type: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.DICT, type);
    }
  
    /** 字典列表缓存键 */
    static dictList(): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.DICT, 'list');
    }
  
    /** 字典树结构缓存键 */
    static dictTree(type: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.DICT, `tree:${type}`);
    }
  
    // ============ 权限相关缓存键 ============
  
    /** 权限列表缓存键 */
    static permissionList(): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.PERMISSION, 'list');
    }
  
    /** 用户权限缓存键 */
    static permissionUser(userId: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.PERMISSION, `user:${userId}`);
    }
  
    /** 角色权限缓存键 */
    static permissionRole(roleId: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.PERMISSION, `role:${roleId}`);
    }
  
    // ============ 日志相关缓存键 ============
  
    /** 操作日志缓存键 */
    static logOperation(logId: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.LOG, `operation:${logId}`);
    }
  
    /** 日志统计缓存键 */
    static logStats(): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.LOG, 'stats');
    }
  
    // ============ 报表相关缓存键 ============
  
    /** 报表缓存键 */
    static report(reportId: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.REPORT, reportId);
    }
  
    /** 报表列表缓存键 */
    static reportList(): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.REPORT, 'list');
    }
  
    /** 报表预览缓存键 */
    static reportPreview(reportId: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.REPORT, `preview:${reportId}`);
    }
  
    // ============ 临时数据缓存键 ============
  
    /** 临时数据缓存键 */
    static temp(key: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.TEMP, key);
    }
  
    /** 临时文件上传缓存键 */
    static tempUpload(uploadId: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.TEMP, `upload:${uploadId}`);
    }
  
    /** 临时验证码缓存键 */
    static tempCode(phone: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.TEMP, `code:${phone}`);
    }
  
    /** 临时导入任务缓存键 */
    static tempImport(taskId: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.TEMP, `import:${taskId}`);
    }
  
    /** 临时导出任务缓存键 */
    static tempExport(taskId: string): string {
      return CacheKeyBuilder.getInstance().buildKey(CacheNamespace.TEMP, `export:${taskId}`);
    }
  
    // ============ 批量操作工具方法 ============
  
    /**
     * 获取指定命名空间的所有键模式
     * 用于批量清除操作
     */
    static namespacePattern(namespace: CacheNamespace): string {
      return CacheKeyBuilder.getInstance().buildPattern(namespace, '*');
    }
  
    /**
     * 获取指定前缀的所有键模式
     */
    static prefixPattern(namespace: CacheNamespace, prefix: string): string {
      return CacheKeyBuilder.getInstance().buildPattern(namespace, `${prefix}*`);
    }
  
    /**
     * 获取所有缓存键模式（清空所有缓存）
     */
    static allPattern(): string {
      return `${PREFIX}:*`;
    }
  
    /**
     * 获取当前环境前缀
     */
    static getEnvironmentPrefix(): string {
      return `${PREFIX}:${CacheKeyBuilder.getInstance().environment}`;
    }
  }
  
  /**
   * 缓存键工具函数（便捷导出）
   */
  export const CacheKeys = {
    // 会话
    session: CacheKeyBuilder.session,
    sessionList: CacheKeyBuilder.sessionList,
    sessionExpire: CacheKeyBuilder.sessionExpire,
  
    // 认证
    authToken: CacheKeyBuilder.authToken,
    refreshToken: CacheKeyBuilder.refreshToken,
    authPermissions: CacheKeyBuilder.authPermissions,
    authRoles: CacheKeyBuilder.authRoles,
    authBlacklist: CacheKeyBuilder.authBlacklist,
  
    // 客户
    customer: CacheKeyBuilder.customer,
    customerList: CacheKeyBuilder.customerList,
    customerStats: CacheKeyBuilder.customerStats,
    customerTags: CacheKeyBuilder.customerTags,
    customerContacts: CacheKeyBuilder.customerContacts,
    customerActivities: CacheKeyBuilder.customerActivities,
    customerPage: CacheKeyBuilder.customerPage,
  
    // 订单
    order: CacheKeyBuilder.order,
    orderList: CacheKeyBuilder.orderList,
    orderUserList: CacheKeyBuilder.orderUserList,
    orderStats: CacheKeyBuilder.orderStats,
    orderStatusStats: CacheKeyBuilder.orderStatusStats,
    orderCounter: CacheKeyBuilder.orderCounter,
    orderPage: CacheKeyBuilder.orderPage,
  
    // 产品
    product: CacheKeyBuilder.product,
    productList: CacheKeyBuilder.productList,
    productSku: CacheKeyBuilder.productSku,
    productCategory: CacheKeyBuilder.productCategory,
    productHot: CacheKeyBuilder.productHot,
    productRecommended: CacheKeyBuilder.productRecommended,
    productStock: CacheKeyBuilder.productStock,
    productPrice: CacheKeyBuilder.productPrice,
  
    // 库存
    inventory: CacheKeyBuilder.inventory,
    inventoryList: CacheKeyBuilder.inventoryList,
    inventoryAlert: CacheKeyBuilder.inventoryAlert,
    inventoryStats: CacheKeyBuilder.inventoryStats,
    inventoryWarehouse: CacheKeyBuilder.inventoryWarehouse,
    inventoryFlow: CacheKeyBuilder.inventoryFlow,
  
    // 财务
    finance: CacheKeyBuilder.finance,
    financeList: CacheKeyBuilder.financeList,
    financeStats: CacheKeyBuilder.financeStats,
    financeReport: CacheKeyBuilder.financeReport,
    financeBalance: CacheKeyBuilder.financeBalance,
    financeTransaction: CacheKeyBuilder.financeTransaction,
  
    // HR
    hrEmployee: CacheKeyBuilder.hrEmployee,
    hrEmployeeList: CacheKeyBuilder.hrEmployeeList,
    hrDepartment: CacheKeyBuilder.hrDepartment,
    hrStats: CacheKeyBuilder.hrStats,
    hrAttendance: CacheKeyBuilder.hrAttendance,
    hrSalary: CacheKeyBuilder.hrSalary,
  
    // 配置
    config: CacheKeyBuilder.config,
    configGroup: CacheKeyBuilder.configGroup,
    configList: CacheKeyBuilder.configList,
  
    // 字典
    dict: CacheKeyBuilder.dict,
    dictList: CacheKeyBuilder.dictList,
    dictTree: CacheKeyBuilder.dictTree,
  
    // 权限
    permissionList: CacheKeyBuilder.permissionList,
    permissionUser: CacheKeyBuilder.permissionUser,
    permissionRole: CacheKeyBuilder.permissionRole,
  
    // 日志
    logOperation: CacheKeyBuilder.logOperation,
    logStats: CacheKeyBuilder.logStats,
  
    // 报表
    report: CacheKeyBuilder.report,
    reportList: CacheKeyBuilder.reportList,
    reportPreview: CacheKeyBuilder.reportPreview,
  
    // 临时
    temp: CacheKeyBuilder.temp,
    tempUpload: CacheKeyBuilder.tempUpload,
    tempCode: CacheKeyBuilder.tempCode,
    tempImport: CacheKeyBuilder.tempImport,
    tempExport: CacheKeyBuilder.tempExport,
  
    // 工具
    namespacePattern: CacheKeyBuilder.namespacePattern,
    prefixPattern: CacheKeyBuilder.prefixPattern,
    allPattern: CacheKeyBuilder.allPattern,
    getEnvironmentPrefix: CacheKeyBuilder.getEnvironmentPrefix,
  
    // TTL常量
    TTL: DefaultTTL,
    Namespace: CacheNamespace,
  };
  
  export default CacheKeys;