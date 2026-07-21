// 文件路径: frontend/src/router/index.ts
// 功能: 主路由配置 - 注册所有模块路由

import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 导入所有模块路由
import dashboardRoutes from '@/modules/dashboard/routes'
import ordersRoutes from '@/modules/orders/routes'
import productsRoutes from '@/modules/products/routes'
import customersRoutes from '@/modules/customers/routes'
import posRoutes from '@/modules/pos/routes'
import marketingRoutes from '@/modules/marketing/routes'
import inventoryRoutes from '@/modules/inventory/routes'
import purchaseRoutes from '@/modules/purchase/routes'
import financeRoutes from '@/modules/finance/routes'
import hrRoutes from '@/modules/hr/routes'
import saasRoutes from '@/modules/saas/routes'
import systemRoutes from '@/modules/system/routes'
import analyticsRoutes from '@/modules/analytics/routes'
import reportsRoutes from '@/modules/reports/routes'
import aiRoutes from '@/modules/ai/routes'
import productionRoutes from '@/modules/production/routes'
import projectRoutes from '@/modules/project/routes'
import approvalRoutes from '@/modules/approval/routes'
import settingsRoutes from '@/modules/settings/routes'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard/overview',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录', hidden: true },
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '404', hidden: true },
  },
  // 注册所有模块路由
  ...dashboardRoutes,
  ...ordersRoutes,
  ...productsRoutes,
  ...customersRoutes,
  ...posRoutes,
  ...marketingRoutes,
  ...inventoryRoutes,
  ...purchaseRoutes,
  ...financeRoutes,
  ...hrRoutes,
  ...saasRoutes,
  ...systemRoutes,
  ...analyticsRoutes,
  ...reportsRoutes,
  ...aiRoutes,
  ...productionRoutes,
  ...projectRoutes,
  ...approvalRoutes,
  ...settingsRoutes,
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = \ - Bai's ERP
  }
  next()
})

export default router
