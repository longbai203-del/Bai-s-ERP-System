// Pos API 服务
import http from '@/api/http'

export const getPosList = (params?: any) => {
    return http.get('/Pos', { params })
}

export const getPosDetail = (id: number) => {
    return http.get('/Pos/' + id)
}

export const createPos = (data: any) => {
    return http.post('/Pos', data)
}

export const updatePos = (id: number, data: any) => {
    return http.put('/Pos/' + id, data)
}

export const deletePos = (id: number) => {
    return http.delete('/Pos/' + id)
}

export const PosApi = {
    getList: getPosList,
    getDetail: getPosDetail,
    create: createPos,
    update: updatePos,
    delete: deletePos,
}
