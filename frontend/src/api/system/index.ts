// System API 服务
import http from '@/api/http'

export const getSystemList = (params?: any) => {
    return http.get('/System', { params })
}

export const getSystemDetail = (id: number) => {
    return http.get('/System/' + id)
}

export const createSystem = (data: any) => {
    return http.post('/System', data)
}

export const updateSystem = (id: number, data: any) => {
    return http.put('/System/' + id, data)
}

export const deleteSystem = (id: number) => {
    return http.delete('/System/' + id)
}

export const SystemApi = {
    getList: getSystemList,
    getDetail: getSystemDetail,
    create: createSystem,
    update: updateSystem,
    delete: deleteSystem,
}
