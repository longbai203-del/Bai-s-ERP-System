// Marketing API 服务
import http from '@/api/http'

export const getMarketingList = (params?: any) => {
    return http.get('/Marketing', { params })
}

export const getMarketingDetail = (id: number) => {
    return http.get('/Marketing/' + id)
}

export const createMarketing = (data: any) => {
    return http.post('/Marketing', data)
}

export const updateMarketing = (id: number, data: any) => {
    return http.put('/Marketing/' + id, data)
}

export const deleteMarketing = (id: number) => {
    return http.delete('/Marketing/' + id)
}

export const MarketingApi = {
    getList: getMarketingList,
    getDetail: getMarketingDetail,
    create: createMarketing,
    update: updateMarketing,
    delete: deleteMarketing,
}
