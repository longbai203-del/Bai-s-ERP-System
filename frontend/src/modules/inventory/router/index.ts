import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/inventory',
    name: 'inventory',
    component: () => import('@/layouts/default/index.vue'),
    meta: {
      title: 'inventory管理',
      icon: 'folder',
    },
    children: [
      {
        path: '',
        name: 'inventoryIndex',
        component: () => import('../pages/Index.vue'),
        meta: {
          title: 'inventory列表',
          keepAlive: true,
        },
      },
      {
        path: 'create',
        name: 'inventoryCreate',
        component: () => import('../pages/Create.vue'),
        meta: {
          title: '创建inventory',
          hidden: true,
        },
      },
      {
        path: ':id/edit',
        name: 'inventoryEdit',
        component: () => import('../pages/Edit.vue'),
        meta: {
          title: '编辑inventory',
          hidden: true,
        },
      },
    ],
  },
]

export default routes
