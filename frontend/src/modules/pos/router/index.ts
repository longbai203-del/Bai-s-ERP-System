import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/pos',
    name: 'pos',
    component: () => import('@/layouts/default/index.vue'),
    meta: {
      title: 'pos管理',
      icon: 'folder',
    },
    children: [
      {
        path: '',
        name: 'posIndex',
        component: () => import('../pages/Index.vue'),
        meta: {
          title: 'pos列表',
          keepAlive: true,
        },
      },
      {
        path: 'create',
        name: 'posCreate',
        component: () => import('../pages/Create.vue'),
        meta: {
          title: '创建pos',
          hidden: true,
        },
      },
      {
        path: ':id/edit',
        name: 'posEdit',
        component: () => import('../pages/Edit.vue'),
        meta: {
          title: '编辑pos',
          hidden: true,
        },
      },
    ],
  },
]

export default routes
