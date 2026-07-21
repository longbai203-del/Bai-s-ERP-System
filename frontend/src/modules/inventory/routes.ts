// 文件路径: frontend/src/modules/inventory/routes.ts
// 功能: Inventory模块路由配置

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'inventory',
    name: 'Inventory',
    component: () => import('@/layouts/DefaultLayout.vue'),
    redirect: '/inventory/query',
    children: [
      // 库存查询
      { path: 'query', name: 'StockQuery', component: () => import('./pages/StockQuery.vue'), meta: { title: '库存查询', icon: 'Search' } },
      { path: 'flow', name: 'StockFlow', component: () => import('./pages/StockFlow.vue'), meta: { title: '库存流水', icon: 'List' } },
      
      // 库存调拨
      { path: 'transfer', name: 'StockTransfer', component: () => import('./pages/StockTransfer.vue'), meta: { title: '库存调拨', icon: 'Switch' } },
      { path: 'transfer/create', name: 'StockTransferCreate', component: () => import('./pages/StockTransferCreate.vue'), meta: { title: '新建调拨', hidden: true } },
      
      // 库存冻结
      { path: 'freeze', name: 'StockFreeze', component: () => import('./pages/StockFreeze.vue'), meta: { title: '库存冻结', icon: 'Lock' } },
      
      // 库存盘点
      { path: 'count', name: 'StockCount', component: () => import('./pages/StockCount.vue'), meta: { title: '库存盘点', icon: 'DocumentChecked' } },
      { path: 'count/create', name: 'StockCountCreate', component: () => import('./pages/StockCountCreate.vue'), meta: { title: '新建盘点', hidden: true } },
      
      // 库存调整
      { path: 'adjustment', name: 'StockAdjustment', component: () => import('./pages/StockAdjustment.vue'), meta: { title: '库存调整', icon: 'Edit' } },
      
      // 库存预警
      { path: 'alert', name: 'StockAlert', component: () => import('./pages/StockAlert.vue'), meta: { title: '库存预警', icon: 'Warning' } },
      { path: 'safety', name: 'SafetyStock', component: () => import('./pages/SafetyStock.vue'), meta: { title: '安全库存', icon: 'Shield' } },
      
      // 批次序列号
      { path: 'batch', name: 'BatchManagement', component: () => import('./pages/BatchManagement.vue'), meta: { title: '批次管理', icon: 'Coin' } },
      { path: 'serial', name: 'SerialNumber', component: () => import('./pages/SerialNumber.vue'), meta: { title: '序列号管理', icon: 'Barcode' } },
      { path: 'shelf-life', name: 'ShelfLife', component: () => import('./pages/ShelfLife.vue'), meta: { title: '保质期管理', icon: 'Timer' } },
      
      // 仓库管理
      { path: 'map', name: 'WarehouseMap', component: () => import('./pages/WarehouseMap.vue'), meta: { title: '仓库地图', icon: 'Location' } },
      { path: 'location', name: 'LocationManagement', component: () => import('./pages/LocationManagement.vue'), meta: { title: '货位管理', icon: 'Grid' } },
      
      // 库存分析
      { path: 'abc', name: 'AbcAnalysis', component: () => import('./pages/AbcAnalysis.vue'), meta: { title: 'ABC分析', icon: 'DataLine' } },
      { path: 'dead-stock', name: 'DeadStock', component: () => import('./pages/DeadStock.vue'), meta: { title: '呆滞库存', icon: 'WarningFilled' } },
      { path: 'forecast', name: 'StockForecast', component: () => import('./pages/StockForecast.vue'), meta: { title: '库存预测', icon: 'TrendCharts' } },
    ],
  },
]

export default routes