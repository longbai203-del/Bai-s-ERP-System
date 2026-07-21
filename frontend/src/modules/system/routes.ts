// 文件路径: frontend/src/modules/system/routes.ts
// 功能: System模块路由配置

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'system',
    name: 'System',
    component: () => import('@/layouts/DefaultLayout.vue'),
    redirect: '/system/roles',
    children: [
      // 权限管理
      { path: 'roles', name: 'Roles', component: () => import('./pages/Roles.vue'), meta: { title: '角色管理', icon: 'User' } },
      { path: 'permissions', name: 'RolePermissions', component: () => import('./pages/RolePermissions.vue'), meta: { title: '角色权限', icon: 'Key' } },
      { path: 'menu', name: 'MenuManagement', component: () => import('./pages/MenuManagement.vue'), meta: { title: '菜单管理', icon: 'Menu' } },
      { path: 'button-permissions', name: 'ButtonPermissions', component: () => import('./pages/ButtonPermissions.vue'), meta: { title: '按钮权限', icon: 'Edit' } },
      { path: 'api-permissions', name: 'ApiPermissions', component: () => import('./pages/ApiPermissions.vue'), meta: { title: 'API权限', icon: 'Connection' } },
      
      // 日志管理
      { path: 'login-logs', name: 'LoginLogs', component: () => import('./pages/LoginLogs.vue'), meta: { title: '登录日志', icon: 'Document' } },
      { path: 'operation-logs', name: 'OperationLogs', component: () => import('./pages/OperationLogs.vue'), meta: { title: '操作日志', icon: 'Document' } },
      
      // 系统配置
      { path: 'parameters', name: 'SystemParameters', component: () => import('./pages/SystemParameters.vue'), meta: { title: '系统参数', icon: 'Setting' } },
      { path: 'dictionary', name: 'Dictionary', component: () => import('./pages/Dictionary.vue'), meta: { title: '字典管理', icon: 'List' } },
      { path: 'region', name: 'Region', component: () => import('./pages/Region.vue'), meta: { title: '地区管理', icon: 'Location' } },
      { path: 'currency', name: 'Currency', component: () => import('./pages/Currency.vue'), meta: { title: '币种管理', icon: 'Money' } },
      { path: 'language', name: 'Language', component: () => import('./pages/Language.vue'), meta: { title: '语言管理', icon: 'ChatLineRound' } },
      { path: 'theme', name: 'ThemeManagement', component: () => import('./pages/ThemeManagement.vue'), meta: { title: '主题管理', icon: 'Brush' } },
      
      // 通知与许可证
      { path: 'notification', name: 'Notification', component: () => import('./pages/Notification.vue'), meta: { title: '通知管理', icon: 'Bell' } },
      { path: 'license', name: 'LicenseManagement', component: () => import('./pages/LicenseManagement.vue'), meta: { title: 'License管理', icon: 'Key' } },
      
      // 备份与Webhook
      { path: 'backup', name: 'BackupRestore', component: () => import('./pages/BackupRestore.vue'), meta: { title: '备份恢复', icon: 'Folder' } },
      { path: 'webhook', name: 'WebhookManagement', component: () => import('./pages/WebhookManagement.vue'), meta: { title: 'Webhook管理', icon: 'Connection' } },
    ],
  },
]

export default routes