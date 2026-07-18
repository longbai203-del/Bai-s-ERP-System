/**
 * @module orders/api
 * @description orders API 服务
 */

import api from '@/services/api'

export const ordersApi = {
  list: (params?: any) => api.get('/orders', { params }),
  detail: (id: string) => api.get(/ + 'orders' + / + id),
  create: (data: any) => api.post('/orders', data),
  update: (id: string, data: any) => api.put(/ + 'orders' + / + id, data),
  delete: (id: string) => api.delete(/ + 'orders' + / + id),
}
