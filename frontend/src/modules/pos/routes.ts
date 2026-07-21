// 文件路径: frontend/src/modules/pos/routes.ts
// 功能: POS模块路由配置

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'pos',
    name: 'POS',
    component: () => import('@/layouts/DefaultLayout.vue'),
    redirect: '/pos/cashier',
    children: [
      // 核心收银
      { path: 'cashier', name: 'PosCashier', component: () => import('./pages/Cashier.vue'), meta: { title: '收银台', icon: 'Money' } },
      { path: 'quick-sale', name: 'QuickSale', component: () => import('./pages/QuickSale.vue'), meta: { title: '快速销售', icon: 'Lightning' } },
      { path: 'touch-pos', name: 'TouchPOS', component: () => import('./pages/TouchPOS.vue'), meta: { title: '触屏收银', icon: 'Monitor' } },
      
      // 扩展功能
      { path: 'kitchen', name: 'KitchenDisplay', component: () => import('./pages/KitchenDisplay.vue'), meta: { title: '厨房显示', icon: 'KnifeFork' } },
      { path: 'customer-display', name: 'CustomerDisplay', component: () => import('./pages/CustomerDisplay.vue'), meta: { title: '客户显示屏', icon: 'Monitor' } },
      { path: 'cash-register', name: 'CashRegister', component: () => import('./pages/CashRegister.vue'), meta: { title: '钱箱管理', icon: 'Box' } },
      { path: 'offline-pos', name: 'OfflinePOS', component: () => import('./pages/OfflinePOS.vue'), meta: { title: '离线模式', icon: 'Connection' } },
      
      // 交易管理
      { path: 'exchange', name: 'Exchange', component: () => import('./pages/Exchange.vue'), meta: { title: '退换货', icon: 'Refresh' } },
      { path: 'receipt', name: 'Receipt', component: () => import('./pages/Receipt.vue'), meta: { title: '小票打印', icon: 'Printer' } },
      { path: 'returns', name: 'PosReturns', component: () => import('./pages/Returns.vue'), meta: { title: '退货管理', icon: 'Refresh' } },
      
      // 会员与营销
      { path: 'member-points', name: 'MemberPoints', component: () => import('./pages/MemberPoints.vue'), meta: { title: '会员积分', icon: 'Star' } },
      { path: 'coupons', name: 'CouponManagement', component: () => import('./pages/CouponManagement.vue'), meta: { title: '优惠券管理', icon: 'Ticket' } },
      { path: 'scan-payment', name: 'ScanPayment', component: () => import('./pages/ScanPayment.vue'), meta: { title: '扫码支付', icon: 'Camera' } },
      
      // 日结管理
      { path: 'daily-close', name: 'DailyClose', component: () => import('./pages/DailyClose.vue'), meta: { title: '日结管理', icon: 'Calendar' } },
      
      // CRUD操作
      { path: 'list', name: 'PosList', component: () => import('./pages/PosList.vue'), meta: { title: 'POS列表', icon: 'List' } },
      { path: 'create', name: 'PosCreate', component: () => import('./pages/PosCreate.vue'), meta: { title: '新建POS', hidden: true } },
      { path: 'detail/:id', name: 'PosDetail', component: () => import('./pages/PosDetail.vue'), meta: { title: 'POS详情', hidden: true } },
      { path: 'edit/:id', name: 'PosEdit', component: () => import('./pages/PosEdit.vue'), meta: { title: '编辑POS', hidden: true } },
    ],
  },
]

export default routes