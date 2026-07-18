/**
 * @module finance/api
 * @description finance API 服务
 */

import api from '@/services/api'

export const financeApi = {
  list: (params?: any) => api.get('/finance', { params }),
  detail: (id: string) => api.get(/ + 'finance' + / + id),
  create: (data: any) => api.post('/finance', data),
  update: (id: string, data: any) => api.put(/ + 'finance' + / + id, data),
  delete: (id: string) => api.delete(/ + 'finance' + / + id),
}
