// Hr API 服务
import http from '@/api/http'

export const getHrList = (params?: any) => {
    return http.get('/Hr', { params })
}

export const getHrDetail = (id: number) => {
    return http.get('/Hr/' + id)
}

export const createHr = (data: any) => {
    return http.post('/Hr', data)
}

export const updateHr = (id: number, data: any) => {
    return http.put('/Hr/' + id, data)
}

export const deleteHr = (id: number) => {
    return http.delete('/Hr/' + id)
}

export const HrApi = {
    getList: getHrList,
    getDetail: getHrDetail,
    create: createHr,
    update: updateHr,
    delete: deleteHr,
}
