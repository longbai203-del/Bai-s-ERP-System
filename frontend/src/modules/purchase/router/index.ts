// purchase 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const purchaseRoutes: RouteRecordRaw[] = [
    {
        path: '/purchase',
        name: 'purchaseIndex',
        component: () => import('@/modules/purchase/pages/Index.vue'),
        meta: {
            title: 'purchase 管理',
            requiresAuth: true,
            icon: 'Document'
        }
    },
    {
        path: '/purchase/create',
        name: 'purchaseCreate',
        component: () => import('@/modules/purchase/pages/Create.vue'),
        meta: {
            title: '创建 purchase',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/purchase/:id',
        name: 'purchaseDetail',
        component: () => import('@/modules/purchase/pages/Detail.vue'),
        meta: {
            title: 'purchase 详情',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/purchase/edit/:id',
        name: 'purchaseEdit',
        component: () => import('@/modules/purchase/pages/Detail.vue'),
        meta: {
            title: '编辑 purchase',
            requiresAuth: true,
            hidden: true
        }
    }
]

export default purchaseRoutes



