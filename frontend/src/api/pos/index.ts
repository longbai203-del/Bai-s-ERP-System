// pos API 服务
import http from '@/api/http'

export interface PosData {
    id: number
    name: string
    // 根据业务扩展
}

export const getPosList = (params?: any) => {
    return http.get('/pos', { params })
}

export const getPosDetail = (id: number) => {
    return http.get(`/pos/${id}`)
}

export const createPos = (data: any) => {
    return http.post('/pos', data)
}

export const updatePos = (id: number, data: any) => {
    return http.put(`/pos/${id}`, data)
}

export const deletePos = (id: number) => {
    return http.delete(`/pos/${id}`)
}

export const posApi = {
    getList: getPosList,
    getDetail: getPosDetail,
    create: createPos,
    update: updatePos,
    delete: deletePos,
}
