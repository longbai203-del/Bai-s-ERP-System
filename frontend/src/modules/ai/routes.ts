/**
 * @module ai/routes
 * @description Ai 路由配置
 */

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/ai',
    name: 'Ai',
    component: () => import('./pages/AiList.vue'),
    meta: { title: 'Ai管理', requiresAuth: true }
  },
  {
    path: '/ai/create',
    name: 'AiCreate',
    component: () => import('./pages/AiCreate.vue'),
    meta: { title: '新建Ai', requiresAuth: true }
  },
  {
    path: '/ai/:id',
    name: 'AiDetail',
    component: () => import('./pages/AiDetail.vue'),
    meta: { title: 'Ai详情', requiresAuth: true }
  },
  {
    path: '/ai/:id/edit',
    name: 'AiEdit',
    component: () => import('./pages/AiEdit.vue'),
    meta: { title: '编辑Ai', requiresAuth: true }
  }
]

export default routes
