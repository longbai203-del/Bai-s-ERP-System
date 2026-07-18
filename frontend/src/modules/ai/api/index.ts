/**
 * @module ai/api
 * @description ai API 服务
 */

import api from '@/services/api'

export const aiApi = {
  list: (params?: any) => api.get('/ai', { params }),
  detail: (id: string) => api.get(/ + 'ai' + / + id),
  create: (data: any) => api.post('/ai', data),
  update: (id: string, data: any) => api.put(/ + 'ai' + / + id, data),
  delete: (id: string) => api.delete(/ + 'ai' + / + id),
}
