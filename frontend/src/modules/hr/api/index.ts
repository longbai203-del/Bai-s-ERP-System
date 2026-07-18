/**
 * @module hr/api
 * @description hr API 服务
 */

import api from '@/services/api'

export const hrApi = {
  list: (params?: any) => api.get('/hr', { params }),
  detail: (id: string) => api.get(/ + 'hr' + / + id),
  create: (data: any) => api.post('/hr', data),
  update: (id: string, data: any) => api.put(/ + 'hr' + / + id, data),
  delete: (id: string) => api.delete(/ + 'hr' + / + id),
}
