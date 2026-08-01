// finance API 服务
import http from '@/api/http'

export interface FinanceData {
    id: number
    name: string
    // 根据业务扩展
}

export const getFinanceList = (params?: any) => {
    return http.get('/finance', { params })
}

export const getFinanceDetail = (id: number) => {
    return http.get(`/finance/${id}`)
}

export const createFinance = (data: any) => {
    return http.post('/finance', data)
}

export const updateFinance = (id: number, data: any) => {
    return http.put(`/finance/${id}`, data)
}

export const deleteFinance = (id: number) => {
    return http.delete(`/finance/${id}`)
}

export const financeApi = {
    getList: getFinanceList,
    getDetail: getFinanceDetail,
    create: createFinance,
    update: updateFinance,
    delete: deleteFinance,
}
