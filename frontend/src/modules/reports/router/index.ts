// reports 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const reportsRoutes: RouteRecordRaw[] = [
    {
        path: '',
        redirect: '/reports/'
    },
    {
        path: '/reports/',
        name: 'reportsCashFlowReport',
        component: () => import('../pages/CashFlowReport.vue'),
        meta: {
            title: 'CashFlowReport',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/reports/',
        name: 'reportsCreate',
        component: () => import('../pages/Create.vue'),
        meta: {
            title: 'Create',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/reports/',
        name: 'reportsCRMReport',
        component: () => import('../pages/CRMReport.vue'),
        meta: {
            title: 'CRMReport',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/reports/',
        name: 'reportsCustomReportBuilder',
        component: () => import('../pages/CustomReportBuilder.vue'),
        meta: {
            title: 'CustomReportBuilder',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/reports/',
        name: 'reportsDetail',
        component: () => import('../pages/Detail.vue'),
        meta: {
            title: 'Detail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/reports/',
        name: 'reportsEdit',
        component: () => import('../pages/Edit.vue'),
        meta: {
            title: 'Edit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/reports/',
        name: 'reportsExcelExport',
        component: () => import('../pages/ExcelExport.vue'),
        meta: {
            title: 'ExcelExport',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/reports/',
        name: 'reportsFinanceDashboard',
        component: () => import('../pages/FinanceDashboard.vue'),
        meta: {
            title: 'FinanceDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/reports/',
        name: 'reportsFinanceReport',
        component: () => import('../pages/FinanceReport.vue'),
        meta: {
            title: 'FinanceReport',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/reports/',
        name: 'reportsHRReport',
        component: () => import('../pages/HRReport.vue'),
        meta: {
            title: 'HRReport',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/reports/',
        name: 'reportsIndex',
        component: () => import('../pages/Index.vue'),
        meta: {
            title: 'Index',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/reports/',
        name: 'reportsInventoryDashboard',
        component: () => import('../pages/InventoryDashboard.vue'),
        meta: {
            title: 'InventoryDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/reports/',
        name: 'reportsInventoryReport',
        component: () => import('../pages/InventoryReport.vue'),
        meta: {
            title: 'InventoryReport',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/reports/',
        name: 'reportsOverview',
        component: () => import('../pages/Overview.vue'),
        meta: {
            title: 'Overview',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/reports/',
        name: 'reportsPDFExport',
        component: () => import('../pages/PDFExport.vue'),
        meta: {
            title: 'PDFExport',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/reports/',
        name: 'reportsPowerBIIntegration',
        component: () => import('../pages/PowerBIIntegration.vue'),
        meta: {
            title: 'PowerBIIntegration',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/reports/',
        name: 'reportsProfitReport',
        component: () => import('../pages/ProfitReport.vue'),
        meta: {
            title: 'ProfitReport',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/reports/',
        name: 'reportsPurchaseReport',
        component: () => import('../pages/PurchaseReport.vue'),
        meta: {
            title: 'PurchaseReport',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/reports/',
        name: 'reportsReportDashboard',
        component: () => import('../pages/ReportDashboard.vue'),
        meta: {
            title: 'ReportDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/reports/',
        name: 'reportsReportScheduler',
        component: () => import('../pages/ReportScheduler.vue'),
        meta: {
            title: 'ReportScheduler',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/reports/',
        name: 'reportsReportsCreate',
        component: () => import('../pages/ReportsCreate.vue'),
        meta: {
            title: 'ReportsCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/reports/',
        name: 'reportsReportsDetail',
        component: () => import('../pages/ReportsDetail.vue'),
        meta: {
            title: 'ReportsDetail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/reports/',
        name: 'reportsReportsEdit',
        component: () => import('../pages/ReportsEdit.vue'),
        meta: {
            title: 'ReportsEdit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/reports/',
        name: 'reportsReportsList',
        component: () => import('../pages/ReportsList.vue'),
        meta: {
            title: 'ReportsList',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/reports/',
        name: 'reportsReportTemplates',
        component: () => import('../pages/ReportTemplates.vue'),
        meta: {
            title: 'ReportTemplates',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/reports/',
        name: 'reportsSalesDashboard',
        component: () => import('../pages/SalesDashboard.vue'),
        meta: {
            title: 'SalesDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/reports/',
        name: 'reportsSalesReport',
        component: () => import('../pages/SalesReport.vue'),
        meta: {
            title: 'SalesReport',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/reports/',
        name: 'reportsSaudiVatReport',
        component: () => import('../pages/SaudiVatReport.vue'),
        meta: {
            title: 'SaudiVatReport',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/reports/',
        name: 'reportsSaudiZatcaReport',
        component: () => import('../pages/SaudiZatcaReport.vue'),
        meta: {
            title: 'SaudiZatcaReport',
            icon: 'Document',
            requiresAuth: true
        }
    }
]

export default reportsRoutes
