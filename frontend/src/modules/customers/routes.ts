// 文件路径: frontend/src/modules/customers/routes.ts
// 功能: Customers模块路由配置

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'customers',
    name: 'Customers',
    component: () => import('@/layouts/DefaultLayout.vue'),
    redirect: '/customers/list',
    children: [
      // 客户画像
      { path: 'profile/:id', name: 'CustomerProfile', component: () => import('./pages/CustomerProfile.vue'), meta: { title: '客户画像', hidden: true } },
      
      // 客户跟进
      { path: 'followup', name: 'CustomerFollowup', component: () => import('./pages/CustomerFollowup.vue'), meta: { title: '客户跟进', icon: 'ChatDotRound' } },
      { path: 'followup/create', name: 'CustomerFollowupCreate', component: () => import('./pages/CustomerFollowupCreate.vue'), meta: { title: '新建跟进', hidden: true } },
      
      // 客户标签
      { path: 'tags', name: 'CustomerTags', component: () => import('./pages/CustomerTags.vue'), meta: { title: '客户标签', icon: 'Collection' } },
      
      // 客户等级
      { path: 'level', name: 'CustomerLevel', component: () => import('./pages/CustomerLevel.vue'), meta: { title: '客户等级', icon: 'Medal' } },
      
      // 客户来源
      { path: 'source', name: 'CustomerSource', component: () => import('./pages/CustomerSource.vue'), meta: { title: '客户来源', icon: 'DataLine' } },
      
      // 客户生命周期
      { path: 'lifecycle', name: 'CustomerLifecycle', component: () => import('./pages/CustomerLifecycle.vue'), meta: { title: '客户生命周期', icon: 'TrendCharts' } },
      
      // 客户分析
      { path: 'analysis', name: 'CustomerAnalysis', component: () => import('./pages/CustomerAnalysis.vue'), meta: { title: '客户分析', icon: 'DataAnalysis' } },
      
      // 客户地图
      { path: 'map', name: 'CustomerMap', component: () => import('./pages/CustomerMap.vue'), meta: { title: '客户地图', icon: 'Location' } },
      
      // 商机管理
      { path: 'opportunities', name: 'Opportunities', component: () => import('./pages/Opportunities.vue'), meta: { title: '商机管理', icon: 'TrendCharts' } },
      { path: 'opportunities/create', name: 'OpportunityCreate', component: () => import('./pages/OpportunityCreate.vue'), meta: { title: '新建商机', hidden: true } },
      
      // 销售漏斗
      { path: 'funnel', name: 'SalesFunnel', component: () => import('./pages/SalesFunnel.vue'), meta: { title: '销售漏斗', icon: 'Funnel' } },
      
      // 售后管理
      { path: 'after-sale', name: 'CustomerAfterSale', component: () => import('./pages/CustomerAfterSale.vue'), meta: { title: '售后管理', icon: 'Service' } },
    ],
  },
]

export default routes