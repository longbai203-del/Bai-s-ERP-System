// ai 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const aiRoutes: RouteRecordRaw[] = [
    {
        path: '/ai',
        name: 'aiIndex',
        component: () => import('@/modules/ai/pages/Index.vue'),
        meta: {
            title: 'ai 管理',
            requiresAuth: true,
            icon: 'Document'
        }
    },
    {
        path: '/ai/create',
        name: 'aiCreate',
        component: () => import('@/modules/ai/pages/Create.vue'),
        meta: {
            title: '创建 ai',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/ai/:id',
        name: 'aiDetail',
        component: () => import('@/modules/ai/pages/Detail.vue'),
        meta: {
            title: 'ai 详情',
            requiresAuth: true,
            hidden: true
        }
    },
    {
        path: '/ai/edit/:id',
        name: 'aiEdit',
        component: () => import('@/modules/ai/pages/Detail.vue'),
        meta: {
            title: '编辑 ai',
            requiresAuth: true,
            hidden: true
        }
    }
]

export default aiRoutes



