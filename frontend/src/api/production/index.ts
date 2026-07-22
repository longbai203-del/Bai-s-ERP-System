// production API 服务
import http from '@/api/http'

export const getproductionList = (params?: any) => {
    return http.get('/production', { params })
}

export const getproductionDetail = (id: number) => {
    return http.get(/production/\)
}

export const createproduction = (data: any) => {
    return http.post('/production', data)
}

export const updateproduction = (id: number, data: any) => {
    return http.put(/production/\, data)
}

export const deleteproduction = (id: number) => {
    return http.delete(/production/\)
}
