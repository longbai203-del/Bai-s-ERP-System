import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/production',
    name: 'production',
    component: () => import('@/layouts/default/index.vue'),
    meta: {
      title: 'production管理',
      icon: 'folder',
    },
    children: [
      {
        path: '',
        name: 'productionIndex',
        component: () => import('../pages/Index.vue'),
        meta: {
          title: 'production列表',
          keepAlive: true,
        },
      },
      {
        path: 'create',
        name: 'productionCreate',
        component: () => import('../pages/Create.vue'),
        meta: {
          title: '创建production',
          hidden: true,
        },
      },
      {
        path: ':id/edit',
        name: 'productionEdit',
        component: () => import('../pages/Edit.vue'),
        meta: {
          title: '编辑production',
          hidden: true,
        },
      },
    ],
  },
]

export default routes
