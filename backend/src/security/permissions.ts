/**
 * 权限管理系统
 * RBAC权限模型，支持角色、权限、资源控制
 * @module permissions
 */

import { Request, Response, NextFunction } from 'express';

/**
 * 权限类型
 */
export enum PermissionType {
  /** 创建 */
  CREATE = 'create',
  /** 读取 */
  READ = 'read',
  /** 更新 */
  UPDATE = 'update',
  /** 删除 */
  DELETE = 'delete',
  /** 执行 */
  EXECUTE = 'execute',
  /** 审批 */
  APPROVE = 'approve',
  /** 导出 */
  EXPORT = 'export',
  /** 导入 */
  IMPORT = 'import',
  /** 全部 */
  ALL = 'all',
}

/**
 * 资源类型
 */
export enum ResourceType {
  // 系统管理
  SYSTEM = 'system',
  USER = 'user',
  ROLE = 'role',
  PERMISSION = 'permission',
  CONFIG = 'config',

  // 客户管理
  CUSTOMER = 'customer',
  CUSTOMER_TAG = 'customer_tag',
  CUSTOMER_CONTACT = 'customer_contact',

  // 订单管理
  ORDER = 'order',
  ORDER_ITEM = 'order_item',
  ORDER_SHIPMENT = 'order_shipment',

  // 产品管理
  PRODUCT = 'product',
  CATEGORY = 'category',
  BRAND = 'brand',
  SKU = 'sku',

  // 库存管理
  INVENTORY = 'inventory',
  WAREHOUSE = 'warehouse',
  STOCK_TRANSFER = 'stock_transfer',
  STOCK_ADJUSTMENT = 'stock_adjustment',

  // 财务管理
  FINANCE = 'finance',
  INVOICE = 'invoice',
  PAYMENT = 'payment',
  ACCOUNT = 'account',
  TAX = 'tax',

  // HR管理
  EMPLOYEE = 'employee',
  DEPARTMENT = 'department',
  ATTENDANCE = 'attendance',
  PAYROLL = 'payroll',
  LEAVE = 'leave',

  // 采购管理
  PURCHASE = 'purchase',
  SUPPLIER = 'supplier',
  PURCHASE_ORDER = 'purchase_order',

  // 报表管理
  REPORT = 'report',

  // 项目管理
  PROJECT = 'project',
  TASK = 'task',

  // AI功能
  AI = 'ai',
  AI_CHAT = 'ai_chat',
  AI_ANALYSIS = 'ai_analysis',

  // 营销管理
  MARKETING = 'marketing',
  CAMPAIGN = 'campaign',
  LEAD = 'lead',

  // POS管理
  POS = 'pos',

  // 生产管理
  PRODUCTION = 'production',
  WORK_ORDER = 'work_order',
  BOM = 'bom',

  // SAAS管理
  SAAS = 'saas',
  TENANT = 'tenant',
  SUBSCRIPTION = 'subscription',
}

/**
 * 权限定义
 */
export interface Permission {
  id: string;
  name: string;
  resource: ResourceType;
  type: PermissionType;
  description: string;
  parentId?: string;
}

/**
 * 角色定义
 */
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // 权限ID列表
  isDefault?: boolean;
  isSystem?: boolean;
}

/**
 * 用户权限信息
 */
export interface UserPermissions {
  userId: string;
  roles: string[];
  permissions: string[];
  resources: Array<{
    resource: ResourceType;
    types: PermissionType[];
  }>;
}

/**
 * 权限验证结果
 */
export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
  missingPermissions?: string[];
}

/**
 * 权限配置
 */
export interface PermissionConfig {
  /** 是否启用权限检查 */
  enabled?: boolean;
  /** 默认角色 */
  defaultRole?: string;
  /** 超级管理员角色ID */
  superAdminRole?: string;
  /** 是否缓存权限 */
  cachePermissions?: boolean;
  /** 权限缓存TTL（秒） */
  cacheTTL?: number;
}

/**
 * 预定义权限
 */
export const PREDEFINED_PERMISSIONS: Permission[] = [
  // 系统管理
  { id: 'system_all', name: '系统全部权限', resource: ResourceType.SYSTEM, type: PermissionType.ALL, description: '系统所有操作权限' },
  { id: 'system_read', name: '系统查看', resource: ResourceType.SYSTEM, type: PermissionType.READ, description: '查看系统配置' },
  { id: 'system_update', name: '系统更新', resource: ResourceType.SYSTEM, type: PermissionType.UPDATE, description: '更新系统配置' },

  // 用户管理
  { id: 'user_all', name: '用户全部权限', resource: ResourceType.USER, type: PermissionType.ALL, description: '用户所有操作权限' },
  { id: 'user_create', name: '用户创建', resource: ResourceType.USER, type: PermissionType.CREATE, description: '创建用户' },
  { id: 'user_read', name: '用户查看', resource: ResourceType.USER, type: PermissionType.READ, description: '查看用户信息' },
  { id: 'user_update', name: '用户更新', resource: ResourceType.USER, type: PermissionType.UPDATE, description: '更新用户信息' },
  { id: 'user_delete', name: '用户删除', resource: ResourceType.USER, type: PermissionType.DELETE, description: '删除用户' },

  // 角色管理
  { id: 'role_all', name: '角色全部权限', resource: ResourceType.ROLE, type: PermissionType.ALL, description: '角色所有操作权限' },
  { id: 'role_create', name: '角色创建', resource: ResourceType.ROLE, type: PermissionType.CREATE, description: '创建角色' },
  { id: 'role_read', name: '角色查看', resource: ResourceType.ROLE, type: PermissionType.READ, description: '查看角色信息' },
  { id: 'role_update', name: '角色更新', resource: ResourceType.ROLE, type: PermissionType.UPDATE, description: '更新角色信息' },
  { id: 'role_delete', name: '角色删除', resource: ResourceType.ROLE, type: PermissionType.DELETE, description: '删除角色' },

  // 客户管理
  { id: 'customer_all', name: '客户全部权限', resource: ResourceType.CUSTOMER, type: PermissionType.ALL, description: '客户所有操作权限' },
  { id: 'customer_create', name: '客户创建', resource: ResourceType.CUSTOMER, type: PermissionType.CREATE, description: '创建客户' },
  { id: 'customer_read', name: '客户查看', resource: ResourceType.CUSTOMER, type: PermissionType.READ, description: '查看客户信息' },
  { id: 'customer_update', name: '客户更新', resource: ResourceType.CUSTOMER, type: PermissionType.UPDATE, description: '更新客户信息' },
  { id: 'customer_delete', name: '客户删除', resource: ResourceType.CUSTOMER, type: PermissionType.DELETE, description: '删除客户' },
  { id: 'customer_export', name: '客户导出', resource: ResourceType.CUSTOMER, type: PermissionType.EXPORT, description: '导出客户数据' },

  // 订单管理
  { id: 'order_all', name: '订单全部权限', resource: ResourceType.ORDER, type: PermissionType.ALL, description: '订单所有操作权限' },
  { id: 'order_create', name: '订单创建', resource: ResourceType.ORDER, type: PermissionType.CREATE, description: '创建订单' },
  { id: 'order_read', name: '订单查看', resource: ResourceType.ORDER, type: PermissionType.READ, description: '查看订单信息' },
  { id: 'order_update', name: '订单更新', resource: ResourceType.ORDER, type: PermissionType.UPDATE, description: '更新订单信息' },
  { id: 'order_delete', name: '订单删除', resource: ResourceType.ORDER, type: PermissionType.DELETE, description: '删除订单' },
  { id: 'order_approve', name: '订单审批', resource: ResourceType.ORDER, type: PermissionType.APPROVE, description: '审批订单' },

  // 产品管理
  { id: 'product_all', name: '产品全部权限', resource: ResourceType.PRODUCT, type: PermissionType.ALL, description: '产品所有操作权限' },
  { id: 'product_create', name: '产品创建', resource: ResourceType.PRODUCT, type: PermissionType.CREATE, description: '创建产品' },
  { id: 'product_read', name: '产品查看', resource: ResourceType.PRODUCT, type: PermissionType.READ, description: '查看产品信息' },
  { id: 'product_update', name: '产品更新', resource: ResourceType.PRODUCT, type: PermissionType.UPDATE, description: '更新产品信息' },
  { id: 'product_delete', name: '产品删除', resource: ResourceType.PRODUCT, type: PermissionType.DELETE, description: '删除产品' },

  // 库存管理
  { id: 'inventory_all', name: '库存全部权限', resource: ResourceType.INVENTORY, type: PermissionType.ALL, description: '库存所有操作权限' },
  { id: 'inventory_read', name: '库存查看', resource: ResourceType.INVENTORY, type: PermissionType.READ, description: '查看库存信息' },
  { id: 'inventory_update', name: '库存调整', resource: ResourceType.INVENTORY, type: PermissionType.UPDATE, description: '调整库存' },
  { id: 'inventory_transfer', name: '库存转移', resource: ResourceType.INVENTORY, type: PermissionType.EXECUTE, description: '转移库存' },

  // 财务管理
  { id: 'finance_all', name: '财务全部权限', resource: ResourceType.FINANCE, type: PermissionType.ALL, description: '财务所有操作权限' },
  { id: 'finance_read', name: '财务查看', resource: ResourceType.FINANCE, type: PermissionType.READ, description: '查看财务信息' },
  { id: 'finance_update', name: '财务更新', resource: ResourceType.FINANCE, type: PermissionType.UPDATE, description: '更新财务信息' },
  { id: 'finance_approve', name: '财务审批', resource: ResourceType.FINANCE, type: PermissionType.APPROVE, description: '审批财务单据' },

  // HR管理
  { id: 'hr_all', name: 'HR全部权限', resource: ResourceType.EMPLOYEE, type: PermissionType.ALL, description: 'HR所有操作权限' },
  { id: 'hr_read', name: '员工查看', resource: ResourceType.EMPLOYEE, type: PermissionType.READ, description: '查看员工信息' },
  { id: 'hr_update', name: '员工更新', resource: ResourceType.EMPLOYEE, type: PermissionType.UPDATE, description: '更新员工信息' },
  { id: 'hr_payroll', name: '薪资管理', resource: ResourceType.PAYROLL, type: PermissionType.EXECUTE, description: '管理薪资数据' },

  // 采购管理
  { id: 'purchase_all', name: '采购全部权限', resource: ResourceType.PURCHASE, type: PermissionType.ALL, description: '采购所有操作权限' },
  { id: 'purchase_create', name: '采购创建', resource: ResourceType.PURCHASE, type: PermissionType.CREATE, description: '创建采购单' },
  { id: 'purchase_read', name: '采购查看', resource: ResourceType.PURCHASE, type: PermissionType.READ, description: '查看采购信息' },
  { id: 'purchase_approve', name: '采购审批', resource: ResourceType.PURCHASE, type: PermissionType.APPROVE, description: '审批采购单' },

  // 报表管理
  { id: 'report_all', name: '报表全部权限', resource: ResourceType.REPORT, type: PermissionType.ALL, description: '报表所有操作权限' },
  { id: 'report_read', name: '报表查看', resource: ResourceType.REPORT, type: PermissionType.READ, description: '查看报表' },
  { id: 'report_export', name: '报表导出', resource: ResourceType.REPORT, type: PermissionType.EXPORT, description: '导出报表' },

  // AI功能
  { id: 'ai_all', name: 'AI全部权限', resource: ResourceType.AI, type: PermissionType.ALL, description: 'AI所有操作权限' },
  { id: 'ai_chat', name: 'AI聊天', resource: ResourceType.AI_CHAT, type: PermissionType.EXECUTE, description: '使用AI聊天' },
  { id: 'ai_analysis', name: 'AI分析', resource: ResourceType.AI_ANALYSIS, type: PermissionType.EXECUTE, description: '使用AI分析' },
];

/**
 * 预定义角色
 */
export const PREDEFINED_ROLES: Role[] = [
  {
    id: 'super_admin',
    name: '超级管理员',
    description: '拥有所有权限',
    permissions: PREDEFINED_PERMISSIONS.map((p) => p.id),
    isSystem: true,
  },
  {
    id: 'admin',
    name: '管理员',
    description: '拥有大部分管理权限',
    permissions: [
      'user_all', 'role_read', 'customer_all', 'order_all',
      'product_all', 'inventory_all', 'finance_read', 'hr_read',
      'purchase_read', 'report_read',
    ],
    isSystem: true,
  },
  {
    id: 'manager',
    name: '经理',
    description: '业务管理权限',
    permissions: [
      'customer_all', 'order_all', 'product_read', 'inventory_read',
      'purchase_create', 'purchase_read', 'report_read',
    ],
  },
  {
    id: 'employee',
    name: '员工',
    description: '基础操作权限',
    permissions: [
      'customer_read', 'customer_create', 'customer_update',
      'order_read', 'order_create',
      'product_read',
    ],
    isDefault: true,
  },
  {
    id: 'finance',
    name: '财务',
    description: '财务管理权限',
    permissions: [
      'finance_all', 'order_read', 'purchase_read', 'report_read',
      'report_export',
    ],
  },
  {
    id: 'hr',
    name: 'HR',
    description: '人力资源管理权限',
    permissions: ['hr_all', 'user_read'],
  },
  {
    id: 'inventory_manager',
    name: '库存管理员',
    description: '库存管理权限',
    permissions: ['inventory_all', 'product_read', 'order_read'],
  },
  {
    id: 'purchase_manager',
    name: '采购经理',
    description: '采购管理权限',
    permissions: ['purchase_all', 'product_read', 'inventory_read'],
  },
];

/**
 * 权限管理器
 */
export class PermissionManager {
  private config: Required<PermissionConfig>;
  private permissions: Map<string, Permission> = new Map();
  private roles: Map<string, Role> = new Map();
  private permissionCache: Map<string, UserPermissions> = new Map();

  constructor(config: PermissionConfig = {}) {
    this.config = {
      enabled: true,
      defaultRole: 'employee',
      superAdminRole: 'super_admin',
      cachePermissions: true,
      cacheTTL: 300, // 5分钟
      ...config,
    };

    this.loadPredefinedPermissions();
    this.loadPredefinedRoles();
  }

  /**
   * 加载预定义权限
   */
  private loadPredefinedPermissions(): void {
    PREDEFINED_PERMISSIONS.forEach((p) => {
      this.permissions.set(p.id, p);
    });
  }

  /**
   * 加载预定义角色
   */
  private loadPredefinedRoles(): void {
    PREDEFINED_ROLES.forEach((r) => {
      this.roles.set(r.id, r);
    });
  }

  /**
   * 获取用户权限
   */
  getUserPermissions(userId: string, roleIds: string[]): UserPermissions {
    // 检查缓存
    if (this.config.cachePermissions) {
      const cached = this.permissionCache.get(userId);
      if (cached) {
        return cached;
      }
    }

    const permissions = new Set<string>();
    const resources = new Map<ResourceType, Set<PermissionType>>();

    // 收集角色权限
    roleIds.forEach((roleId) => {
      const role = this.roles.get(roleId);
      if (role) {
        role.permissions.forEach((permId) => {
          const perm = this.permissions.get(permId);
          if (perm) {
            permissions.add(permId);
            if (!resources.has(perm.resource)) {
              resources.set(perm.resource, new Set());
            }
            resources.get(perm.resource)!.add(perm.type);
          }
        });
      }
    });

    // 构建资源权限列表
    const resourceList = Array.from(resources.entries()).map(([resource, types]) => ({
      resource,
      types: Array.from(types),
    }));

    const result: UserPermissions = {
      userId,
      roles: roleIds,
      permissions: Array.from(permissions),
      resources: resourceList,
    };

    // 缓存结果
    if (this.config.cachePermissions) {
      this.permissionCache.set(userId, result);
      // 设置过期时间
      setTimeout(() => {
        this.permissionCache.delete(userId);
      }, this.config.cacheTTL * 1000);
    }

    return result;
  }

  /**
   * 检查用户是否有指定权限
   */
  hasPermission(userPermissions: UserPermissions, resource: ResourceType, type: PermissionType): boolean {
    if (!this.config.enabled) {
      return true;
    }

    // 检查是否有该资源的ALL权限
    const hasAll = userPermissions.resources.some(
      (r) => r.resource === resource && r.types.includes(PermissionType.ALL)
    );

    if (hasAll) {
      return true;
    }

    // 检查是否有指定类型的权限
    return userPermissions.resources.some(
      (r) => r.resource === resource && r.types.includes(type)
    );
  }

  /**
   * 检查用户是否有任一指定权限
   */
  hasAnyPermission(
    userPermissions: UserPermissions,
    requirements: Array<{ resource: ResourceType; type: PermissionType }>
  ): boolean {
    return requirements.some((req) => this.hasPermission(userPermissions, req.resource, req.type));
  }

  /**
   * 检查用户是否有所有指定权限
   */
  hasAllPermissions(
    userPermissions: UserPermissions,
    requirements: Array<{ resource: ResourceType; type: PermissionType }>
  ): boolean {
    return requirements.every((req) => this.hasPermission(userPermissions, req.resource, req.type));
  }

  /**
   * 检查用户是否有指定角色
   */
  hasRole(userPermissions: UserPermissions, roleId: string): boolean {
    return userPermissions.roles.includes(roleId);
  }

  /**
   * 检查用户是否是超级管理员
   */
  isSuperAdmin(userPermissions: UserPermissions): boolean {
    return this.hasRole(userPermissions, this.config.superAdminRole);
  }

  /**
   * 获取权限验证中间件
   */
  requirePermission(resource: ResourceType, type: PermissionType) {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!this.config.enabled) {
        return next();
      }

      const user = (req as any).user;
      if (!user) {
        return res.status(401).json({
          success: false,
          message: '未认证用户',
          code: 'UNAUTHORIZED',
        });
      }

      const userPermissions = this.getUserPermissions(user.id, user.roles || []);
      if (this.isSuperAdmin(userPermissions)) {
        return next();
      }

      if (!this.hasPermission(userPermissions, resource, type)) {
        return res.status(403).json({
          success: false,
          message: `权限不足：需要 ${resource}.${type} 权限`,
          code: 'PERMISSION_DENIED',
          required: { resource, type },
        });
      }

      next();
    };
  }

  /**
   * 获取权限验证中间件（任一权限）
   */
  requireAnyPermission(requirements: Array<{ resource: ResourceType; type: PermissionType }>) {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!this.config.enabled) {
        return next();
      }

      const user = (req as any).user;
      if (!user) {
        return res.status(401).json({
          success: false,
          message: '未认证用户',
          code: 'UNAUTHORIZED',
        });
      }

      const userPermissions = this.getUserPermissions(user.id, user.roles || []);
      if (this.isSuperAdmin(userPermissions)) {
        return next();
      }

      if (!this.hasAnyPermission(userPermissions, requirements)) {
        return res.status(403).json({
          success: false,
          message: '权限不足：需要任一所需权限',
          code: 'PERMISSION_DENIED',
          required: requirements,
        });
      }

      next();
    };
  }

  /**
   * 获取权限验证中间件（所有权限）
   */
  requireAllPermissions(requirements: Array<{ resource: ResourceType; type: PermissionType }>) {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!this.config.enabled) {
        return next();
      }

      const user = (req as any).user;
      if (!user) {
        return res.status(401).json({
          success: false,
          message: '未认证用户',
          code: 'UNAUTHORIZED',
        });
      }

      const userPermissions = this.getUserPermissions(user.id, user.roles || []);
      if (this.isSuperAdmin(userPermissions)) {
        return next();
      }

      if (!this.hasAllPermissions(userPermissions, requirements)) {
        return res.status(403).json({
          success: false,
          message: '权限不足：需要所有所需权限',
          code: 'PERMISSION_DENIED',
          required: requirements,
        });
      }

      next();
    };
  }

  /**
   * 添加权限
   */
  addPermission(permission: Permission): void {
    this.permissions.set(permission.id, permission);
    this.clearCache();
  }

  /**
   * 更新权限
   */
  updatePermission(id: string, updates: Partial<Permission>): Permission | null {
    const existing = this.permissions.get(id);
    if (!existing) return null;

    const updated = { ...existing, ...updates };
    this.permissions.set(id, updated);
    this.clearCache();
    return updated;
  }

  /**
   * 删除权限
   */
  deletePermission(id: string): boolean {
    const result = this.permissions.delete(id);
    if (result) {
      // 从所有角色中移除该权限
      for (const [roleId, role] of this.roles) {
        role.permissions = role.permissions.filter((p) => p !== id);
        this.roles.set(roleId, role);
      }
      this.clearCache();
    }
    return result;
  }

  /**
   * 添加角色
   */
  addRole(role: Role): void {
    this.roles.set(role.id, role);
    this.clearCache();
  }

  /**
   * 更新角色
   */
  updateRole(id: string, updates: Partial<Role>): Role | null {
    const existing = this.roles.get(id);
    if (!existing) return null;

    const updated = { ...existing, ...updates };
    this.roles.set(id, updated);
    this.clearCache();
    return updated;
  }

  /**
   * 删除角色
   */
  deleteRole(id: string): boolean {
    const result = this.roles.delete(id);
    if (result) {
      this.clearCache();
    }
    return result;
  }

  /**
   * 获取所有权限
   */
  getAllPermissions(): Permission[] {
    return Array.from(this.permissions.values());
  }

  /**
   * 获取所有角色
   */
  getAllRoles(): Role[] {
    return Array.from(this.roles.values());
  }

  /**
   * 获取权限
   */
  getPermission(id: string): Permission | null {
    return this.permissions.get(id) || null;
  }

  /**
   * 获取角色
   */
  getRole(id: string): Role | null {
    return this.roles.get(id) || null;
  }

  /**
   * 获取默认角色
   */
  getDefaultRole(): Role | null {
    for (const role of this.roles.values()) {
      if (role.isDefault) {
        return role;
      }
    }
    return this.roles.get(this.config.defaultRole) || null;
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.permissionCache.clear();
  }

  /**
   * 获取配置
   */
  getConfig(): PermissionConfig {
    return { ...this.config };
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<PermissionConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

/**
 * 创建权限管理器实例（工厂函数）
 */
export function createPermissionManager(config?: PermissionConfig): PermissionManager {
  return new PermissionManager(config);
}

export default PermissionManager;