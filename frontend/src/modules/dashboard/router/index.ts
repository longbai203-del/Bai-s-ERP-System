// dashboard 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const dashboardRoutes: RouteRecordRaw[] = [
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('../pages/Overview.vue'),
        meta: {
            title: '总览仪表盘',
            requiresAuth: true,
            icon: 'DataLine'
        }
    }
]

export default dashboardRoutes
