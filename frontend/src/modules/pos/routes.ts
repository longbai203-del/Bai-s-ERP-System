/**
 * @module pos/routes
 * @description Pos 路由配置
 */

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/pos',
    name: 'Pos',
    component: () => import('./pages/PosList.vue'),
    meta: { title: 'Pos管理', requiresAuth: true }
  },
  {
    path: '/pos/create',
    name: 'PosCreate',
    component: () => import('./pages/PosCreate.vue'),
    meta: { title: '新建Pos', requiresAuth: true }
  },
  {
    path: '/pos/:id',
    name: 'PosDetail',
    component: () => import('./pages/PosDetail.vue'),
    meta: { title: 'Pos详情', requiresAuth: true }
  },
  {
    path: '/pos/:id/edit',
    name: 'PosEdit',
    component: () => import('./pages/PosEdit.vue'),
    meta: { title: '编辑Pos', requiresAuth: true }
  }
]

export default routes
