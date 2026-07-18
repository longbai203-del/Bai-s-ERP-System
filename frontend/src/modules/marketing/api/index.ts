/**
 * @module marketing/api
 * @description marketing API 服务
 */

import api from '@/services/api'

export const marketingApi = {
  list: (params?: any) => api.get('/marketing', { params }),
  detail: (id: string) => api.get(/ + 'marketing' + / + id),
  create: (data: any) => api.post('/marketing', data),
  update: (id: string, data: any) => api.put(/ + 'marketing' + / + id, data),
  delete: (id: string) => api.delete(/ + 'marketing' + / + id),
}
