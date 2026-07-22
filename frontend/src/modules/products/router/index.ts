// products 模块路由配置
import type { RouteRecordRaw } from 'vue-router'

const productsRoutes: RouteRecordRaw[] = [
    {
        path: '',
        redirect: '/products/'
    },
    {
        path: '/products/',
        name: 'productsBarcodes',
        component: () => import('../pages/Barcodes.vue'),
        meta: {
            title: 'Barcodes',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/products/',
        name: 'productsBrands',
        component: () => import('../pages/Brands.vue'),
        meta: {
            title: 'Brands',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/products/',
        name: 'productsCategories',
        component: () => import('../pages/Categories.vue'),
        meta: {
            title: 'Categories',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/products/',
        name: 'productsCombos',
        component: () => import('../pages/Combos.vue'),
        meta: {
            title: 'Combos',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/products/',
        name: 'productsCreate',
        component: () => import('../pages/Create.vue'),
        meta: {
            title: 'Create',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/products/',
        name: 'productsDetail',
        component: () => import('../pages/Detail.vue'),
        meta: {
            title: 'Detail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/products/',
        name: 'productsEdit',
        component: () => import('../pages/Edit.vue'),
        meta: {
            title: 'Edit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/products/',
        name: 'productsFinanceDashboard',
        component: () => import('../pages/FinanceDashboard.vue'),
        meta: {
            title: 'FinanceDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/products/',
        name: 'productsIndex',
        component: () => import('../pages/Index.vue'),
        meta: {
            title: 'Index',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/products/',
        name: 'productsInventoryDashboard',
        component: () => import('../pages/InventoryDashboard.vue'),
        meta: {
            title: 'InventoryDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/products/',
        name: 'productsModifiers',
        component: () => import('../pages/Modifiers.vue'),
        meta: {
            title: 'Modifiers',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/products/',
        name: 'productsOverview',
        component: () => import('../pages/Overview.vue'),
        meta: {
            title: 'Overview',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/products/',
        name: 'productsPriceLists',
        component: () => import('../pages/PriceLists.vue'),
        meta: {
            title: 'PriceLists',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/products/',
        name: 'productsProducts',
        component: () => import('../pages/Products.vue'),
        meta: {
            title: 'Products',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/products/',
        name: 'productsProductsCreate',
        component: () => import('../pages/ProductsCreate.vue'),
        meta: {
            title: 'ProductsCreate',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/products/',
        name: 'productsProductsDetail',
        component: () => import('../pages/ProductsDetail.vue'),
        meta: {
            title: 'ProductsDetail',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/products/',
        name: 'productsProductsEdit',
        component: () => import('../pages/ProductsEdit.vue'),
        meta: {
            title: 'ProductsEdit',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/products/',
        name: 'productsProductsList',
        component: () => import('../pages/ProductsList.vue'),
        meta: {
            title: 'ProductsList',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/products/',
        name: 'productsReportDashboard',
        component: () => import('../pages/ReportDashboard.vue'),
        meta: {
            title: 'ReportDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/products/',
        name: 'productsSalesDashboard',
        component: () => import('../pages/SalesDashboard.vue'),
        meta: {
            title: 'SalesDashboard',
            icon: 'Document',
            requiresAuth: true
        }
    },
    {
        path: '/products/',
        name: 'productsVariants',
        component: () => import('../pages/Variants.vue'),
        meta: {
            title: 'Variants',
            icon: 'Document',
            requiresAuth: true
        }
    }
]

export default productsRoutes
