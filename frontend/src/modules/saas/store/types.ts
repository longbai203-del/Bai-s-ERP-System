/**
 * 订单模块类型定义
 * @module modules/orders/store/types
 */

/**
 * 订单状态枚举
 */
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

/**
 * 支付状态枚举
 */
export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIAL = 'partial',
}

/**
 * 订单项接口
 */
export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  total: number;
}

/**
 * 地址接口
 */
export interface Address {
  name: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
}

/**
 * 订单接口
 */
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  items: OrderItem[];
  totalAmount: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  grandTotal: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  shippingAddress: Address;
  billingAddress: Address;
  trackingNumber: string;
  note: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

/**
 * 创建订单请求
 */
export interface CreateOrderRequest {
  customerId: string;
  items: Omit<OrderItem, 'total' | 'productName'>[];
  shippingAddress: Address;
  billingAddress?: Address;
  discountAmount?: number;
  taxAmount?: number;
  shippingAmount?: number;
  currency?: string;
  note?: string;
}

/**
 * 更新订单请求
 */
export interface UpdateOrderRequest {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  shippingAddress?: Address;
  trackingNumber?: string;
  note?: string;
}

/**
 * 更新订单状态请求
 */
export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  reason?: string;
}

/**
 * 订单查询参数
 */
export interface OrderQueryParams {
  page?: number;
  limit?: number;
  customerId?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 订单状态
 */
export interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  total: number;
  loading: boolean;
  error: string | null;
  filters: OrderQueryParams;
}

export default {
  OrderStatus,
  PaymentStatus,
  OrderItem,
  Address,
  Order,
  CreateOrderRequest,
  UpdateOrderRequest,
  UpdateOrderStatusRequest,
  OrderQueryParams,
  OrderState,
};