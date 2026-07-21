// analytics 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const analyticsRoutes: RouteRecordRaw[] = [
    {
        path: '/analytics',
        name: 'analyticsIndex',
        component: () => import('@/modules/analytics/pages/Index.vue'),
        meta: {
            title: 'analytics 管理',
            requiresAuth: true,
            icon: 'Document'
        }
    },
    {
        path: '/analytics/create',
        name: 'analyticsCreate',
        component: () => import('@/modules/analytics/pages/Create.vue'),
        meta: {
            title: '创建 analytics',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/analytics/:id',
        name: 'analyticsDetail',
        component: () => import('@/modules/analytics/pages/Detail.vue'),
        meta: {
            title: 'analytics 详情',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/analytics/edit/:id',
        name: 'analyticsEdit',
        component: () => import('@/modules/analytics/pages/Detail.vue'),
        meta: {
            title: '编辑 analytics',
            requiresAuth: true,
            hidden: true
        }
    }
]

export default analyticsRoutes



