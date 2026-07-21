// 文件路径: frontend/src/modules/purchase/routes.ts
// 功能: Purchase模块路由配置

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'purchase',
    name: 'Purchase',
    component: () => import('@/layouts/DefaultLayout.vue'),
    redirect: '/purchase/request',
    children: [
      // 采购申请
      { path: 'request', name: 'PurchaseRequest', component: () => import('./pages/PurchaseRequest.vue'), meta: { title: '采购申请', icon: 'Document' } },
      { path: 'request/create', name: 'PurchaseRequestCreate', component: () => import('./pages/PurchaseRequestCreate.vue'), meta: { title: '新建采购申请', hidden: true } },
      
      // 采购审批
      { path: 'approval', name: 'PurchaseApproval', component: () => import('./pages/PurchaseApproval.vue'), meta: { title: '采购审批', icon: 'Check' } },
      
      // 询价比价
      { path: 'inquiry', name: 'PurchaseInquiry', component: () => import('./pages/PurchaseInquiry.vue'), meta: { title: '询价管理', icon: 'Search' } },
      { path: 'comparison', name: 'PurchaseComparison', component: () => import('./pages/PurchaseComparison.vue'), meta: { title: '比价管理', icon: 'DataLine' } },
      
      // 采购合同
      { path: 'contracts', name: 'PurchaseContracts', component: () => import('./pages/PurchaseContracts.vue'), meta: { title: '采购合同', icon: 'DocumentChecked' } },
      { path: 'contracts/create', name: 'PurchaseContractCreate', component: () => import('./pages/PurchaseContractCreate.vue'), meta: { title: '新建采购合同', hidden: true } },
      { path: 'contracts/detail/:id', name: 'PurchaseContractDetail', component: () => import('./pages/PurchaseContractDetail.vue'), meta: { title: '采购合同详情', hidden: true } },
      
      // 采购入库
      { path: 'receipt', name: 'PurchaseReceipt', component: () => import('./pages/PurchaseReceipt.vue'), meta: { title: '采购入库', icon: 'Box' } },
      { path: 'returns', name: 'PurchaseReturns', component: () => import('./pages/PurchaseReturns.vue'), meta: { title: '采购退货', icon: 'Refresh' } },
      
      // 供应商管理
      { path: 'quotation', name: 'SupplierQuotation', component: () => import('./pages/SupplierQuotation.vue'), meta: { title: '供应商报价', icon: 'PriceTag' } },
      { path: 'rating', name: 'SupplierRating', component: () => import('./pages/SupplierRating.vue'), meta: { title: '供应商评分', icon: 'Star' } },
      { path: 'credit', name: 'SupplierCredit', component: () => import('./pages/SupplierCredit.vue'), meta: { title: '供应商信用', icon: 'Wallet' } },
      
      // 付款管理
      { path: 'payment', name: 'PaymentRequest', component: () => import('./pages/PaymentRequest.vue'), meta: { title: '付款申请', icon: 'Money' } },
      
      // 采购分析
      { path: 'analysis', name: 'PurchaseAnalysis', component: () => import('./pages/PurchaseAnalysis.vue'), meta: { title: '采购分析', icon: 'DataAnalysis' } },
      { path: 'performance', name: 'PurchasePerformance', component: () => import('./pages/PurchasePerformance.vue'), meta: { title: '采购绩效', icon: 'Trophy' } },
      
      // 采购计划
      { path: 'plan', name: 'PurchasePlan', component: () => import('./pages/PurchasePlan.vue'), meta: { title: '采购计划', icon: 'Flag' } },
      { path: 'budget', name: 'PurchaseBudget', component: () => import('./pages/PurchaseBudget.vue'), meta: { title: '采购预算', icon: 'Coin' } },
    ],
  },
]

export default routes