/**
 * @file router.js
 * @description 应用路由配置
 * @module core/router
 */

import { createRouter, createWebHistory } from 'vue-router';

// ============================================================
// 路由配置
// ============================================================
const routes = [
    // ===== 现有路由 =====
    { 
        path: '/', 
        component: () => import('../views/Dashboard.vue'),
        meta: { 
            title: '仪表盘', 
            icon: 'fa-chart-pie', 
            requiresAuth: true 
        }
    },
    { 
        path: '/login', 
        component: () => import('../views/Login.vue'),
        meta: { 
            title: '登录', 
            requiresAuth: false 
        }
    },
    { 
        path: '/404', 
        component: () => import('../views/NotFound.vue'),
        meta: { 
            title: '404 - 页面未找到', 
            requiresAuth: false 
        }
    },

    // ===== 订单模块 =====
    { 
        path: '/orders', 
        component: () => import('../views/orders/Index.vue'),
        meta: { 
            title: '订单管理', 
            icon: 'fa-shopping-cart', 
            module: 'orders',
            requiresAuth: true 
        }
    },
    { 
        path: '/orders/index', 
        component: () => import('../views/orders/Index.vue'),
        meta: { 
            title: '订单列表', 
            icon: 'fa-list', 
            module: 'orders',
            requiresAuth: true 
        }
    },
    { 
        path: '/orders/create', 
        component: () => import('../views/orders/Create.vue'),
        meta: { 
            title: '创建订单', 
            icon: 'fa-plus', 
            module: 'orders',
            requiresAuth: true 
        }
    },
    { 
        path: '/orders/:id', 
        component: () => import('../views/orders/Detail.vue'),
        meta: { 
            title: '订单详情', 
            icon: 'fa-eye', 
            module: 'orders',
            requiresAuth: true 
        }
    },
    { 
        path: '/orders/:id/edit', 
        component: () => import('../views/orders/Edit.vue'),
        meta: { 
            title: '编辑订单', 
            icon: 'fa-edit', 
            module: 'orders',
            requiresAuth: true 
        }
    },

    // ===== 商品模块 =====
    { 
        path: '/products', 
        component: () => import('../views/products/Index.vue'),
        meta: { 
            title: '商品管理', 
            icon: 'fa-box', 
            module: 'products',
            requiresAuth: true 
        }
    },
    { 
        path: '/products/index', 
        component: () => import('../views/products/Index.vue'),
        meta: { 
            title: '商品列表', 
            icon: 'fa-list', 
            module: 'products',
            requiresAuth: true 
        }
    },
    { 
        path: '/products/create', 
        component: () => import('../views/products/Create.vue'),
        meta: { 
            title: '添加商品', 
            icon: 'fa-plus', 
            module: 'products',
            requiresAuth: true 
        }
    },
    { 
        path: '/products/:id', 
        component: () => import('../views/products/Detail.vue'),
        meta: { 
            title: '商品详情', 
            icon: 'fa-eye', 
            module: 'products',
            requiresAuth: true 
        }
    },
    { 
        path: '/products/:id/edit', 
        component: () => import('../views/products/Edit.vue'),
        meta: { 
            title: '编辑商品', 
            icon: 'fa-edit', 
            module: 'products',
            requiresAuth: true 
        }
    },

    // ===== 客户模块 =====
    { 
        path: '/customers', 
        component: () => import('../views/customers/Index.vue'),
        meta: { 
            title: '客户管理', 
            icon: 'fa-users', 
            module: 'customers',
            requiresAuth: true 
        }
    },
    { 
        path: '/customers/index', 
        component: () => import('../views/customers/Index.vue'),
        meta: { 
            title: '客户列表', 
            icon: 'fa-list', 
            module: 'customers',
            requiresAuth: true 
        }
    },
    { 
        path: '/customers/create', 
        component: () => import('../views/customers/Create.vue'),
        meta: { 
            title: '添加客户', 
            icon: 'fa-user-plus', 
            module: 'customers',
            requiresAuth: true 
        }
    },
    { 
        path: '/customers/:id', 
        component: () => import('../views/customers/Detail.vue'),
        meta: { 
            title: '客户详情', 
            icon: 'fa-eye', 
            module: 'customers',
            requiresAuth: true 
        }
    },
    { 
        path: '/customers/:id/edit', 
        component: () => import('../views/customers/Edit.vue'),
        meta: { 
            title: '编辑客户', 
            icon: 'fa-edit', 
            module: 'customers',
            requiresAuth: true 
        }
    },

    // ===== 用户管理模块 =====
    { 
        path: '/users', 
        component: () => import('../views/users/Index.vue'),
        meta: { 
            title: '用户管理', 
            icon: 'fa-user-cog', 
            module: 'users',
            requiresAuth: true,
            roles: ['admin', 'owner']
        }
    },
    { 
        path: '/users/index', 
        component: () => import('../views/users/Index.vue'),
        meta: { 
            title: '用户列表', 
            icon: 'fa-list', 
            module: 'users',
            requiresAuth: true,
            roles: ['admin', 'owner']
        }
    },
    { 
        path: '/users/create', 
        component: () => import('../views/users/Create.vue'),
        meta: { 
            title: '添加用户', 
            icon: 'fa-user-plus', 
            module: 'users',
            requiresAuth: true,
            roles: ['admin', 'owner']
        }
    },
    { 
        path: '/users/:id', 
        component: () => import('../views/users/Detail.vue'),
        meta: { 
            title: '用户详情', 
            icon: 'fa-eye', 
            module: 'users',
            requiresAuth: true,
            roles: ['admin', 'owner']
        }
    },
    { 
        path: '/users/:id/edit', 
        component: () => import('../views/users/Edit.vue'),
        meta: { 
            title: '编辑用户', 
            icon: 'fa-edit', 
            module: 'users',
            requiresAuth: true,
            roles: ['admin', 'owner']
        }
    },

    // ===== 系统设置 =====
    { 
        path: '/settings', 
        component: () => import('../views/settings/Index.vue'),
        meta: { 
            title: '系统设置', 
            icon: 'fa-cog', 
            module: 'settings',
            requiresAuth: true,
            roles: ['admin', 'owner']
        }
    },
    { 
        path: '/settings/profile', 
        component: () => import('../views/settings/Profile.vue'),
        meta: { 
            title: '个人设置', 
            icon: 'fa-user', 
            module: 'settings',
            requiresAuth: true 
        }
    },
    { 
        path: '/settings/company', 
        component: () => import('../views/settings/Company.vue'),
        meta: { 
            title: '公司信息', 
            icon: 'fa-building', 
            module: 'settings',
            requiresAuth: true,
            roles: ['admin', 'owner']
        }
    },

    // ============================================================
    // 🆕 新增模块 - 示例
    // ============================================================
    // 步骤2：添加新路由
    { 
        path: '/new-module', 
        component: () => import('../views/new-module/Index.vue'),
        meta: { 
            title: '新模块', 
            icon: 'fa-cube', 
            module: 'new-module',
            requiresAuth: true 
        }
    },
    { 
        path: '/new-module/index', 
        component: () => import('../views/new-module/Index.vue'),
        meta: { 
            title: '新模块首页', 
            icon: 'fa-home', 
            module: 'new-module',
            requiresAuth: true 
        }
    },
    { 
        path: '/new-module/create', 
        component: () => import('../views/new-module/Create.vue'),
        meta: { 
            title: '创建新项目', 
            icon: 'fa-plus', 
            module: 'new-module',
            requiresAuth: true 
        }
    },
    { 
        path: '/new-module/:id', 
        component: () => import('../views/new-module/Detail.vue'),
        meta: { 
            title: '项目详情', 
            icon: 'fa-eye', 
            module: 'new-module',
            requiresAuth: true 
        }
    },
    { 
        path: '/new-module/:id/edit', 
        component: () => import('../views/new-module/Edit.vue'),
        meta: { 
            title: '编辑项目', 
            icon: 'fa-edit', 
            module: 'new-module',
            requiresAuth: true 
        }
    },

    // ===== 重定向 =====
    { 
        path: '/:pathMatch(.*)*', 
        redirect: '/404' 
    }
];

// ============================================================
// 创建路由实例
// ============================================================
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL || '/'),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        }
        return { top: 0 };
    }
});

// ============================================================
// 路由守卫
// ============================================================
router.beforeEach((to, from, next) => {
    // 设置页面标题
    document.title = to.meta.title 
        ? `${to.meta.title} | 企业管理系统` 
        : '企业管理系统';

    // 检查是否需要认证
    const requiresAuth = to.meta.requiresAuth !== false;
    const token = localStorage.getItem('accessToken');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    // 需要认证但未登录
    if (requiresAuth && !token) {
        return next({
            path: '/login',
            query: { redirect: to.fullPath }
        });
    }

    // 已登录但访问登录页
    if (to.path === '/login' && token) {
        return next('/');
    }

    // 检查角色权限
    const allowedRoles = to.meta.roles;
    if (allowedRoles && user) {
        if (!allowedRoles.includes(user.role)) {
            return next('/');
        }
    }

    next();
});

// 路由后置钩子
router.afterEach((to, from) => {
    // 关闭移动端菜单
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (menuToggle && sidebar) {
        sidebar.classList.remove('active');
    }
});

export default router;