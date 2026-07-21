// 文件路径: frontend/src/modules/dashboard/routes.ts
// 功能: Dashboard模块路由配置

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'dashboard',
    name: 'Dashboard',
    component: () => import('@/layouts/DefaultLayout.vue'),
    redirect: '/dashboard/overview',
    children: [
      {
        path: 'overview',
        name: 'DashboardOverview',
        component: () => import('./pages/Overview.vue'),
        meta: { title: '总览仪表盘', icon: 'DataLine' },
      },
      {
        path: 'sales',
        name: 'DashboardSales',
        component: () => import('./pages/SalesDashboard.vue'),
        meta: { title: '销售仪表盘', icon: 'TrendCharts' },
      },
      {
        path: 'finance',
        name: 'DashboardFinance',
        component: () => import('./pages/FinanceDashboard.vue'),
        meta: { title: '财务仪表盘', icon: 'Money' },
      },
      {
        path: 'inventory',
        name: 'DashboardInventory',
        component: () => import('./pages/InventoryDashboard.vue'),
        meta: { title: '库存仪表盘', icon: 'Box' },
      },
      {
        path: 'purchase',
        name: 'DashboardPurchase',
        component: () => import('./pages/PurchaseDashboard.vue'),
        meta: { title: '采购仪表盘', icon: 'ShoppingCart' },
      },
      {
        path: 'executive',
        name: 'DashboardExecutive',
        component: () => import('./pages/ExecutiveDashboard.vue'),
        meta: { title: '老板驾驶舱', icon: 'Star' },
      },
      {
        path: 'performance',
        name: 'DashboardPerformance',
        component: () => import('./pages/PerformanceDashboard.vue'),
        meta: { title: '绩效仪表盘', icon: 'Trophy' },
      },
      {
        path: 'profit-analysis',
        name: 'DashboardProfitAnalysis',
        component: () => import('./pages/ProfitAnalysis.vue'),
        meta: { title: '利润分析', icon: 'Coin' },
      },
      {
        path: 'business-analysis',
        name: 'DashboardBusinessAnalysis',
        component: () => import('./pages/BusinessAnalysis.vue'),
        meta: { title: '经营分析', icon: 'DataAnalysis' },
      },
    ],
  },
]

export default routes