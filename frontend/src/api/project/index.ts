// Project API 服务
import http from '@/api/http'

export const getProjectList = (params?: any) => {
    return http.get('/Project', { params })
}

export const getProjectDetail = (id: number) => {
    return http.get('/Project/' + id)
}

export const createProject = (data: any) => {
    return http.post('/Project', data)
}

export const updateProject = (id: number, data: any) => {
    return http.put('/Project/' + id, data)
}

export const deleteProject = (id: number) => {
    return http.delete('/Project/' + id)
}

export const ProjectApi = {
    getList: getProjectList,
    getDetail: getProjectDetail,
    create: createProject,
    update: updateProject,
    delete: deleteProject,
}
