import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/finance',
    name: 'finance',
    component: () => import('@/layouts/default/index.vue'),
    meta: {
      title: 'finance管理',
      icon: 'folder',
    },
    children: [
      {
        path: '',
        name: 'financeIndex',
        component: () => import('../pages/Index.vue'),
        meta: {
          title: 'finance列表',
          keepAlive: true,
        },
      },
      {
        path: 'create',
        name: 'financeCreate',
        component: () => import('../pages/Create.vue'),
        meta: {
          title: '创建finance',
          hidden: true,
        },
      },
      {
        path: ':id/edit',
        name: 'financeEdit',
        component: () => import('../pages/Edit.vue'),
        meta: {
          title: '编辑finance',
          hidden: true,
        },
      },
    ],
  },
]

export default routes
