// project API 服务
import http from '@/api/http'

export const getprojectList = (params?: any) => {
    return http.get('/project', { params })
}

export const getprojectDetail = (id: number) => {
    return http.get(/project/\)
}

export const createproject = (data: any) => {
    return http.post('/project', data)
}

export const updateproject = (id: number, data: any) => {
    return http.put(/project/\, data)
}

export const deleteproject = (id: number) => {
    return http.delete(/project/\)
}
