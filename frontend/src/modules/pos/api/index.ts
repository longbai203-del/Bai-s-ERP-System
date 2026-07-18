/**
 * @module pos/api
 * @description pos API 服务
 */

import api from '@/services/api'

export const posApi = {
  list: (params?: any) => api.get('/pos', { params }),
  detail: (id: string) => api.get(/ + 'pos' + / + id),
  create: (data: any) => api.post('/pos', data),
  update: (id: string, data: any) => api.put(/ + 'pos' + / + id, data),
  delete: (id: string) => api.delete(/ + 'pos' + / + id),
}
