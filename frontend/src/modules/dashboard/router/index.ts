// dashboard 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const dashboardRoutes: RouteRecordRaw[] = [
    {
        path: '/dashboard',
        name: 'dashboardIndex',
        component: () => import('@/modules/dashboard/pages/Index.vue'),
        meta: {
            title: 'dashboard 管理',
            requiresAuth: true,
            icon: 'Document'
        }
    },
    {
        path: '/dashboard/create',
        name: 'dashboardCreate',
        component: () => import('@/modules/dashboard/pages/Create.vue'),
        meta: {
            title: '创建 dashboard',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/dashboard/:id',
        name: 'dashboardDetail',
        component: () => import('@/modules/dashboard/pages/Detail.vue'),
        meta: {
            title: 'dashboard 详情',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/dashboard/edit/:id',
        name: 'dashboardEdit',
        component: () => import('@/modules/dashboard/pages/Detail.vue'),
        meta: {
            title: '编辑 dashboard',
            requiresAuth: true,
            hidden: true
        }
    }
]

export default dashboardRoutes



