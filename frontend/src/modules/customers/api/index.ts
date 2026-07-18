/**
 * @module customers/api
 * @description customers API 服务
 */

import api from '@/services/api'

export const customersApi = {
  list: (params?: any) => api.get('/customers', { params }),
  detail: (id: string) => api.get(/ + 'customers' + / + id),
  create: (data: any) => api.post('/customers', data),
  update: (id: string, data: any) => api.put(/ + 'customers' + / + id, data),
  delete: (id: string) => api.delete(/ + 'customers' + / + id),
}
