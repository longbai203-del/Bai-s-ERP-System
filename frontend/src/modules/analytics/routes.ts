// 文件路径: frontend/src/modules/analytics/routes.ts
// 功能: Analytics模块路由配置

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'analytics',
    name: 'Analytics',
    component: () => import('@/layouts/DefaultLayout.vue'),
    redirect: '/analytics/dashboard',
    children: [
      // 分析中心
      { path: 'dashboard', name: 'AnalyticsDashboard', component: () => import('./pages/AnalyticsDashboard.vue'), meta: { title: '分析中心', icon: 'DataLine' } },
      
      // 销售分析
      { path: 'sales', name: 'SalesAnalytics', component: () => import('./pages/SalesAnalytics.vue'), meta: { title: '销售分析', icon: 'TrendCharts' } },
      { path: 'sales/detail', name: 'SalesAnalyticsDetail', component: () => import('./pages/SalesAnalyticsDetail.vue'), meta: { title: '销售分析详情', hidden: true } },
      
      // 客户分析
      { path: 'customer', name: 'CustomerAnalytics', component: () => import('./pages/CustomerAnalytics.vue'), meta: { title: '客户分析', icon: 'User' } },
      { path: 'customer/detail', name: 'CustomerAnalyticsDetail', component: () => import('./pages/CustomerAnalyticsDetail.vue'), meta: { title: '客户分析详情', hidden: true } },
      
      // 产品分析
      { path: 'product', name: 'ProductAnalytics', component: () => import('./pages/ProductAnalytics.vue'), meta: { title: '产品分析', icon: 'Box' } },
      { path: 'product/detail', name: 'ProductAnalyticsDetail', component: () => import('./pages/ProductAnalyticsDetail.vue'), meta: { title: '产品分析详情', hidden: true } },
      
      // 渠道分析
      { path: 'channel', name: 'ChannelAnalytics', component: () => import('./pages/ChannelAnalytics.vue'), meta: { title: '渠道分析', icon: 'DataLine' } },
      { path: 'channel/detail', name: 'ChannelAnalyticsDetail', component: () => import('./pages/ChannelAnalyticsDetail.vue'), meta: { title: '渠道分析详情', hidden: true } },
      
      // 趋势分析
      { path: 'trend', name: 'TrendAnalysis', component: () => import('./pages/TrendAnalysis.vue'), meta: { title: '趋势分析', icon: 'TrendCharts' } },
      { path: 'trend/detail', name: 'TrendAnalysisDetail', component: () => import('./pages/TrendAnalysisDetail.vue'), meta: { title: '趋势分析详情', hidden: true } },
      
      // 对比分析
      { path: 'comparison', name: 'ComparisonAnalysis', component: () => import('./pages/ComparisonAnalysis.vue'), meta: { title: '对比分析', icon: 'DataAnalysis' } },
      { path: 'comparison/detail', name: 'ComparisonAnalysisDetail', component: () => import('./pages/ComparisonAnalysisDetail.vue'), meta: { title: '对比分析详情', hidden: true } },
    ],
  },
]

export default routes
