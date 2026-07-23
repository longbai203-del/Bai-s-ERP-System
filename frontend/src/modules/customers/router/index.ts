import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/customers',
    name: 'customers',
    component: () => import('@/layouts/default/index.vue'),
    meta: {
      title: 'customers管理',
      icon: 'folder',
    },
    children: [
      {
        path: '',
        name: 'customersIndex',
        component: () => import('../pages/Index.vue'),
        meta: {
          title: 'customers列表',
          keepAlive: true,
        },
      },
      {
        path: 'create',
        name: 'customersCreate',
        component: () => import('../pages/Create.vue'),
        meta: {
          title: '创建customers',
          hidden: true,
        },
      },
      {
        path: ':id/edit',
        name: 'customersEdit',
        component: () => import('../pages/Edit.vue'),
        meta: {
          title: '编辑customers',
          hidden: true,
        },
      },
    ],
  },
]

export default routes
