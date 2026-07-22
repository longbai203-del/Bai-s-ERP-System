// ai 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const aiRoutes: RouteRecordRaw[] = [
    {
        path: '',
        redirect: '/ai/'
    },
    {
        path: '/ai/',
        name: 'aiAIChat',
        component: () => import('../pages/AIChat.vue'),
        meta: {
            title: 'AIChat',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/ai/',
        name: 'aiAIContract',
        component: () => import('../pages/AIContract.vue'),
        meta: {
            title: 'AIContract',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/ai/',
        name: 'aiAiCreate',
        component: () => import('../pages/AiCreate.vue'),
        meta: {
            title: 'AiCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/ai/',
        name: 'aiAICustomerService',
        component: () => import('../pages/AICustomerService.vue'),
        meta: {
            title: 'AICustomerService',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/ai/',
        name: 'aiAIDashboard',
        component: () => import('../pages/AIDashboard.vue'),
        meta: {
            title: 'AIDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/ai/',
        name: 'aiAiDetail',
        component: () => import('../pages/AiDetail.vue'),
        meta: {
            title: 'AiDetail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/ai/',
        name: 'aiAiEdit',
        component: () => import('../pages/AiEdit.vue'),
        meta: {
            title: 'AiEdit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/ai/',
        name: 'aiAIInvoice',
        component: () => import('../pages/AIInvoice.vue'),
        meta: {
            title: 'AIInvoice',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/ai/',
        name: 'aiAiList',
        component: () => import('../pages/AiList.vue'),
        meta: {
            title: 'AiList',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/ai/',
        name: 'aiAIOCR',
        component: () => import('../pages/AIOCR.vue'),
        meta: {
            title: 'AIOCR',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/ai/',
        name: 'aiAIQA',
        component: () => import('../pages/AIQA.vue'),
        meta: {
            title: 'AIQA',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/ai/',
        name: 'aiAIReport',
        component: () => import('../pages/AIReport.vue'),
        meta: {
            title: 'AIReport',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/ai/',
        name: 'aiCreate',
        component: () => import('../pages/Create.vue'),
        meta: {
            title: 'Create',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/ai/',
        name: 'aiDetail',
        component: () => import('../pages/Detail.vue'),
        meta: {
            title: 'Detail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/ai/',
        name: 'aiEdit',
        component: () => import('../pages/Edit.vue'),
        meta: {
            title: 'Edit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/ai/',
        name: 'aiFinanceDashboard',
        component: () => import('../pages/FinanceDashboard.vue'),
        meta: {
            title: 'FinanceDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/ai/',
        name: 'aiGeneratePurchaseOrder',
        component: () => import('../pages/GeneratePurchaseOrder.vue'),
        meta: {
            title: 'GeneratePurchaseOrder',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/ai/',
        name: 'aiGenerateQuotation',
        component: () => import('../pages/GenerateQuotation.vue'),
        meta: {
            title: 'GenerateQuotation',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/ai/',
        name: 'aiIndex',
        component: () => import('../pages/Index.vue'),
        meta: {
            title: 'Index',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/ai/',
        name: 'aiInventoryDashboard',
        component: () => import('../pages/InventoryDashboard.vue'),
        meta: {
            title: 'InventoryDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/ai/',
        name: 'aiInventoryPrediction',
        component: () => import('../pages/InventoryPrediction.vue'),
        meta: {
            title: 'InventoryPrediction',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/ai/',
        name: 'aiOverview',
        component: () => import('../pages/Overview.vue'),
        meta: {
            title: 'Overview',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/ai/',
        name: 'aiProfitAnalysis',
        component: () => import('../pages/ProfitAnalysis.vue'),
        meta: {
            title: 'ProfitAnalysis',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/ai/',
        name: 'aiPurchaseSuggestion',
        component: () => import('../pages/PurchaseSuggestion.vue'),
        meta: {
            title: 'PurchaseSuggestion',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/ai/',
        name: 'aiReportDashboard',
        component: () => import('../pages/ReportDashboard.vue'),
        meta: {
            title: 'ReportDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/ai/',
        name: 'aiSalesDashboard',
        component: () => import('../pages/SalesDashboard.vue'),
        meta: {
            title: 'SalesDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/ai/',
        name: 'aiSalesPrediction',
        component: () => import('../pages/SalesPrediction.vue'),
        meta: {
            title: 'SalesPrediction',
            icon: 'Document',
            requiresAuth: true
        }
    }
]

export default aiRoutes
