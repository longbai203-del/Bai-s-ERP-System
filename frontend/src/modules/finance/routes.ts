// 文件路径: frontend/src/modules/finance/routes.ts
// 功能: Finance模块路由配置

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'finance',
    name: 'Finance',
    component: () => import('@/layouts/DefaultLayout.vue'),
    redirect: '/finance/ledger',
    children: [
      // 总账与凭证
      { path: 'ledger', name: 'GeneralLedger', component: () => import('./pages/GeneralLedger.vue'), meta: { title: '总账', icon: 'Document' } },
      { path: 'journal', name: 'JournalEntries', component: () => import('./pages/JournalEntries.vue'), meta: { title: '凭证管理', icon: 'Edit' } },
      { path: 'journal/create', name: 'JournalEntryCreate', component: () => import('./pages/JournalEntryCreate.vue'), meta: { title: '新建凭证', hidden: true } },
      
      // 现金银行
      { path: 'cash', name: 'CashManagement', component: () => import('./pages/CashManagement.vue'), meta: { title: '现金管理', icon: 'Money' } },
      { path: 'bank', name: 'BankManagement', component: () => import('./pages/BankManagement.vue'), meta: { title: '银行管理', icon: 'BankCard' } },
      
      // 收付款
      { path: 'payments', name: 'Payments', component: () => import('./pages/Payments.vue'), meta: { title: '付款管理', icon: 'CreditCard' } },
      { path: 'payments/create', name: 'PaymentCreate', component: () => import('./pages/PaymentCreate.vue'), meta: { title: '新建付款', hidden: true } },
      { path: 'receipts', name: 'Receipts', component: () => import('./pages/Receipts.vue'), meta: { title: '收款管理', icon: 'Wallet' } },
      { path: 'receipts/create', name: 'ReceiptCreate', component: () => import('./pages/ReceiptCreate.vue'), meta: { title: '新建收款', hidden: true } },
      
      // 费用报销
      { path: 'expenses', name: 'Expenses', component: () => import('./pages/Expenses.vue'), meta: { title: '费用管理', icon: 'Coin' } },
      { path: 'expenses/create', name: 'ExpenseCreate', component: () => import('./pages/ExpenseCreate.vue'), meta: { title: '新建费用', hidden: true } },
      { path: 'reimbursement', name: 'Reimbursement', component: () => import('./pages/Reimbursement.vue'), meta: { title: '报销管理', icon: 'DocumentChecked' } },
      
      // 固定资产
      { path: 'assets', name: 'FixedAssets', component: () => import('./pages/FixedAssets.vue'), meta: { title: '固定资产', icon: 'Box' } },
      { path: 'depreciation', name: 'Depreciation', component: () => import('./pages/Depreciation.vue'), meta: { title: '折旧管理', icon: 'Timer' } },
      
      // 预算
      { path: 'budget', name: 'BudgetManagement', component: () => import('./pages/BudgetManagement.vue'), meta: { title: '预算管理', icon: 'Flag' } },
      
      // 现金流
      { path: 'cashflow', name: 'CashFlow', component: () => import('./pages/CashFlow.vue'), meta: { title: '现金流', icon: 'TrendCharts' } },
      
      // 税务
      { path: 'tax', name: 'TaxManagement', component: () => import('./pages/TaxManagement.vue'), meta: { title: '税务管理', icon: 'Document' } },
      { path: 'saudi-vat', name: 'SaudiVat', component: () => import('./pages/SaudiVat.vue'), meta: { title: '沙特VAT', icon: 'Coin' } },
      { path: 'zatca', name: 'SaudiZatca', component: () => import('./pages/SaudiZatca.vue'), meta: { title: 'ZATCA电子发票', icon: 'Document' } },
      { path: 'einvoice', name: 'ElectronicInvoice', component: () => import('./pages/ElectronicInvoice.vue'), meta: { title: '电子发票', icon: 'Document' } },
      
      // 应收应付
      { path: 'receivable', name: 'AccountsReceivable', component: () => import('./pages/AccountsReceivable.vue'), meta: { title: '应收管理', icon: 'Wallet' } },
      { path: 'payable', name: 'AccountsPayable', component: () => import('./pages/AccountsPayable.vue'), meta: { title: '应付管理', icon: 'CreditCard' } },
      
      // 成本中心
      { path: 'cost-center', name: 'CostCenter', component: () => import('./pages/CostCenter.vue'), meta: { title: '成本中心', icon: 'DataLine' } },
      
      // 财务分析
      { path: 'analysis', name: 'FinancialAnalysis', component: () => import('./pages/FinancialAnalysis.vue'), meta: { title: '财务分析', icon: 'DataAnalysis' } },
    ],
  },
]

export default routes