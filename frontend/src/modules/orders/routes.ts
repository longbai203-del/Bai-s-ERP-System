// 文件路径: frontend/src/modules/orders/routes.ts
// 功能: Orders模块路由配置

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'orders',
    name: 'Orders',
    component: () => import('@/layouts/DefaultLayout.vue'),
    redirect: '/orders/list',
    children: [
      // 报价管理
      { path: 'quotations', name: 'Quotations', component: () => import('./pages/Quotations.vue'), meta: { title: '销售报价', icon: 'Document' } },
      { path: 'quotations/create', name: 'QuotationCreate', component: () => import('./pages/QuotationCreate.vue'), meta: { title: '新建报价', hidden: true } },
      { path: 'quotations/detail/:id', name: 'QuotationDetail', component: () => import('./pages/QuotationDetail.vue'), meta: { title: '报价详情', hidden: true } },
      
      // 合同管理
      { path: 'contracts', name: 'SalesContracts', component: () => import('./pages/SalesContracts.vue'), meta: { title: '销售合同', icon: 'DocumentChecked' } },
      { path: 'contracts/create', name: 'SalesContractCreate', component: () => import('./pages/SalesContractCreate.vue'), meta: { title: '新建合同', hidden: true } },
      { path: 'contracts/detail/:id', name: 'SalesContractDetail', component: () => import('./pages/SalesContractDetail.vue'), meta: { title: '合同详情', hidden: true } },
      
      // 出库退货
      { path: 'outbound', name: 'SalesOutbound', component: () => import('./pages/SalesOutbound.vue'), meta: { title: '销售出库', icon: 'Box' } },
      { path: 'returns', name: 'SalesReturns', component: () => import('./pages/SalesReturns.vue'), meta: { title: '销售退货', icon: 'Refresh' } },
      
      // 客户管理
      { path: 'credit', name: 'CustomerCredit', component: () => import('./pages/CustomerCredit.vue'), meta: { title: '客户信用', icon: 'Wallet' } },
      { path: 'payment', name: 'CustomerPayment', component: () => import('./pages/CustomerPayment.vue'), meta: { title: '客户收款', icon: 'Money' } },
      { path: 'debt', name: 'CustomerDebt', component: () => import('./pages/CustomerDebt.vue'), meta: { title: '客户欠款', icon: 'Warning' } },
      
      // 价格管理
      { path: 'price', name: 'PriceManagement', component: () => import('./pages/PriceManagement.vue'), meta: { title: '价格管理', icon: 'PriceTag' } },
      
      // 销售分析
      { path: 'target', name: 'SalesTarget', component: () => import('./pages/SalesTarget.vue'), meta: { title: '销售目标', icon: 'Flag' } },
      { path: 'analysis', name: 'SalesAnalysis', component: () => import('./pages/SalesAnalysis.vue'), meta: { title: '销售分析', icon: 'DataAnalysis' } },
      { path: 'ranking', name: 'SalesRanking', component: () => import('./pages/SalesRanking.vue'), meta: { title: '销售排行', icon: 'TrendCharts' } },
      { path: 'performance', name: 'SalesPerformance', component: () => import('./pages/SalesPerformance.vue'), meta: { title: '业务员绩效', icon: 'Trophy' } },
      
      // 客户服务
      { path: 'visit', name: 'CustomerVisit', component: () => import('./pages/CustomerVisit.vue'), meta: { title: '客户拜访', icon: 'User' } },
      { path: 'complaint', name: 'CustomerComplaint', component: () => import('./pages/CustomerComplaint.vue'), meta: { title: '投诉管理', icon: 'Warning' } },
      { path: 'service', name: 'ServiceOrders', component: () => import('./pages/ServiceOrders.vue'), meta: { title: '售后服务', icon: 'Service' } },
      
      // 销售预测
      { path: 'forecast', name: 'SalesForecast', component: () => import('./pages/SalesForecast.vue'), meta: { title: '销售预测', icon: 'TrendCharts' } },
    ],
  },
]

export default routes