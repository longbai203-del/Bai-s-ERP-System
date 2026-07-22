// marketing 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const marketingRoutes: RouteRecordRaw[] = [
    {
        path: '',
        redirect: '/marketing/'
    },
    {
        path: '/marketing/',
        name: 'marketingCampaignCreate',
        component: () => import('../pages/CampaignCreate.vue'),
        meta: {
            title: 'CampaignCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/marketing/',
        name: 'marketingCampaignDetail',
        component: () => import('../pages/CampaignDetail.vue'),
        meta: {
            title: 'CampaignDetail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/marketing/',
        name: 'marketingCampaignEdit',
        component: () => import('../pages/CampaignEdit.vue'),
        meta: {
            title: 'CampaignEdit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/marketing/',
        name: 'marketingCampaigns',
        component: () => import('../pages/Campaigns.vue'),
        meta: {
            title: 'Campaigns',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/marketing/',
        name: 'marketingCreate',
        component: () => import('../pages/Create.vue'),
        meta: {
            title: 'Create',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/marketing/',
        name: 'marketingDetail',
        component: () => import('../pages/Detail.vue'),
        meta: {
            title: 'Detail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/marketing/',
        name: 'marketingEdit',
        component: () => import('../pages/Edit.vue'),
        meta: {
            title: 'Edit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/marketing/',
        name: 'marketingEmailMarketing',
        component: () => import('../pages/EmailMarketing.vue'),
        meta: {
            title: 'EmailMarketing',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/marketing/',
        name: 'marketingEmailMarketingCreate',
        component: () => import('../pages/EmailMarketingCreate.vue'),
        meta: {
            title: 'EmailMarketingCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/marketing/',
        name: 'marketingEmailMarketingDetail',
        component: () => import('../pages/EmailMarketingDetail.vue'),
        meta: {
            title: 'EmailMarketingDetail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/marketing/',
        name: 'marketingFinanceDashboard',
        component: () => import('../pages/FinanceDashboard.vue'),
        meta: {
            title: 'FinanceDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/marketing/',
        name: 'marketingIndex',
        component: () => import('../pages/Index.vue'),
        meta: {
            title: 'Index',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/marketing/',
        name: 'marketingInventoryDashboard',
        component: () => import('../pages/InventoryDashboard.vue'),
        meta: {
            title: 'InventoryDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/marketing/',
        name: 'marketingLeadGeneration',
        component: () => import('../pages/LeadGeneration.vue'),
        meta: {
            title: 'LeadGeneration',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/marketing/',
        name: 'marketingLeadGenerationDetail',
        component: () => import('../pages/LeadGenerationDetail.vue'),
        meta: {
            title: 'LeadGenerationDetail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/marketing/',
        name: 'marketingMarketingAnalytics',
        component: () => import('../pages/MarketingAnalytics.vue'),
        meta: {
            title: 'MarketingAnalytics',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/marketing/',
        name: 'marketingMarketingAutomation',
        component: () => import('../pages/MarketingAutomation.vue'),
        meta: {
            title: 'MarketingAutomation',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/marketing/',
        name: 'marketingMarketingCreate',
        component: () => import('../pages/MarketingCreate.vue'),
        meta: {
            title: 'MarketingCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/marketing/',
        name: 'marketingMarketingDashboard',
        component: () => import('../pages/MarketingDashboard.vue'),
        meta: {
            title: 'MarketingDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/marketing/',
        name: 'marketingMarketingDetail',
        component: () => import('../pages/MarketingDetail.vue'),
        meta: {
            title: 'MarketingDetail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/marketing/',
        name: 'marketingMarketingEdit',
        component: () => import('../pages/MarketingEdit.vue'),
        meta: {
            title: 'MarketingEdit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/marketing/',
        name: 'marketingMarketingList',
        component: () => import('../pages/MarketingList.vue'),
        meta: {
            title: 'MarketingList',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/marketing/',
        name: 'marketingOverview',
        component: () => import('../pages/Overview.vue'),
        meta: {
            title: 'Overview',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/marketing/',
        name: 'marketingReportDashboard',
        component: () => import('../pages/ReportDashboard.vue'),
        meta: {
            title: 'ReportDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/marketing/',
        name: 'marketingSalesDashboard',
        component: () => import('../pages/SalesDashboard.vue'),
        meta: {
            title: 'SalesDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/marketing/',
        name: 'marketingSocialMedia',
        component: () => import('../pages/SocialMedia.vue'),
        meta: {
            title: 'SocialMedia',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/marketing/',
        name: 'marketingSocialMediaCreate',
        component: () => import('../pages/SocialMediaCreate.vue'),
        meta: {
            title: 'SocialMediaCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/marketing/',
        name: 'marketingSocialMediaDetail',
        component: () => import('../pages/SocialMediaDetail.vue'),
        meta: {
            title: 'SocialMediaDetail',
            icon: 'Document',
            requiresAuth: true
        }
    }
]

export default marketingRoutes
