import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/layouts/default/index.vue'),
    redirect: '/dashboard',
    meta: {
      title: '仪表盘',
      icon: 'dashboard',
    },
    children: [
      {
        path: '',
        name: 'DashboardIndex',
        component: () => import('../pages/Index.vue'),
        meta: {
          title: '工作台',
          keepAlive: true,
        },
      },
    ],
  },
]

export default routes
