/**
 * @module products/api
 * @description products API 服务
 */

import api from '@/services/api'

export const productsApi = {
  list: (params?: any) => api.get('/products', { params }),
  detail: (id: string) => api.get(/ + 'products' + / + id),
  create: (data: any) => api.post('/products', data),
  update: (id: string, data: any) => api.put(/ + 'products' + / + id, data),
  delete: (id: string) => api.delete(/ + 'products' + / + id),
}
