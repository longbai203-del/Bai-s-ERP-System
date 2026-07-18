/**
 * @module dashboard/api
 * @description dashboard API 服务
 */

import api from '@/services/api'

export const dashboardApi = {
  list: (params?: any) => api.get('/dashboard', { params }),
  detail: (id: string) => api.get(/ + 'dashboard' + / + id),
  create: (data: any) => api.post('/dashboard', data),
  update: (id: string, data: any) => api.put(/ + 'dashboard' + / + id, data),
  delete: (id: string) => api.delete(/ + 'dashboard' + / + id),
}
