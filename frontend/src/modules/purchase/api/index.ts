/**
 * @module purchase/api
 * @description purchase API 服务
 */

import api from '@/services/api'

export const purchaseApi = {
  list: (params?: any) => api.get('/purchase', { params }),
  detail: (id: string) => api.get(/ + 'purchase' + / + id),
  create: (data: any) => api.post('/purchase', data),
  update: (id: string, data: any) => api.put(/ + 'purchase' + / + id, data),
  delete: (id: string) => api.delete(/ + 'purchase' + / + id),
}
