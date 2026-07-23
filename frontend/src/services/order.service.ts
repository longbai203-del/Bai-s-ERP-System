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

export class OrderService extends BaseService {
  async getList(params?: any) {
    return this.get('/orders', { params });
  }
  
  async getById(id: string) {
    return this.get(`/orders/${id}`);
  }
  
  async getByOrderNo(orderNo: string) {
    return this.get(`/orders/number/${orderNo}`);
  }
  
  async getByCustomer(customerId: string) {
    return this.get(`/orders/customer/${customerId}`);
  }
  
  async getByStatus(status: string) {
    return this.get(`/orders/status/${status}`);
  }
  
  async getStatistics() {
    return this.get('/orders/statistics');
  }
  
  async create(data: Partial<Order>) {
    return this.post('/orders', data);
  }
  
  async update(id: string, data: Partial<Order>) {
    return this.put(`/orders/${id}`, data);
  }
  
  async updateStatus(id: string, status: string) {
    return this.patch(`/orders/${id}/status`, { status });
  }
  
  async cancelOrder(id: string, reason: string) {
    return this.patch(`/orders/${id}/cancel`, { reason });
  }
  
  async delete(id: string) {
    return this.delete(`/orders/${id}`);
  }
}

export const orderService = new OrderService();
