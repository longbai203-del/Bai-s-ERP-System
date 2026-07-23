// marketing 模块路由 (自动生成)
import type { RouteRecordRaw } from 'vue-router'

const marketingRoutes: RouteRecordRaw[] = [
  {
    path: '',
    redirect: '/marketing/'
  },
  {
    path: '/marketing/CampaignCreate',
    name: 'marketingCampaignCreate',
    component: () => import('../pages/CampaignCreate.vue'),
    meta: {
      title: 'CampaignCreate',
      requiresAuth: true
    }  },
  {
    path: '/marketing/CampaignDetail',
    name: 'marketingCampaignDetail',
    component: () => import('../pages/CampaignDetail.vue'),
    meta: {
      title: 'CampaignDetail',
      requiresAuth: true
    }  },
  {
    path: '/marketing/CampaignEdit',
    name: 'marketingCampaignEdit',
    component: () => import('../pages/CampaignEdit.vue'),
    meta: {
      title: 'CampaignEdit',
      requiresAuth: true
    }  },
  {
    path: '/marketing/Campaigns',
    name: 'marketingCampaigns',
    component: () => import('../pages/Campaigns.vue'),
    meta: {
      title: 'Campaigns',
      requiresAuth: true
    }  },
  {
    path: '/marketing/Create',
    name: 'marketingCreate',
    component: () => import('../pages/Create.vue'),
    meta: {
      title: 'Create',
      requiresAuth: true
    }  },
  {
    path: '/marketing/Detail',
    name: 'marketingDetail',
    component: () => import('../pages/Detail.vue'),
    meta: {
      title: 'Detail',
      requiresAuth: true
    }  },
  {
    path: '/marketing/Edit',
    name: 'marketingEdit',
    component: () => import('../pages/Edit.vue'),
    meta: {
      title: 'Edit',
      requiresAuth: true
    }  },
  {
    path: '/marketing/EmailMarketing',
    name: 'marketingEmailMarketing',
    component: () => import('../pages/EmailMarketing.vue'),
    meta: {
      title: 'EmailMarketing',
      requiresAuth: true
    }  },
  {
    path: '/marketing/EmailMarketingCreate',
    name: 'marketingEmailMarketingCreate',
    component: () => import('../pages/EmailMarketingCreate.vue'),
    meta: {
      title: 'EmailMarketingCreate',
      requiresAuth: true
    }  },
  {
    path: '/marketing/EmailMarketingDetail',
    name: 'marketingEmailMarketingDetail',
    component: () => import('../pages/EmailMarketingDetail.vue'),
    meta: {
      title: 'EmailMarketingDetail',
      requiresAuth: true
    }  },
  {
    path: '/marketing/FinanceDashboard',
    name: 'marketingFinanceDashboard',
    component: () => import('../pages/FinanceDashboard.vue'),
    meta: {
      title: 'FinanceDashboard',
      requiresAuth: true
    }  },
  {
    path: '/marketing/Index',
    name: 'marketingIndex',
    component: () => import('../pages/Index.vue'),
    meta: {
      title: 'Index',
      requiresAuth: true
    }  },
  {
    path: '/marketing/LeadGeneration',
    name: 'marketingLeadGeneration',
    component: () => import('../pages/LeadGeneration.vue'),
    meta: {
      title: 'LeadGeneration',
      requiresAuth: true
    }  },
  {
    path: '/marketing/LeadGenerationDetail',
    name: 'marketingLeadGenerationDetail',
    component: () => import('../pages/LeadGenerationDetail.vue'),
    meta: {
      title: 'LeadGenerationDetail',
      requiresAuth: true
    }  },
  {
    path: '/marketing/MarketingAnalytics',
    name: 'marketingMarketingAnalytics',
    component: () => import('../pages/MarketingAnalytics.vue'),
    meta: {
      title: 'MarketingAnalytics',
      requiresAuth: true
    }  },
  {
    path: '/marketing/MarketingAutomation',
    name: 'marketingMarketingAutomation',
    component: () => import('../pages/MarketingAutomation.vue'),
    meta: {
      title: 'MarketingAutomation',
      requiresAuth: true
    }  },
  {
    path: '/marketing/MarketingDashboard',
    name: 'marketingMarketingDashboard',
    component: () => import('../pages/MarketingDashboard.vue'),
    meta: {
      title: 'MarketingDashboard',
      requiresAuth: true
    }  },
  {
    path: '/marketing/SocialMedia',
    name: 'marketingSocialMedia',
    component: () => import('../pages/SocialMedia.vue'),
    meta: {
      title: 'SocialMedia',
      requiresAuth: true
    }  },
  {
    path: '/marketing/SocialMediaCreate',
    name: 'marketingSocialMediaCreate',
    component: () => import('../pages/SocialMediaCreate.vue'),
    meta: {
      title: 'SocialMediaCreate',
      requiresAuth: true
    }  },
  {
    path: '/marketing/SocialMediaDetail',
    name: 'marketingSocialMediaDetail',
    component: () => import('../pages/SocialMediaDetail.vue'),
    meta: {
      title: 'SocialMediaDetail',
      requiresAuth: true
    }  }
]

export default marketingRoutes

