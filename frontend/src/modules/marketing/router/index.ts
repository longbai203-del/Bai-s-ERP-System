// marketing 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const marketingRoutes: RouteRecordRaw[] = [
    {
        path: '/marketing',
        name: 'marketingIndex',
        component: () => import('@/modules/marketing/pages/Index.vue'),
        meta: {
            title: 'marketing 管理',
            requiresAuth: true,
            icon: 'Document'
        }
    },
    {
        path: '/marketing/create',
        name: 'marketingCreate',
        component: () => import('@/modules/marketing/pages/Create.vue'),
        meta: {
            title: '创建 marketing',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/marketing/:id',
        name: 'marketingDetail',
        component: () => import('@/modules/marketing/pages/Detail.vue'),
        meta: {
            title: 'marketing 详情',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/marketing/edit/:id',
        name: 'marketingEdit',
        component: () => import('@/modules/marketing/pages/Detail.vue'),
        meta: {
            title: '编辑 marketing',
            requiresAuth: true,
            hidden: true
        }
    }
]

export default marketingRoutes



