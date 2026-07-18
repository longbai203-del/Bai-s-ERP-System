/**
 * @module inventory/api
 * @description inventory API 服务
 */

import api from '@/services/api'

export const inventoryApi = {
  list: (params?: any) => api.get('/inventory', { params }),
  detail: (id: string) => api.get(/ + 'inventory' + / + id),
  create: (data: any) => api.post('/inventory', data),
  update: (id: string, data: any) => api.put(/ + 'inventory' + / + id, data),
  delete: (id: string) => api.delete(/ + 'inventory' + / + id),
}
