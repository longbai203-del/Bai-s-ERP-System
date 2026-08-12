/**
 * @file sidebar.js
 * @description 侧边栏菜单配置
 * @module components/sidebar
 */

import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

// ============================================================
// 菜单配置
// ============================================================
export const MENU_ITEMS = [
    // ===== 仪表盘 =====
    {
        id: 'dashboard',
        label: '仪表盘',
        icon: 'fa-chart-pie',
        path: '/',
        module: 'dashboard'
    },

    // ===== 订单管理 =====
    {
        id: 'orders',
        label: '订单管理',
        icon: 'fa-shopping-cart',
        module: 'orders',
        children: [
            { 
                id: 'orders-list',
                label: '订单列表', 
                icon: 'fa-list', 
                path: '/orders/index' 
            },
            { 
                id: 'orders-create',
                label: '创建订单', 
                icon: 'fa-plus', 
                path: '/orders/create' 
            },
            { 
                id: 'orders-statistics',
                label: '订单统计', 
                icon: 'fa-chart-bar', 
                path: '/orders/statistics' 
            }
        ]
    },

    // ===== 商品管理 =====
    {
        id: 'products',
        label: '商品管理',
        icon: 'fa-box',
        module: 'products',
        children: [
            { 
                id: 'products-list',
                label: '商品列表', 
                icon: 'fa-list', 
                path: '/products/index' 
            },
            { 
                id: 'products-create',
                label: '添加商品', 
                icon: 'fa-plus', 
                path: '/products/create' 
            },
            { 
                id: 'products-categories',
                label: '分类管理', 
                icon: 'fa-tags', 
                path: '/products/categories' 
            },
            { 
                id: 'products-stock',
                label: '库存管理', 
                icon: 'fa-warehouse', 
                path: '/products/stock' 
            }
        ]
    },

    // ===== 客户管理 =====
    {
        id: 'customers',
        label: '客户管理',
        icon: 'fa-users',
        module: 'customers',
        children: [
            { 
                id: 'customers-list',
                label: '客户列表', 
                icon: 'fa-list', 
                path: '/customers/index' 
            },
            { 
                id: 'customers-create',
                label: '添加客户', 
                icon: 'fa-user-plus', 
                path: '/customers/create' 
            },
            { 
                id: 'customers-analytics',
                label: '客户分析', 
                icon: 'fa-chart-line', 
                path: '/customers/analytics' 
            }
        ]
    },

    // ===== 用户管理 =====
    {
        id: 'users',
        label: '用户管理',
        icon: 'fa-user-cog',
        module: 'users',
        roles: ['admin', 'owner'],
        children: [
            { 
                id: 'users-list',
                label: '用户列表', 
                icon: 'fa-list', 
                path: '/users/index' 
            },
            { 
                id: 'users-create',
                label: '添加用户', 
                icon: 'fa-user-plus', 
                path: '/users/create' 
            },
            { 
                id: 'users-permissions',
                label: '权限管理', 
                icon: 'fa-lock', 
                path: '/users/permissions' 
            }
        ]
    },

    // ===== 系统设置 =====
    {
        id: 'settings',
        label: '系统设置',
        icon: 'fa-cog',
        module: 'settings',
        children: [
            { 
                id: 'settings-profile',
                label: '个人设置', 
                icon: 'fa-user', 
                path: '/settings/profile' 
            },
            { 
                id: 'settings-company',
                label: '公司信息', 
                icon: 'fa-building', 
                path: '/settings/company' 
            },
            { 
                id: 'settings-system',
                label: '系统参数', 
                icon: 'fa-sliders-h', 
                path: '/settings/system' 
            }
        ]
    },

    // ============================================================
    // 🆕 步骤3：添加新菜单项
    // ============================================================
    {
        id: 'new-module',
        label: '新模块',
        icon: 'fa-cube',
        module: 'new-module',
        path: '/new-module',
        children: [
            { 
                id: 'new-module-index',
                label: '新模块首页', 
                icon: 'fa-home', 
                path: '/new-module/index' 
            },
            { 
                id: 'new-module-create',
                label: '创建项目', 
                icon: 'fa-plus', 
                path: '/new-module/create' 
            },
            { 
                id: 'new-module-list',
                label: '项目列表', 
                icon: 'fa-list', 
                path: '/new-module/index' 
            }
        ]
    }
];

// ============================================================
// 侧边栏组件
// ============================================================
export function useSidebar() {
    const router = useRouter();
    const route = useRoute();
    const isCollapsed = ref(false);
    const isMobile = ref(window.innerWidth < 768);
    const expandedModules = ref(new Set());

    // 获取当前用户角色
    const userRole = computed(() => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            return user?.role || 'user';
        } catch {
            return 'user';
        }
    });

    // 过滤菜单项（基于角色权限）
    const filteredMenuItems = computed(() => {
        const role = userRole.value;
        return MENU_ITEMS
            .filter(item => {
                // 检查角色权限
                if (item.roles && !item.roles.includes(role)) {
                    return false;
                }
                // 检查子菜单的角色权限
                if (item.children) {
                    item.children = item.children.filter(child => {
                        if (child.roles && !child.roles.includes(role)) {
                            return false;
                        }
                        return true;
                    });
                    return item.children.length > 0;
                }
                return true;
            })
            .map(item => ({
                ...item,
                isActive: isMenuItemActive(item),
                isExpanded: expandedModules.value.has(item.id)
            }));
    });

    // 判断菜单项是否激活
    const isMenuItemActive = (item) => {
        if (item.path) {
            return route.path === item.path || route.path.startsWith(item.path + '/');
        }
        if (item.children) {
            return item.children.some(child => 
                route.path === child.path || route.path.startsWith(child.path + '/')
            );
        }
        return false;
    };

    // 切换菜单展开/收起
    const toggleModule = (moduleId) => {
        if (expandedModules.value.has(moduleId)) {
            expandedModules.value.delete(moduleId);
        } else {
            expandedModules.value.add(moduleId);
        }
    };

    // 展开当前模块
    const expandCurrentModule = () => {
        for (const item of MENU_ITEMS) {
            if (item.children) {
                const isActive = item.children.some(child => 
                    route.path === child.path || route.path.startsWith(child.path + '/')
                );
                if (isActive) {
                    expandedModules.value.add(item.id);
                }
            }
        }
    };

    // 切换侧边栏折叠状态
    const toggleCollapse = () => {
        isCollapsed.value = !isCollapsed.value;
        localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed.value));
    };

    // 导航到指定路径
    const navigateTo = (path) => {
        if (path) {
            router.push(path);
            // 移动端自动关闭侧边栏
            if (isMobile.value) {
                isCollapsed.value = true;
            }
        }
    };

    // 处理窗口大小变化
    const handleResize = () => {
        isMobile.value = window.innerWidth < 768;
        if (isMobile.value) {
            isCollapsed.value = true;
        } else {
            const saved = localStorage.getItem('sidebarCollapsed');
            if (saved !== null) {
                isCollapsed.value = JSON.parse(saved);
            }
        }
    };

    // 生命周期
    onMounted(() => {
        // 恢复折叠状态
        const saved = localStorage.getItem('sidebarCollapsed');
        if (saved !== null) {
            isCollapsed.value = JSON.parse(saved);
        }
        if (window.innerWidth < 768) {
            isCollapsed.value = true;
        }
        expandCurrentModule();
        window.addEventListener('resize', handleResize);
    });

    onUnmounted(() => {
        window.removeEventListener('resize', handleResize);
    });

    return {
        menuItems: filteredMenuItems,
        isCollapsed,
        isMobile,
        expandedModules,
        toggleModule,
        toggleCollapse,
        navigateTo,
        isMenuItemActive
    };
}

export default {
    MENU_ITEMS,
    useSidebar
};