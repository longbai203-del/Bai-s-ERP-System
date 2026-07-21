// 文件路径: frontend/src/modules/ai/routes.ts
// 功能: AI Center模块路由配置

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'ai',
    name: 'AI',
    component: () => import('@/layouts/DefaultLayout.vue'),
    redirect: '/ai/dashboard',
    children: [
      // AI中心首页
      { path: 'dashboard', name: 'AIDashboard', component: () => import('./pages/AIDashboard.vue'), meta: { title: 'AI中心', icon: 'Cpu' } },
      
      // 预测分析
      { path: 'sales-prediction', name: 'SalesPrediction', component: () => import('./pages/SalesPrediction.vue'), meta: { title: 'AI销售预测', icon: 'TrendCharts' } },
      { path: 'inventory-prediction', name: 'InventoryPrediction', component: () => import('./pages/InventoryPrediction.vue'), meta: { title: 'AI库存预测', icon: 'Box' } },
      { path: 'purchase-suggestion', name: 'PurchaseSuggestion', component: () => import('./pages/PurchaseSuggestion.vue'), meta: { title: 'AI采购建议', icon: 'ShoppingCart' } },
      { path: 'profit-analysis', name: 'ProfitAnalysis', component: () => import('./pages/ProfitAnalysis.vue'), meta: { title: 'AI利润分析', icon: 'Money' } },
      
      // 对话交互
      { path: 'qa', name: 'AIQA', component: () => import('./pages/AIQA.vue'), meta: { title: 'AI问答', icon: 'ChatDotRound' } },
      { path: 'chat', name: 'AIChat', component: () => import('./pages/AIChat.vue'), meta: { title: 'AI聊天', icon: 'ChatLineRound' } },
      { path: 'customer-service', name: 'AICustomerService', component: () => import('./pages/AICustomerService.vue'), meta: { title: 'AI客服', icon: 'Service' } },
      
      // 报表与生成
      { path: 'report', name: 'AIReport', component: () => import('./pages/AIReport.vue'), meta: { title: 'AI报表', icon: 'DataAnalysis' } },
      { path: 'generate-po', name: 'GeneratePurchaseOrder', component: () => import('./pages/GeneratePurchaseOrder.vue'), meta: { title: 'AI生成采购单', icon: 'Document' } },
      { path: 'generate-quotation', name: 'GenerateQuotation', component: () => import('./pages/GenerateQuotation.vue'), meta: { title: 'AI生成报价单', icon: 'Document' } },
      
      // OCR与文档
      { path: 'ocr', name: 'AIOCR', component: () => import('./pages/AIOCR.vue'), meta: { title: 'AI OCR识别', icon: 'Document' } },
      { path: 'invoice', name: 'AIInvoice', component: () => import('./pages/AIInvoice.vue'), meta: { title: 'AI发票识别', icon: 'Document' } },
      { path: 'contract', name: 'AIContract', component: () => import('./pages/AIContract.vue'), meta: { title: 'AI合同分析', icon: 'Document' } },
    ],
  },
]

export default routes