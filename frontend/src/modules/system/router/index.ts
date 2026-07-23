import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/system',
    name: 'system',
    component: () => import('@/layouts/default/index.vue'),
    meta: {
      title: 'system管理',
      icon: 'folder',
    },
    children: [
      {
        path: '',
        name: 'systemIndex',
        component: () => import('../pages/Index.vue'),
        meta: {
          title: 'system列表',
          keepAlive: true,
        },
      },
      {
        path: 'create',
        name: 'systemCreate',
        component: () => import('../pages/Create.vue'),
        meta: {
          title: '创建system',
          hidden: true,
        },
      },
      {
        path: ':id/edit',
        name: 'systemEdit',
        component: () => import('../pages/Edit.vue'),
        meta: {
          title: '编辑system',
          hidden: true,
        },
      },
    ],
  },
]

export default routes
