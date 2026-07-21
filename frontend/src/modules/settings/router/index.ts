// settings 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const settingsRoutes: RouteRecordRaw[] = [
    {
        path: '/settings',
        name: 'settingsIndex',
        component: () => import('@/modules/settings/pages/Index.vue'),
        meta: {
            title: 'settings 管理',
            requiresAuth: true,
            icon: 'Document'
        }
    },
    {
        path: '/settings/create',
        name: 'settingsCreate',
        component: () => import('@/modules/settings/pages/Create.vue'),
        meta: {
            title: '创建 settings',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/settings/:id',
        name: 'settingsDetail',
        component: () => import('@/modules/settings/pages/Detail.vue'),
        meta: {
            title: 'settings 详情',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/settings/edit/:id',
        name: 'settingsEdit',
        component: () => import('@/modules/settings/pages/Detail.vue'),
        meta: {
            title: '编辑 settings',
            requiresAuth: true,
            hidden: true
        }
    }
]

export default settingsRoutes



