import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/products',
    name: 'products',
    component: () => import('@/layouts/default/index.vue'),
    meta: {
      title: 'products管理',
      icon: 'folder',
    },
    children: [
      {
        path: '',
        name: 'productsIndex',
        component: () => import('../pages/Index.vue'),
        meta: {
          title: 'products列表',
          keepAlive: true,
        },
      },
      {
        path: 'create',
        name: 'productsCreate',
        component: () => import('../pages/Create.vue'),
        meta: {
          title: '创建products',
          hidden: true,
        },
      },
      {
        path: ':id/edit',
        name: 'productsEdit',
        component: () => import('../pages/Edit.vue'),
        meta: {
          title: '编辑products',
          hidden: true,
        },
      },
    ],
  },
]

export default routes
