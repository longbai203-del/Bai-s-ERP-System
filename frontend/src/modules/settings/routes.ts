// 文件路径: frontend/src/modules/settings/routes.ts
// 功能: Settings模块路由配置

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'settings',
    name: 'Settings',
    component: () => import('@/layouts/DefaultLayout.vue'),
    redirect: '/settings/company',
    children: [
      // 企业设置
      { path: 'company', name: 'CompanyProfile', component: () => import('./pages/CompanyProfile.vue'), meta: { title: '企业资料', icon: 'OfficeBuilding' } },
      { path: 'logo', name: 'LogoManagement', component: () => import('./pages/LogoManagement.vue'), meta: { title: 'Logo管理', icon: 'Picture' } },
      
      // 财务设置
      { path: 'tax', name: 'TaxSettings', component: () => import('./pages/TaxSettings.vue'), meta: { title: '税率设置', icon: 'Coin' } },
      { path: 'currency', name: 'CurrencySettings', component: () => import('./pages/CurrencySettings.vue'), meta: { title: '币种设置', icon: 'Money' } },
      { path: 'exchange-rate', name: 'ExchangeRate', component: () => import('./pages/ExchangeRate.vue'), meta: { title: '汇率管理', icon: 'TrendCharts' } },
      
      // 沙特合规
      { path: 'saudi-vat', name: 'SaudiVATSettings', component: () => import('./pages/SaudiVATSettings.vue'), meta: { title: '沙特VAT设置', icon: 'Document' } },
      { path: 'saudi-invoice', name: 'SaudiInvoiceSettings', component: () => import('./pages/SaudiInvoiceSettings.vue'), meta: { title: '沙特发票设置', icon: 'Document' } },
      
      // 打印与通知
      { path: 'print', name: 'PrintTemplate', component: () => import('./pages/PrintTemplate.vue'), meta: { title: '打印模板', icon: 'Printer' } },
      { path: 'email', name: 'EmailSettings', component: () => import('./pages/EmailSettings.vue'), meta: { title: '邮件设置', icon: 'Message' } },
      { path: 'sms', name: 'SMSSettings', component: () => import('./pages/SMSSettings.vue'), meta: { title: '短信设置', icon: 'ChatDotRound' } },
      { path: 'whatsapp', name: 'WhatsAppSettings', component: () => import('./pages/WhatsAppSettings.vue'), meta: { title: 'WhatsApp设置', icon: 'ChatDotRound' } },
      
      // 支付与系统
      { path: 'payment', name: 'PaymentSettings', component: () => import('./pages/PaymentSettings.vue'), meta: { title: '支付设置', icon: 'CreditCard' } },
      { path: 'parameters', name: 'SettingsSystemParameters', component: () => import('./pages/SystemParameters.vue'), meta: { title: '系统参数', icon: 'Setting' } },
      { path: 'theme', name: 'SettingsThemeSettings', component: () => import('./pages/ThemeSettings.vue'), meta: { title: '主题设置', icon: 'Brush' } },
      
      // 备份与许可证
      { path: 'backup', name: 'SettingsBackupSettings', component: () => import('./pages/BackupSettings.vue'), meta: { title: '备份设置', icon: 'Folder' } },
      { path: 'license', name: 'SettingsLicenseSettings', component: () => import('./pages/LicenseSettings.vue'), meta: { title: 'License设置', icon: 'Key' } },
    ],
  },
]

export default routes