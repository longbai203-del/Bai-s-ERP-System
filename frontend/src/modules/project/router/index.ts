// project 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const projectRoutes: RouteRecordRaw[] = [
    {
        path: '/project',
        name: 'projectIndex',
        component: () => import('@/modules/project/pages/Index.vue'),
        meta: {
            title: 'project 管理',
            requiresAuth: true,
            icon: 'Document'
        }
    },
    {
        path: '/project/create',
        name: 'projectCreate',
        component: () => import('@/modules/project/pages/Create.vue'),
        meta: {
            title: '创建 project',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/project/:id',
        name: 'projectDetail',
        component: () => import('@/modules/project/pages/Detail.vue'),
        meta: {
            title: 'project 详情',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/project/edit/:id',
        name: 'projectEdit',
        component: () => import('@/modules/project/pages/Detail.vue'),
        meta: {
            title: '编辑 project',
            requiresAuth: true,
            hidden: true
        }
    }
]

export default projectRoutes



