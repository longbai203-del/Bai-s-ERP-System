// 文件路径: frontend/src/modules/marketing/routes.ts
// 功能: Marketing模块路由配置

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'marketing',
    name: 'Marketing',
    component: () => import('@/layouts/DefaultLayout.vue'),
    redirect: '/marketing/dashboard',
    children: [
      // 营销中心
      { path: 'dashboard', name: 'MarketingDashboard', component: () => import('./pages/MarketingDashboard.vue'), meta: { title: '营销中心', icon: 'DataLine' } },
      
      // 营销活动
      { path: 'campaigns', name: 'Campaigns', component: () => import('./pages/Campaigns.vue'), meta: { title: '营销活动', icon: 'Promotion' } },
      { path: 'campaigns/create', name: 'CampaignCreate', component: () => import('./pages/CampaignCreate.vue'), meta: { title: '创建活动', hidden: true } },
      { path: 'campaigns/detail/:id', name: 'CampaignDetail', component: () => import('./pages/CampaignDetail.vue'), meta: { title: '活动详情', hidden: true } },
      { path: 'campaigns/edit/:id', name: 'CampaignEdit', component: () => import('./pages/CampaignEdit.vue'), meta: { title: '编辑活动', hidden: true } },
      
      // 邮件营销
      { path: 'email', name: 'EmailMarketing', component: () => import('./pages/EmailMarketing.vue'), meta: { title: '邮件营销', icon: 'Message' } },
      { path: 'email/create', name: 'EmailMarketingCreate', component: () => import('./pages/EmailMarketingCreate.vue'), meta: { title: '新建邮件', hidden: true } },
      { path: 'email/detail/:id', name: 'EmailMarketingDetail', component: () => import('./pages/EmailMarketingDetail.vue'), meta: { title: '邮件详情', hidden: true } },
      
      // 社交媒体
      { path: 'social', name: 'SocialMedia', component: () => import('./pages/SocialMedia.vue'), meta: { title: '社交媒体', icon: 'Share' } },
      { path: 'social/create', name: 'SocialMediaCreate', component: () => import('./pages/SocialMediaCreate.vue'), meta: { title: '创建内容', hidden: true } },
      { path: 'social/detail/:id', name: 'SocialMediaDetail', component: () => import('./pages/SocialMediaDetail.vue'), meta: { title: '内容详情', hidden: true } },
      
      // 线索生成
      { path: 'leads', name: 'LeadGeneration', component: () => import('./pages/LeadGeneration.vue'), meta: { title: '线索生成', icon: 'User' } },
      { path: 'leads/detail/:id', name: 'LeadGenerationDetail', component: () => import('./pages/LeadGenerationDetail.vue'), meta: { title: '线索详情', hidden: true } },
      
      // 营销分析与自动化
      { path: 'analytics', name: 'MarketingAnalytics', component: () => import('./pages/MarketingAnalytics.vue'), meta: { title: '营销分析', icon: 'DataAnalysis' } },
      { path: 'automation', name: 'MarketingAutomation', component: () => import('./pages/MarketingAutomation.vue'), meta: { title: '营销自动化', icon: 'Setting' } },
    ],
  },
]

export default routes
