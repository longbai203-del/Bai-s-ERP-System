/**
 * @module finance/routes
 * @description Finance 路由配置
 */

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/finance',
    name: 'Finance',
    component: () => import('./pages/FinanceList.vue'),
    meta: { title: 'Finance管理', requiresAuth: true }
  },
  {
    path: '/finance/create',
    name: 'FinanceCreate',
    component: () => import('./pages/FinanceCreate.vue'),
    meta: { title: '新建Finance', requiresAuth: true }
  },
  {
    path: '/finance/:id',
    name: 'FinanceDetail',
    component: () => import('./pages/FinanceDetail.vue'),
    meta: { title: 'Finance详情', requiresAuth: true }
  },
  {
    path: '/finance/:id/edit',
    name: 'FinanceEdit',
    component: () => import('./pages/FinanceEdit.vue'),
    meta: { title: '编辑Finance', requiresAuth: true }
  }
]

export default routes
