/**
 * @module analytics/api
 * @description analytics API 服务
 */

import api from '@/services/api'

export const analyticsApi = {
  list: (params?: any) => api.get('/analytics', { params }),
  detail: (id: string) => api.get(/ + 'analytics' + / + id),
  create: (data: any) => api.post('/analytics', data),
  update: (id: string, data: any) => api.put(/ + 'analytics' + / + id, data),
  delete: (id: string) => api.delete(/ + 'analytics' + / + id),
}
