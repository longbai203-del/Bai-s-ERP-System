// 文件路径: frontend/src/modules/production/routes.ts
// 功能: Production模块路由配置

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'production',
    name: 'Production',
    component: () => import('@/layouts/DefaultLayout.vue'),
    redirect: '/production/bom',
    children: [
      // BOM管理
      { path: 'bom', name: 'BOM', component: () => import('./pages/BOM.vue'), meta: { title: 'BOM管理', icon: 'List' } },
      { path: 'bom/create', name: 'BOMCreate', component: () => import('./pages/BOMCreate.vue'), meta: { title: '新建BOM', hidden: true } },
      { path: 'bom/detail/:id', name: 'BOMDetail', component: () => import('./pages/BOMDetail.vue'), meta: { title: 'BOM详情', hidden: true } },
      
      // 工单管理
      { path: 'workorders', name: 'WorkOrders', component: () => import('./pages/WorkOrders.vue'), meta: { title: '工单管理', icon: 'Document' } },
      { path: 'workorders/create', name: 'WorkOrderCreate', component: () => import('./pages/WorkOrderCreate.vue'), meta: { title: '新建工单', hidden: true } },
      
      // MRP
      { path: 'mrp', name: 'MRP', component: () => import('./pages/MRP.vue'), meta: { title: 'MRP运算', icon: 'Monitor' } },
      
      // 生产计划
      { path: 'plan', name: 'ProductionPlan', component: () => import('./pages/ProductionPlan.vue'), meta: { title: '生产计划', icon: 'Flag' } },
      { path: 'plan/create', name: 'ProductionPlanCreate', component: () => import('./pages/ProductionPlanCreate.vue'), meta: { title: '新建生产计划', hidden: true } },
      
      // 生产领料
      { path: 'material-issue', name: 'MaterialIssue', component: () => import('./pages/MaterialIssue.vue'), meta: { title: '生产领料', icon: 'Box' } },
      
      // 完工管理
      { path: 'complete', name: 'ProductionComplete', component: () => import('./pages/ProductionComplete.vue'), meta: { title: '完工管理', icon: 'Check' } },
      
      // 质检管理
      { path: 'quality', name: 'QualityControl', component: () => import('./pages/QualityControl.vue'), meta: { title: '质检管理', icon: 'CircleCheck' } },
      
      // 生产成本
      { path: 'cost', name: 'ProductionCost', component: () => import('./pages/ProductionCost.vue'), meta: { title: '生产成本', icon: 'Money' } },
      
      // 设备管理
      { path: 'equipment', name: 'EquipmentManagement', component: () => import('./pages/EquipmentManagement.vue'), meta: { title: '设备管理', icon: 'Tools' } },
      { path: 'maintenance', name: 'EquipmentMaintenance', component: () => import('./pages/EquipmentMaintenance.vue'), meta: { title: '设备维修', icon: 'Tools' } },
    ],
  },
]

export default routes