// production 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const productionRoutes: RouteRecordRaw[] = [
    {
        path: '/production',
        name: 'productionIndex',
        component: () => import('@/modules/production/pages/Index.vue'),
        meta: {
            title: 'production 管理',
            requiresAuth: true,
            icon: 'Document'
        }
    },
    {
        path: '/production/create',
        name: 'productionCreate',
        component: () => import('@/modules/production/pages/Create.vue'),
        meta: {
            title: '创建 production',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/production/:id',
        name: 'productionDetail',
        component: () => import('@/modules/production/pages/Detail.vue'),
        meta: {
            title: 'production 详情',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/production/edit/:id',
        name: 'productionEdit',
        component: () => import('@/modules/production/pages/Detail.vue'),
        meta: {
            title: '编辑 production',
            requiresAuth: true,
            hidden: true
        }
    }
]

export default productionRoutes



