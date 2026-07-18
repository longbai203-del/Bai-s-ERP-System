/**
 * @module hr/routes
 * @description Hr 路由配置
 */

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/hr',
    name: 'Hr',
    component: () => import('./pages/HrList.vue'),
    meta: { title: 'Hr管理', requiresAuth: true }
  },
  {
    path: '/hr/create',
    name: 'HrCreate',
    component: () => import('./pages/HrCreate.vue'),
    meta: { title: '新建Hr', requiresAuth: true }
  },
  {
    path: '/hr/:id',
    name: 'HrDetail',
    component: () => import('./pages/HrDetail.vue'),
    meta: { title: 'Hr详情', requiresAuth: true }
  },
  {
    path: '/hr/:id/edit',
    name: 'HrEdit',
    component: () => import('./pages/HrEdit.vue'),
    meta: { title: '编辑Hr', requiresAuth: true }
  }
]

export default routes
