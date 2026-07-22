// purchase 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const purchaseRoutes: RouteRecordRaw[] = [
    {
        path: '',
        redirect: '/purchase/'
    },
    {
        path: '/purchase/',
        name: 'purchaseCreate',
        component: () => import('../pages/Create.vue'),
        meta: {
            title: 'Create',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/purchase/',
        name: 'purchaseDetail',
        component: () => import('../pages/Detail.vue'),
        meta: {
            title: 'Detail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/purchase/',
        name: 'purchaseEdit',
        component: () => import('../pages/Edit.vue'),
        meta: {
            title: 'Edit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/purchase/',
        name: 'purchaseFinanceDashboard',
        component: () => import('../pages/FinanceDashboard.vue'),
        meta: {
            title: 'FinanceDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/purchase/',
        name: 'purchaseIndex',
        component: () => import('../pages/Index.vue'),
        meta: {
            title: 'Index',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/purchase/',
        name: 'purchaseInventoryDashboard',
        component: () => import('../pages/InventoryDashboard.vue'),
        meta: {
            title: 'InventoryDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/purchase/',
        name: 'purchaseOverview',
        component: () => import('../pages/Overview.vue'),
        meta: {
            title: 'Overview',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/purchase/',
        name: 'purchasePaymentRequest',
        component: () => import('../pages/PaymentRequest.vue'),
        meta: {
            title: 'PaymentRequest',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/purchase/',
        name: 'purchasePurchaseAnalysis',
        component: () => import('../pages/PurchaseAnalysis.vue'),
        meta: {
            title: 'PurchaseAnalysis',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/purchase/',
        name: 'purchasePurchaseApproval',
        component: () => import('../pages/PurchaseApproval.vue'),
        meta: {
            title: 'PurchaseApproval',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/purchase/',
        name: 'purchasePurchaseBudget',
        component: () => import('../pages/PurchaseBudget.vue'),
        meta: {
            title: 'PurchaseBudget',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/purchase/',
        name: 'purchasePurchaseComparison',
        component: () => import('../pages/PurchaseComparison.vue'),
        meta: {
            title: 'PurchaseComparison',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/purchase/',
        name: 'purchasePurchaseContractCreate',
        component: () => import('../pages/PurchaseContractCreate.vue'),
        meta: {
            title: 'PurchaseContractCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/purchase/',
        name: 'purchasePurchaseContractDetail',
        component: () => import('../pages/PurchaseContractDetail.vue'),
        meta: {
            title: 'PurchaseContractDetail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/purchase/',
        name: 'purchasePurchaseContracts',
        component: () => import('../pages/PurchaseContracts.vue'),
        meta: {
            title: 'PurchaseContracts',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/purchase/',
        name: 'purchasePurchaseCreate',
        component: () => import('../pages/PurchaseCreate.vue'),
        meta: {
            title: 'PurchaseCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/purchase/',
        name: 'purchasePurchaseDetail',
        component: () => import('../pages/PurchaseDetail.vue'),
        meta: {
            title: 'PurchaseDetail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/purchase/',
        name: 'purchasePurchaseEdit',
        component: () => import('../pages/PurchaseEdit.vue'),
        meta: {
            title: 'PurchaseEdit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/purchase/',
        name: 'purchasePurchaseInquiry',
        component: () => import('../pages/PurchaseInquiry.vue'),
        meta: {
            title: 'PurchaseInquiry',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/purchase/',
        name: 'purchasePurchaseList',
        component: () => import('../pages/PurchaseList.vue'),
        meta: {
            title: 'PurchaseList',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/purchase/',
        name: 'purchasePurchasePerformance',
        component: () => import('../pages/PurchasePerformance.vue'),
        meta: {
            title: 'PurchasePerformance',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/purchase/',
        name: 'purchasePurchasePlan',
        component: () => import('../pages/PurchasePlan.vue'),
        meta: {
            title: 'PurchasePlan',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/purchase/',
        name: 'purchasePurchaseReceipt',
        component: () => import('../pages/PurchaseReceipt.vue'),
        meta: {
            title: 'PurchaseReceipt',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/purchase/',
        name: 'purchasePurchaseRequest',
        component: () => import('../pages/PurchaseRequest.vue'),
        meta: {
            title: 'PurchaseRequest',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/purchase/',
        name: 'purchasePurchaseRequestCreate',
        component: () => import('../pages/PurchaseRequestCreate.vue'),
        meta: {
            title: 'PurchaseRequestCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/purchase/',
        name: 'purchasePurchaseReturns',
        component: () => import('../pages/PurchaseReturns.vue'),
        meta: {
            title: 'PurchaseReturns',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/purchase/',
        name: 'purchaseReportDashboard',
        component: () => import('../pages/ReportDashboard.vue'),
        meta: {
            title: 'ReportDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/purchase/',
        name: 'purchaseSalesDashboard',
        component: () => import('../pages/SalesDashboard.vue'),
        meta: {
            title: 'SalesDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/purchase/',
        name: 'purchaseSupplierCredit',
        component: () => import('../pages/SupplierCredit.vue'),
        meta: {
            title: 'SupplierCredit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/purchase/',
        name: 'purchaseSupplierQuotation',
        component: () => import('../pages/SupplierQuotation.vue'),
        meta: {
            title: 'SupplierQuotation',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/purchase/',
        name: 'purchaseSupplierRating',
        component: () => import('../pages/SupplierRating.vue'),
        meta: {
            title: 'SupplierRating',
            icon: 'Document',
            requiresAuth: true
        }
    }
]

export default purchaseRoutes
