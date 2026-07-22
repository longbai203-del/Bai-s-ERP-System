// approval 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const approvalRoutes: RouteRecordRaw[] = [
    {
        path: '',
        redirect: '/approval/'
    },
    {
        path: '/approval/',
        name: 'approvalApprovalCreate',
        component: () => import('../pages/ApprovalCreate.vue'),
        meta: {
            title: 'ApprovalCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/approval/',
        name: 'approvalApprovalDashboard',
        component: () => import('../pages/ApprovalDashboard.vue'),
        meta: {
            title: 'ApprovalDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/approval/',
        name: 'approvalApprovalDetail',
        component: () => import('../pages/ApprovalDetail.vue'),
        meta: {
            title: 'ApprovalDetail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/approval/',
        name: 'approvalapprovalEdit',
        component: () => import('../pages/approvalEdit.vue'),
        meta: {
            title: 'approvalEdit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/approval/',
        name: 'approvalapprovalList',
        component: () => import('../pages/approvalList.vue'),
        meta: {
            title: 'approvalList',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/approval/',
        name: 'approvalApprovalSettings',
        component: () => import('../pages/ApprovalSettings.vue'),
        meta: {
            title: 'ApprovalSettings',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/approval/',
        name: 'approvalApprovalTemplateCreate',
        component: () => import('../pages/ApprovalTemplateCreate.vue'),
        meta: {
            title: 'ApprovalTemplateCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/approval/',
        name: 'approvalApprovalTemplates',
        component: () => import('../pages/ApprovalTemplates.vue'),
        meta: {
            title: 'ApprovalTemplates',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/approval/',
        name: 'approvalContractApproval',
        component: () => import('../pages/ContractApproval.vue'),
        meta: {
            title: 'ContractApproval',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/approval/',
        name: 'approvalCreate',
        component: () => import('../pages/Create.vue'),
        meta: {
            title: 'Create',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/approval/',
        name: 'approvalDetail',
        component: () => import('../pages/Detail.vue'),
        meta: {
            title: 'Detail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/approval/',
        name: 'approvalEdit',
        component: () => import('../pages/Edit.vue'),
        meta: {
            title: 'Edit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/approval/',
        name: 'approvalExpenseApproval',
        component: () => import('../pages/ExpenseApproval.vue'),
        meta: {
            title: 'ExpenseApproval',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/approval/',
        name: 'approvalFinanceDashboard',
        component: () => import('../pages/FinanceDashboard.vue'),
        meta: {
            title: 'FinanceDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/approval/',
        name: 'approvalIndex',
        component: () => import('../pages/Index.vue'),
        meta: {
            title: 'Index',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/approval/',
        name: 'approvalInventoryDashboard',
        component: () => import('../pages/InventoryDashboard.vue'),
        meta: {
            title: 'InventoryDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/approval/',
        name: 'approvalLeaveApproval',
        component: () => import('../pages/LeaveApproval.vue'),
        meta: {
            title: 'LeaveApproval',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/approval/',
        name: 'approvalMyApprovals',
        component: () => import('../pages/MyApprovals.vue'),
        meta: {
            title: 'MyApprovals',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/approval/',
        name: 'approvalOverview',
        component: () => import('../pages/Overview.vue'),
        meta: {
            title: 'Overview',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/approval/',
        name: 'approvalPaymentApproval',
        component: () => import('../pages/PaymentApproval.vue'),
        meta: {
            title: 'PaymentApproval',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/approval/',
        name: 'approvalPurchaseApproval',
        component: () => import('../pages/PurchaseApproval.vue'),
        meta: {
            title: 'PurchaseApproval',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/approval/',
        name: 'approvalReportDashboard',
        component: () => import('../pages/ReportDashboard.vue'),
        meta: {
            title: 'ReportDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/approval/',
        name: 'approvalSalesDashboard',
        component: () => import('../pages/SalesDashboard.vue'),
        meta: {
            title: 'SalesDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/approval/',
        name: 'approvalVehicleApproval',
        component: () => import('../pages/VehicleApproval.vue'),
        meta: {
            title: 'VehicleApproval',
            icon: 'Document',
            requiresAuth: true
        }
    }
]

export default approvalRoutes
