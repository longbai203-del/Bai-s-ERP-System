/**
 * @file src/types/index.ts
 * 全局类型定义 - 统一管理类型接口
 */

// ============================================
// 基础类型
// ============================================

export type ID = number | string;
export type DateTime = Date | string;
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Primitive = string | number | boolean | null | undefined;
export type JSONValue = Primitive | JSONObject | JSONArray;
export interface JSONObject {
  [key: string]: JSONValue;
}
export type JSONArray = JSONValue[];

// ============================================
// 分页类型
// ============================================

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================
// API 响应类型
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
  errors?: any[];
  timestamp: string;
  path?: string;
}

export interface ApiErrorResponse {
  success: false;
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  path?: string;
  stack?: string;
}

// ============================================
// 用户认证类型
// ============================================

export interface User {
  id: ID;
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
  tenantId?: string;
  avatar?: string;
  fullName?: string;
  department?: string;
  position?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthContext {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ============================================
// 业务实体类型
// ============================================

export interface Customer {
  id: ID;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address?: string;
  taxId?: string;
  industry?: string;
  website?: string;
  notes?: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  creditLimit: number;
  balance: number;
  customerLevel?: string;
  source?: string;
  salesRep?: string;
  customFields?: Record<string, any>;
  lastContactDate?: DateTime;
  nextFollowUpDate?: DateTime;
  lastOrderDate?: DateTime;
  orderCount: number;
  totalSpent: number;
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt?: DateTime;
}

export interface Order {
  id: ID;
  orderNumber: string;
  customerId: ID;
  customer?: Customer;
  orderDate: DateTime;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  shippingAddress: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface OrderItem {
  id: ID;
  orderId: ID;
  productId: ID;
  product?: Product;
  quantity: number;
  unitPrice: number;
  discount: number;
  totalPrice: number;
  createdAt: DateTime;
}

export interface Product {
  id: ID;
  name: string;
  description?: string;
  category: string;
  sku: string;
  unitPrice: number;
  costPrice?: number;
  stockQuantity: number;
  minStock: number;
  maxStock: number;
  weight?: number;
  dimensions?: string;
  brand?: string;
  status: 'active' | 'inactive' | 'discontinued';
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface Finance {
  id: ID;
  invoiceNumber: string;
  customerId: ID;
  customer?: Customer;
  issueDate: DateTime;
  dueDate: DateTime;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  notes?: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface InvoiceItem {
  id: ID;
  invoiceId: ID;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  discount: number;
  totalPrice: number;
}

export interface Settings {
  id: ID;
  key: string;
  value: string;
  group: string;
  description?: string;
  isEncrypted: boolean;
  isSystem: boolean;
  createdAt: DateTime;
  updatedAt: DateTime;
}

// ============================================
// 过滤与搜索类型
// ============================================

export interface CustomerFilters {
  keyword?: string;
  status?: Customer['status'];
  industry?: string;
  minCredit?: number;
  maxCredit?: number;
  registeredFrom?: DateTime;
  registeredTo?: DateTime;
}

export interface OrderFilters {
  status?: Order['status'];
  customerId?: ID;
  dateFrom?: DateTime;
  dateTo?: DateTime;
  minAmount?: number;
  maxAmount?: number;
  keyword?: string;
}

export interface ProductFilters {
  category?: string;
  status?: Product['status'];
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  minStock?: number;
  maxStock?: number;
  brand?: string;
}

export interface InvoiceFilters {
  status?: Finance['status'];
  customerId?: ID;
  dateFrom?: DateTime;
  dateTo?: DateTime;
  minAmount?: number;
  maxAmount?: number;
  keyword?: string;
}

// ============================================
// 统计类型
// ============================================

export interface DashboardStats {
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  pendingOrders: number;
  lowStockItems: number;
  overdueInvoices: number;
  monthlyRevenue: Array<{ month: string; amount: number }>;
}

export interface CustomerStats {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  pending: number;
  totalCredit: number;
  averageCredit: number;
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
}

export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  discontinuedProducts: number;
  totalStockValue: number;
  averagePrice: number;
  categoriesCount: number;
}

export interface FinanceStats {
  totalInvoices: number;
  totalAmount: number;
  totalPaid: number;
  totalOverdue: number;
  paidAmount: number;
  overdueAmount: number;
  averageInvoiceAmount: number;
}

// ============================================
// 工具类型
// ============================================

export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type ValueOf<T> = T[keyof T];

export type PickByType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P];
};

export type OmitByType<T, U> = {
  [P in keyof T as T[P] extends U ? never : P]: T[P];
};

// ============================================
// 环境变量类型
// ============================================

export interface EnvConfig {
  NODE_ENV: 'development' | 'test' | 'production' | 'staging';
  APP_NAME: string;
  APP_VERSION: string;
  PORT: number;
  HOST: string;
  API_PREFIX: string;
  DEBUG: boolean;
  HTTPS: boolean;
  DB_TYPE: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_POOL_SIZE: number;
  DB_CONNECT_TIMEOUT: number;
  DB_SSL: boolean;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string | number;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES_IN: string | number;
  BCRYPT_ROUNDS: number;
  LOG_LEVEL: string;
  LOG_DIR: string;
  CORS_ENABLED: boolean;
  CORS_ORIGINS: string[];
  RATE_LIMIT_ENABLED: boolean;
  RATE_LIMIT_WINDOW: number;
  RATE_LIMIT_MAX: number;
}