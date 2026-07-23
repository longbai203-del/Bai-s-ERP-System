import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/hr',
    name: 'hr',
    component: () => import('@/layouts/default/index.vue'),
    meta: {
      title: 'hr管理',
      icon: 'folder',
    },
    children: [
      {
        path: '',
        name: 'hrIndex',
        component: () => import('../pages/Index.vue'),
        meta: {
          title: 'hr列表',
          keepAlive: true,
        },
      },
      {
        path: 'create',
        name: 'hrCreate',
        component: () => import('../pages/Create.vue'),
        meta: {
          title: '创建hr',
          hidden: true,
        },
      },
      {
        path: ':id/edit',
        name: 'hrEdit',
        component: () => import('../pages/Edit.vue'),
        meta: {
          title: '编辑hr',
          hidden: true,
        },
      },
    ],
  },
]

export default routes
