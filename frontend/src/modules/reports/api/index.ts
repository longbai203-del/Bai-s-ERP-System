/**
 * @module reports/api
 * @description reports API 服务
 */

import api from '@/services/api'

export const reportsApi = {
  list: (params?: any) => api.get('/reports', { params }),
  detail: (id: string) => api.get(/ + 'reports' + / + id),
  create: (data: any) => api.post('/reports', data),
  update: (id: string, data: any) => api.put(/ + 'reports' + / + id, data),
  delete: (id: string) => api.delete(/ + 'reports' + / + id),
}
