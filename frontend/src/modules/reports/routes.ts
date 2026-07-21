// 文件路径: frontend/src/modules/reports/routes.ts
// 功能: Reports模块路由配置

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'reports',
    name: 'Reports',
    component: () => import('@/layouts/DefaultLayout.vue'),
    redirect: '/reports/dashboard',
    children: [
      // 报表中心
      { path: 'dashboard', name: 'ReportDashboard', component: () => import('./pages/ReportDashboard.vue'), meta: { title: '报表中心', icon: 'DataLine' } },
      
      // 业务报表
      { path: 'sales', name: 'SalesReport', component: () => import('./pages/SalesReport.vue'), meta: { title: '销售报表', icon: 'TrendCharts' } },
      { path: 'purchase', name: 'PurchaseReport', component: () => import('./pages/PurchaseReport.vue'), meta: { title: '采购报表', icon: 'ShoppingCart' } },
      { path: 'inventory', name: 'InventoryReport', component: () => import('./pages/InventoryReport.vue'), meta: { title: '库存报表', icon: 'Box' } },
      { path: 'finance', name: 'FinanceReport', component: () => import('./pages/FinanceReport.vue'), meta: { title: '财务报表', icon: 'Money' } },
      { path: 'hr', name: 'HRReport', component: () => import('./pages/HRReport.vue'), meta: { title: 'HR报表', icon: 'User' } },
      { path: 'crm', name: 'CRMReport', component: () => import('./pages/CRMReport.vue'), meta: { title: 'CRM报表', icon: 'UserFilled' } },
      
      // 利润与现金流
      { path: 'profit', name: 'ProfitReport', component: () => import('./pages/ProfitReport.vue'), meta: { title: '利润报表', icon: 'Coin' } },
      { path: 'cashflow', name: 'CashFlowReport', component: () => import('./pages/CashFlowReport.vue'), meta: { title: '现金流报表', icon: 'TrendCharts' } },
      
      // 沙特合规
      { path: 'saudi-vat', name: 'SaudiVatReport', component: () => import('./pages/SaudiVatReport.vue'), meta: { title: '沙特VAT报表', icon: 'Document' } },
      { path: 'zatca', name: 'SaudiZatcaReport', component: () => import('./pages/SaudiZatcaReport.vue'), meta: { title: 'ZATCA报表', icon: 'Document' } },
      
      // 导出工具
      { path: 'excel-export', name: 'ExcelExport', component: () => import('./pages/ExcelExport.vue'), meta: { title: 'Excel导出', icon: 'Download' } },
      { path: 'pdf-export', name: 'PDFExport', component: () => import('./pages/PDFExport.vue'), meta: { title: 'PDF导出', icon: 'Document' } },
      
      // 集成与工具
      { path: 'powerbi', name: 'PowerBIIntegration', component: () => import('./pages/PowerBIIntegration.vue'), meta: { title: 'PowerBI集成', icon: 'Connection' } },
      { path: 'custom-builder', name: 'CustomReportBuilder', component: () => import('./pages/CustomReportBuilder.vue'), meta: { title: '自定义报表', icon: 'Edit' } },
      { path: 'scheduler', name: 'ReportScheduler', component: () => import('./pages/ReportScheduler.vue'), meta: { title: '报表调度', icon: 'Clock' } },
      { path: 'templates', name: 'ReportTemplates', component: () => import('./pages/ReportTemplates.vue'), meta: { title: '报表模板', icon: 'Files' } },
    ],
  },
]

export default routes