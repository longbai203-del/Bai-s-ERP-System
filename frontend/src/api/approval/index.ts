// approval API 服务
import http from '@/api/http'

export const getapprovalList = (params?: any) => {
    return http.get('/approval', { params })
}

export const getapprovalDetail = (id: number) => {
    return http.get(/approval/\)
}

export const createapproval = (data: any) => {
    return http.post('/approval', data)
}

export const updateapproval = (id: number, data: any) => {
    return http.put(/approval/\, data)
}

export const deleteapproval = (id: number) => {
    return http.delete(/approval/\)
}
