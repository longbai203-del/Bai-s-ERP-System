/**
 * 采购模块类型定义
 * 包含采购单、供应商、采购项等完整类型
 * @module modules/purchase/store/types
 */

/**
 * 采购状态枚举
 */
export enum PurchaseStatus {
  /** 待处理 */
  PENDING = 'pending',
  /** 已下单 */
  ORDERED = 'ordered',
  /** 已收货 */
  RECEIVED = 'received',
  /** 已取消 */
  CANCELLED = 'cancelled',
}

/**
 * 采购项接口
 */
export interface PurchaseItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
  receivedQuantity: number;
  pendingQuantity: number;
  note: string;
}

/**
 * 供应商接口
 */
export interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  taxId: string;
  rating: number;
  status: 'active' | 'inactive';
  categories: string[];
  paymentTerms: string;
  deliveryTerms: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 采购单接口
 */
export interface Purchase {
  id: string;
  purchaseOrder: string;
  supplierId: string;
  supplierName?: string;
  supplierContact?: string;
  supplierPhone?: string;
  supplierAddress?: string;
  items: PurchaseItem[];
  totalAmount: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  grandTotal: number;
  status: PurchaseStatus;
  note: string;
  userId: string;
  userName?: string;
  createdAt: string;
  updatedAt: string;
  orderedAt: string | null;
  receivedAt: string | null;
  cancelledAt: string | null;
}

/**
 * 创建采购单请求
 */
export interface CreatePurchaseRequest {
  supplierId: string;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
    note?: string;
  }>;
  discountAmount?: number;
  taxAmount?: number;
  shippingAmount?: number;
  note?: string;
}

/**
 * 更新采购单请求
 */
export interface UpdatePurchaseRequest {
  supplierId?: string;
  items?: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
    note?: string;
  }>;
  status?: PurchaseStatus;
  note?: string;
  discountAmount?: number;
  taxAmount?: number;
  shippingAmount?: number;
}

/**
 * 采购查询参数
 */
export interface PurchaseQueryParams {
  page?: number;
  limit?: number;
  supplierId?: string;
  status?: PurchaseStatus;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 采购统计
 */
export interface PurchaseStats {
  totalPurchases: number;
  totalAmount: number;
  byStatus: Record<PurchaseStatus, number>;
  bySupplier: Record<string, number>;
  averageAmount: number;
  pendingCount: number;
  receivedCount: number;
  monthlyTotal: Array<{ month: string; amount: number; count: number }>;
}

/**
 * 采购状态接口
 */
export interface PurchaseState {
  purchases: Purchase[];
  currentPurchase: Purchase | null;
  suppliers: Supplier[];
  stats: PurchaseStats | null;
  total: number;
  loading: boolean;
  error: string | null;
  filters: PurchaseQueryParams;
}

export default {
  PurchaseStatus,
  PurchaseItem,
  Supplier,
  Purchase,
  CreatePurchaseRequest,
  UpdatePurchaseRequest,
  PurchaseQueryParams,
  PurchaseStats,
  PurchaseState,
};