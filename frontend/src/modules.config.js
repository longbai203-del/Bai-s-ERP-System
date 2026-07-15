/**
 * @file modules.config.js
 * @description 所有模块配置 - 统一管理
 */

export const modules = [
    { id: '01-dashboard', path: '/dashboard', title: '仪表盘', icon: 'fa-chart-line' },
    { id: '02-pos', path: '/pos', title: 'POS', icon: 'fa-cash-register' },
    { id: '03-orders', path: '/orders', title: '订单管理', icon: 'fa-shopping-cart' },
    { id: '04-products', path: '/products', title: '商品管理', icon: 'fa-box' },
    { id: '05-customers', path: '/customers', title: '客户管理', icon: 'fa-users' },
    { id: '06-marketing', path: '/marketing', title: '营销管理', icon: 'fa-bullhorn' },
    { id: '07-inventory', path: '/inventory', title: '库存管理', icon: 'fa-warehouse' },
    { id: '08-purchase', path: '/purchase', title: '采购管理', icon: 'fa-truck' },
    { id: '09-finance', path: '/finance', title: '财务管理', icon: 'fa-coins' },
    { id: '10-hr', path: '/hr', title: '人力资源管理', icon: 'fa-user-tie' },
    { id: '11-saas', path: '/saas', title: 'SaaS管理', icon: 'fa-cloud' },
    { id: '12-system', path: '/system', title: '系统管理', icon: 'fa-cogs' },
    { id: '13-analytics', path: '/analytics', title: '数据分析', icon: 'fa-chart-pie' },
    { id: '14-settings', path: '/settings', title: '系统设置', icon: 'fa-cog' },
    { id: '15-ai', path: '/ai', title: 'AI助手', icon: 'fa-robot' }
];

export default modules;