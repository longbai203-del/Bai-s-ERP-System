// ai 模块路由 (自动生成)
import type { RouteRecordRaw } from 'vue-router'

const aiRoutes: RouteRecordRaw[] = [
  {
    path: '',
    redirect: '/ai/'
  },
  {
    path: '/ai/AIChat',
    name: 'aiAIChat',
    component: () => import('../pages/AIChat.vue'),
    meta: {
      title: 'AIChat',
      requiresAuth: true
    }  },
  {
    path: '/ai/AIContract',
    name: 'aiAIContract',
    component: () => import('../pages/AIContract.vue'),
    meta: {
      title: 'AIContract',
      requiresAuth: true
    }  },
  {
    path: '/ai/AiCreate',
    name: 'aiAiCreate',
    component: () => import('../pages/AiCreate.vue'),
    meta: {
      title: 'AiCreate',
      requiresAuth: true
    }  },
  {
    path: '/ai/AICustomerService',
    name: 'aiAICustomerService',
    component: () => import('../pages/AICustomerService.vue'),
    meta: {
      title: 'AICustomerService',
      requiresAuth: true
    }  },
  {
    path: '/ai/AIInvoice',
    name: 'aiAIInvoice',
    component: () => import('../pages/AIInvoice.vue'),
    meta: {
      title: 'AIInvoice',
      requiresAuth: true
    }  },
  {
    path: '/ai/AIOCR',
    name: 'aiAIOCR',
    component: () => import('../pages/AIOCR.vue'),
    meta: {
      title: 'AIOCR',
      requiresAuth: true
    }  },
  {
    path: '/ai/AIQA',
    name: 'aiAIQA',
    component: () => import('../pages/AIQA.vue'),
    meta: {
      title: 'AIQA',
      requiresAuth: true
    }  },
  {
    path: '/ai/AIReport',
    name: 'aiAIReport',
    component: () => import('../pages/AIReport.vue'),
    meta: {
      title: 'AIReport',
      requiresAuth: true
    }  },
  {
    path: '/ai/Create',
    name: 'aiCreate',
    component: () => import('../pages/Create.vue'),
    meta: {
      title: 'Create',
      requiresAuth: true
    }  },
  {
    path: '/ai/Detail',
    name: 'aiDetail',
    component: () => import('../pages/Detail.vue'),
    meta: {
      title: 'Detail',
      requiresAuth: true
    }  },
  {
    path: '/ai/Edit',
    name: 'aiEdit',
    component: () => import('../pages/Edit.vue'),
    meta: {
      title: 'Edit',
      requiresAuth: true
    }  },
  {
    path: '/ai/GeneratePurchaseOrder',
    name: 'aiGeneratePurchaseOrder',
    component: () => import('../pages/GeneratePurchaseOrder.vue'),
    meta: {
      title: 'GeneratePurchaseOrder',
      requiresAuth: true
    }  },
  {
    path: '/ai/GenerateQuotation',
    name: 'aiGenerateQuotation',
    component: () => import('../pages/GenerateQuotation.vue'),
    meta: {
      title: 'GenerateQuotation',
      requiresAuth: true
    }  },
  {
    path: '/ai/InventoryPrediction',
    name: 'aiInventoryPrediction',
    component: () => import('../pages/InventoryPrediction.vue'),
    meta: {
      title: 'InventoryPrediction',
      requiresAuth: true
    }  },
  {
    path: '/ai/ProfitAnalysis',
    name: 'aiProfitAnalysis',
    component: () => import('../pages/ProfitAnalysis.vue'),
    meta: {
      title: 'ProfitAnalysis',
      requiresAuth: true
    }  },
  {
    path: '/ai/PurchaseSuggestion',
    name: 'aiPurchaseSuggestion',
    component: () => import('../pages/PurchaseSuggestion.vue'),
    meta: {
      title: 'PurchaseSuggestion',
      requiresAuth: true
    }  },
  {
    path: '/ai/SalesPrediction',
    name: 'aiSalesPrediction',
    component: () => import('../pages/SalesPrediction.vue'),
    meta: {
      title: 'SalesPrediction',
      requiresAuth: true
    }  }
]

export default aiRoutes

