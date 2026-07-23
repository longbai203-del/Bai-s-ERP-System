import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/purchase',
    name: 'purchase',
    component: () => import('@/layouts/default/index.vue'),
    meta: {
      title: 'purchase管理',
      icon: 'folder',
    },
    children: [
      {
        path: '',
        name: 'purchaseIndex',
        component: () => import('../pages/Index.vue'),
        meta: {
          title: 'purchase列表',
          keepAlive: true,
        },
      },
      {
        path: 'create',
        name: 'purchaseCreate',
        component: () => import('../pages/Create.vue'),
        meta: {
          title: '创建purchase',
          hidden: true,
        },
      },
      {
        path: ':id/edit',
        name: 'purchaseEdit',
        component: () => import('../pages/Edit.vue'),
        meta: {
          title: '编辑purchase',
          hidden: true,
        },
      },
    ],
  },
]

export default routes
