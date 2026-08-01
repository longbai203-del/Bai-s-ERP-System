// Approval API 服务
import http from '@/api/http'

export const getApprovalList = (params?: any) => {
    return http.get('/Approval', { params })
}

export const getApprovalDetail = (id: number) => {
    return http.get('/Approval/' + id)
}

export const createApproval = (data: any) => {
    return http.post('/Approval', data)
}

export const updateApproval = (id: number, data: any) => {
    return http.put('/Approval/' + id, data)
}

export const deleteApproval = (id: number) => {
    return http.delete('/Approval/' + id)
}

export const ApprovalApi = {
    getList: getApprovalList,
    getDetail: getApprovalDetail,
    create: createApproval,
    update: updateApproval,
    delete: deleteApproval,
}
