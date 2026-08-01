// approval API 服务
import http from '@/api/http'

export const getapprovalList = (params?: any) => {
    return http.get('/approval', { params })
}

export const getapprovalDetail = (id: number) => {
    return http.get(`/approval/${id}`)
}

export const getApprovalList = getapprovalList
export const getApprovalDetail = getapprovalDetail

export const createApproval = (data: any) => {
    return http.post('/approval', data)
}

export const updateApproval = (id: number, data: any) => {
    return http.put(`/approval/${id}`, data)
}

export const deleteApproval = (id: number) => {
    return http.delete(`/approval/${id}`)
}

export const approvalApi = {
    getList: getApprovalList,
    getDetail: getApprovalDetail,
    create: createApproval,
    update: updateApproval,
    delete: deleteApproval,
}
