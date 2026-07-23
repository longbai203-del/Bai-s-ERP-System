// ===== HTTP 状态码 =====
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const;

// ===== 分页默认值 =====
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_SIZES: [10, 20, 50, 100],
  MAX_LIMIT: 100
} as const;

// ===== 角色常量 =====
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
  GUEST: 'guest'
} as const;

// ===== 权限常量 =====
export const PERMISSIONS = {
  // 用户管理
  USER_VIEW: 'user:view',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',

  // 角色管理
  ROLE_VIEW: 'role:view',
  ROLE_CREATE: 'role:create',
  ROLE_UPDATE: 'role:update',
  ROLE_DELETE: 'role:delete',

  // 订单管理
  ORDER_VIEW: 'order:view',
  ORDER_CREATE: 'order:create',
  ORDER_UPDATE: 'order:update',
  ORDER_DELETE: 'order:delete',

  // 库存管理
  INVENTORY_VIEW: 'inventory:view',
  INVENTORY_CREATE: 'inventory:create',
  INVENTORY_UPDATE: 'inventory:update',
  INVENTORY_DELETE: 'inventory:delete',

  // 财务管理
  FINANCE_VIEW: 'finance:view',
  FINANCE_CREATE: 'finance:create',
  FINANCE_UPDATE: 'finance:update',
  FINANCE_DELETE: 'finance:delete'
} as const;

// ===== 订单状态 =====
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  [ORDER_STATUS.PENDING]: '待处理',
  [ORDER_STATUS.PROCESSING]: '处理中',
  [ORDER_STATUS.SHIPPED]: '已发货',
  [ORDER_STATUS.COMPLETED]: '已完成',
  [ORDER_STATUS.CANCELLED]: '已取消'
};

export const ORDER_STATUS_TYPES: Record<string, string> = {
  [ORDER_STATUS.PENDING]: 'warning',
  [ORDER_STATUS.PROCESSING]: 'info',
  [ORDER_STATUS.SHIPPED]: 'primary',
  [ORDER_STATUS.COMPLETED]: 'success',
  [ORDER_STATUS.CANCELLED]: 'danger'
};

// ===== 库存状态 =====
export const INVENTORY_STATUS = {
  IN_STOCK: 'in_stock',
  LOW_STOCK: 'low_stock',
  OUT_OF_STOCK: 'out_of_stock'
} as const;

export const INVENTORY_STATUS_LABELS: Record<string, string> = {
  [INVENTORY_STATUS.IN_STOCK]: '有货',
  [INVENTORY_STATUS.LOW_STOCK]: '低库存',
  [INVENTORY_STATUS.OUT_OF_STOCK]: '缺货'
};

export const INVENTORY_STATUS_TYPES: Record<string, string> = {
  [INVENTORY_STATUS.IN_STOCK]: 'success',
  [INVENTORY_STATUS.LOW_STOCK]: 'warning',
  [INVENTORY_STATUS.OUT_OF_STOCK]: 'danger'
};

// ===== 支付状态 =====
export const PAYMENT_STATUS = {
  UNPAID: 'unpaid',
  PAID: 'paid',
  REFUNDED: 'refunded'
} as const;

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  [PAYMENT_STATUS.UNPAID]: '未支付',
  [PAYMENT_STATUS.PAID]: '已支付',
  [PAYMENT_STATUS.REFUNDED]: '已退款'
};

// ===== 日期格式 =====
export const DATE_FORMAT = {
  DATE: 'YYYY-MM-DD',
  TIME: 'HH:mm:ss',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  DATE_SHORT: 'YYYY/MM/DD',
  DATETIME_SHORT: 'YYYY/MM/DD HH:mm'
} as const;

// ===== 文件大小限制 =====
export const FILE_SIZE = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
} as const;

// ===== 缓存时间 =====
export const CACHE_TIME = {
  SHORT: 5 * 60 * 1000,   // 5分钟
  MEDIUM: 30 * 60 * 1000,  // 30分钟
  LONG: 24 * 60 * 60 * 1000 // 24小时
} as const;
