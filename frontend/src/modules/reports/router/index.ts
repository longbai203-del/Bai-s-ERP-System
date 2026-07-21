// reports 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const reportsRoutes: RouteRecordRaw[] = [
    {
        path: '/reports',
        name: 'reportsIndex',
        component: () => import('@/modules/reports/pages/Index.vue'),
        meta: {
            title: 'reports 管理',
            requiresAuth: true,
            icon: 'Document'
        }
    },
    {
        path: '/reports/create',
        name: 'reportsCreate',
        component: () => import('@/modules/reports/pages/Create.vue'),
        meta: {
            title: '创建 reports',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/reports/:id',
        name: 'reportsDetail',
        component: () => import('@/modules/reports/pages/Detail.vue'),
        meta: {
            title: 'reports 详情',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/reports/edit/:id',
        name: 'reportsEdit',
        component: () => import('@/modules/reports/pages/Detail.vue'),
        meta: {
            title: '编辑 reports',
            requiresAuth: true,
            hidden: true
        }
    }
]

export default reportsRoutes



