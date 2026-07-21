// saas 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const saasRoutes: RouteRecordRaw[] = [
    {
        path: '/saas',
        name: 'saasIndex',
        component: () => import('@/modules/saas/pages/Index.vue'),
        meta: {
            title: 'saas 管理',
            requiresAuth: true,
            icon: 'Document'
        }
    },
    {
        path: '/saas/create',
        name: 'saasCreate',
        component: () => import('@/modules/saas/pages/Create.vue'),
        meta: {
            title: '创建 saas',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/saas/:id',
        name: 'saasDetail',
        component: () => import('@/modules/saas/pages/Detail.vue'),
        meta: {
            title: 'saas 详情',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/saas/edit/:id',
        name: 'saasEdit',
        component: () => import('@/modules/saas/pages/Detail.vue'),
        meta: {
            title: '编辑 saas',
            requiresAuth: true,
            hidden: true
        }
    }
]

export default saasRoutes



