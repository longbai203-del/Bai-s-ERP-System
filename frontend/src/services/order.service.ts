import { BaseService } from './base.service';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  orderNo: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  discount: number;
  tax: number;
  finalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  shippingAddress: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderQuery {
  page?: number;
  limit?: number;
  status?: string;
  customerId?: string;
  startDate?: string;
  endDate?: string;
}

export class OrderService extends BaseService {
  constructor() {
    super();
  }
  
  // 获取订单列表
  async getList(params: OrderQuery) {
    return this.get('/orders', { params });
  }
  
  // 获取订单详情
  async getById(id: string) {
    return this.get(`/orders/${id}`);
  }
  
  // 根据订单号获取
  async getByOrderNo(orderNo: string) {
    return this.get(`/orders/number/${orderNo}`);
  }
  
  // 根据客户获取
  async getByCustomer(customerId: string) {
    return this.get(`/orders/customer/${customerId}`);
  }
  
  // 根据状态获取
  async getByStatus(status: string) {
    return this.get(`/orders/status/${status}`);
  }
  
  // 获取订单统计
  async getStatistics() {
    return this.get('/orders/statistics');
  }
  
  // 创建订单
  async create(data: Partial<Order>) {
    return this.post('/orders', data);
  }
  
  // 更新订单
  async update(id: string, data: Partial<Order>) {
    return this.put(`/orders/${id}`, data);
  }
  
  // 更新订单状态
  async updateStatus(id: string, status: string) {
    return this.patch(`/orders/${id}/status`, { status });
  }
  
  // 取消订单
  async cancelOrder(id: string, reason: string) {
    return this.patch(`/orders/${id}/cancel`, { reason });
  }
  
  // 删除订单
  async delete(id: string) {
    return this.delete(`/orders/${id}`);
  }
}

export const orderService = new OrderService();
