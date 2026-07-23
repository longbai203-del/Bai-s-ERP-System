import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/orders',
    name: 'orders',
    component: () => import('@/layouts/default/index.vue'),
    meta: {
      title: 'orders管理',
      icon: 'folder',
    },
    children: [
      {
        path: '',
        name: 'ordersIndex',
        component: () => import('../pages/Index.vue'),
        meta: {
          title: 'orders列表',
          keepAlive: true,
        },
      },
      {
        path: 'create',
        name: 'ordersCreate',
        component: () => import('../pages/Create.vue'),
        meta: {
          title: '创建orders',
          hidden: true,
        },
      },
      {
        path: ':id/edit',
        name: 'ordersEdit',
        component: () => import('../pages/Edit.vue'),
        meta: {
          title: '编辑orders',
          hidden: true,
        },
      },
    ],
  },
]

export default routes
