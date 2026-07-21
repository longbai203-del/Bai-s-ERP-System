// inventory 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const inventoryRoutes: RouteRecordRaw[] = [
    {
        path: '/inventory',
        name: 'inventoryIndex',
        component: () => import('@/modules/inventory/pages/Index.vue'),
        meta: {
            title: 'inventory 管理',
            requiresAuth: true,
            icon: 'Document'
        }
    },
    {
        path: '/inventory/create',
        name: 'inventoryCreate',
        component: () => import('@/modules/inventory/pages/Create.vue'),
        meta: {
            title: '创建 inventory',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/inventory/:id',
        name: 'inventoryDetail',
        component: () => import('@/modules/inventory/pages/Detail.vue'),
        meta: {
            title: 'inventory 详情',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/inventory/edit/:id',
        name: 'inventoryEdit',
        component: () => import('@/modules/inventory/pages/Detail.vue'),
        meta: {
            title: '编辑 inventory',
            requiresAuth: true,
            hidden: true
        }
    }
]

export default inventoryRoutes



