// Finance API 服务
import http from '@/api/http'

export const getFinanceList = (params?: any) => {
    return http.get('/Finance', { params })
}

export const getFinanceDetail = (id: number) => {
    return http.get('/Finance/' + id)
}

export const createFinance = (data: any) => {
    return http.post('/Finance', data)
}

export const updateFinance = (id: number, data: any) => {
    return http.put('/Finance/' + id, data)
}

export const deleteFinance = (id: number) => {
    return http.delete('/Finance/' + id)
}

export const FinanceApi = {
    getList: getFinanceList,
    getDetail: getFinanceDetail,
    create: createFinance,
    update: updateFinance,
    delete: deleteFinance,
}
