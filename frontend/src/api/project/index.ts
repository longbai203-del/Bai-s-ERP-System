// project API 服务
import http from '@/api/http'

export const getProjectList = (params?: any) => {
    return http.get('/project', { params })
}

export const getProjectDetail = (id: number) => {
    return http.get(`/project/${id}`)
}

export const createProject = (data: any) => {
    return http.post('/project', data)
}

export const updateProject = (id: number, data: any) => {
    return http.put(`/project/${id}`, data)
}

export const deleteProject = (id: number) => {
    return http.delete(`/project/${id}`)
}

export const projectApi = {
    getList: getProjectList,
    getDetail: getProjectDetail,
    create: createProject,
    update: updateProject,
    delete: deleteProject,
    getProjects: getProjectList,
    getProjectDetail,
}

export const projectsApi = projectApi
