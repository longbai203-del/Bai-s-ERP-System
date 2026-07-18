/**
 * @module inventory/routes
 * @description Inventory 路由配置
 */

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/inventory',
    name: 'Inventory',
    component: () => import('./pages/InventoryList.vue'),
    meta: { title: 'Inventory管理', requiresAuth: true }
  },
  {
    path: '/inventory/create',
    name: 'InventoryCreate',
    component: () => import('./pages/InventoryCreate.vue'),
    meta: { title: '新建Inventory', requiresAuth: true }
  },
  {
    path: '/inventory/:id',
    name: 'InventoryDetail',
    component: () => import('./pages/InventoryDetail.vue'),
    meta: { title: 'Inventory详情', requiresAuth: true }
  },
  {
    path: '/inventory/:id/edit',
    name: 'InventoryEdit',
    component: () => import('./pages/InventoryEdit.vue'),
    meta: { title: '编辑Inventory', requiresAuth: true }
  }
]

export default routes
