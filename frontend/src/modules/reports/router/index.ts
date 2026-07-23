// reports 模块路由 (自动生成)
import type { RouteRecordRaw } from 'vue-router'

const reportsRoutes: RouteRecordRaw[] = [
  {
    path: '',
    redirect: '/reports/'
  },
  {
    path: '/reports/CashFlowReport',
    name: 'reportsCashFlowReport',
    component: () => import('../pages/CashFlowReport.vue'),
    meta: {
      title: 'CashFlowReport',
      requiresAuth: true
    }  },
  {
    path: '/reports/Create',
    name: 'reportsCreate',
    component: () => import('../pages/Create.vue'),
    meta: {
      title: 'Create',
      requiresAuth: true
    }  },
  {
    path: '/reports/CRMReport',
    name: 'reportsCRMReport',
    component: () => import('../pages/CRMReport.vue'),
    meta: {
      title: 'CRMReport',
      requiresAuth: true
    }  },
  {
    path: '/reports/CustomReportBuilder',
    name: 'reportsCustomReportBuilder',
    component: () => import('../pages/CustomReportBuilder.vue'),
    meta: {
      title: 'CustomReportBuilder',
      requiresAuth: true
    }  },
  {
    path: '/reports/Detail',
    name: 'reportsDetail',
    component: () => import('../pages/Detail.vue'),
    meta: {
      title: 'Detail',
      requiresAuth: true
    }  },
  {
    path: '/reports/Edit',
    name: 'reportsEdit',
    component: () => import('../pages/Edit.vue'),
    meta: {
      title: 'Edit',
      requiresAuth: true
    }  },
  {
    path: '/reports/ExcelExport',
    name: 'reportsExcelExport',
    component: () => import('../pages/ExcelExport.vue'),
    meta: {
      title: 'ExcelExport',
      requiresAuth: true
    }  },
  {
    path: '/reports/FinanceDashboard',
    name: 'reportsFinanceDashboard',
    component: () => import('../pages/FinanceDashboard.vue'),
    meta: {
      title: 'FinanceDashboard',
      requiresAuth: true
    }  },
  {
    path: '/reports/FinanceReport',
    name: 'reportsFinanceReport',
    component: () => import('../pages/FinanceReport.vue'),
    meta: {
      title: 'FinanceReport',
      requiresAuth: true
    }  },
  {
    path: '/reports/HRReport',
    name: 'reportsHRReport',
    component: () => import('../pages/HRReport.vue'),
    meta: {
      title: 'HRReport',
      requiresAuth: true
    }  },
  {
    path: '/reports/Index',
    name: 'reportsIndex',
    component: () => import('../pages/Index.vue'),
    meta: {
      title: 'Index',
      requiresAuth: true
    }  },
  {
    path: '/reports/InventoryReport',
    name: 'reportsInventoryReport',
    component: () => import('../pages/InventoryReport.vue'),
    meta: {
      title: 'InventoryReport',
      requiresAuth: true
    }  },
  {
    path: '/reports/PDFExport',
    name: 'reportsPDFExport',
    component: () => import('../pages/PDFExport.vue'),
    meta: {
      title: 'PDFExport',
      requiresAuth: true
    }  },
  {
    path: '/reports/PowerBIIntegration',
    name: 'reportsPowerBIIntegration',
    component: () => import('../pages/PowerBIIntegration.vue'),
    meta: {
      title: 'PowerBIIntegration',
      requiresAuth: true
    }  },
  {
    path: '/reports/ProfitReport',
    name: 'reportsProfitReport',
    component: () => import('../pages/ProfitReport.vue'),
    meta: {
      title: 'ProfitReport',
      requiresAuth: true
    }  },
  {
    path: '/reports/PurchaseReport',
    name: 'reportsPurchaseReport',
    component: () => import('../pages/PurchaseReport.vue'),
    meta: {
      title: 'PurchaseReport',
      requiresAuth: true
    }  },
  {
    path: '/reports/ReportScheduler',
    name: 'reportsReportScheduler',
    component: () => import('../pages/ReportScheduler.vue'),
    meta: {
      title: 'ReportScheduler',
      requiresAuth: true
    }  },
  {
    path: '/reports/ReportsCreate',
    name: 'reportsReportsCreate',
    component: () => import('../pages/ReportsCreate.vue'),
    meta: {
      title: 'ReportsCreate',
      requiresAuth: true
    }  },
  {
    path: '/reports/ReportsDashboard',
    name: 'reportsReportsDashboard',
    component: () => import('../pages/ReportsDashboard.vue'),
    meta: {
      title: 'ReportsDashboard',
      requiresAuth: true
    }  },
  {
    path: '/reports/ReportsDetail',
    name: 'reportsReportsDetail',
    component: () => import('../pages/ReportsDetail.vue'),
    meta: {
      title: 'ReportsDetail',
      requiresAuth: true
    }  },
  {
    path: '/reports/ReportsEdit',
    name: 'reportsReportsEdit',
    component: () => import('../pages/ReportsEdit.vue'),
    meta: {
      title: 'ReportsEdit',
      requiresAuth: true
    }  },
  {
    path: '/reports/ReportsList',
    name: 'reportsReportsList',
    component: () => import('../pages/ReportsList.vue'),
    meta: {
      title: 'ReportsList',
      requiresAuth: true
    }  },
  {
    path: '/reports/ReportTemplates',
    name: 'reportsReportTemplates',
    component: () => import('../pages/ReportTemplates.vue'),
    meta: {
      title: 'ReportTemplates',
      requiresAuth: true
    }  },
  {
    path: '/reports/SalesReport',
    name: 'reportsSalesReport',
    component: () => import('../pages/SalesReport.vue'),
    meta: {
      title: 'SalesReport',
      requiresAuth: true
    }  },
  {
    path: '/reports/SaudiVatReport',
    name: 'reportsSaudiVatReport',
    component: () => import('../pages/SaudiVatReport.vue'),
    meta: {
      title: 'SaudiVatReport',
      requiresAuth: true
    }  },
  {
    path: '/reports/SaudiZatcaReport',
    name: 'reportsSaudiZatcaReport',
    component: () => import('../pages/SaudiZatcaReport.vue'),
    meta: {
      title: 'SaudiZatcaReport',
      requiresAuth: true
    }  }
]

export default reportsRoutes

