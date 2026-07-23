<template>
  <div class="sidebar">
    <!-- Logo -->
    <div class="logo" @click="goHome">
      <img v-if="logoUrl" :src="logoUrl" alt="Logo" />
      <span v-else>{{ appName }}</span>
    </div>
    
    <!-- 菜单 -->
    <el-menu
      :collapse="!sidebarOpened"
      :default-active="activeMenu"
      :unique-opened="true"
      router
      background-color="#1f2d3d"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <template v-for="menu in menus" :key="menu.path">
        <!-- 子菜单 -->
        <el-sub-menu v-if="menu.children && menu.children.length" :index="menu.path">
          <template #title>
            <el-icon v-if="menu.icon"><component :is="menu.icon" /></el-icon>
            <span>{{ menu.title }}</span>
          </template>
          <el-menu-item
            v-for="child in menu.children"
            :key="child.path"
            :index="child.path"
          >
            <el-icon v-if="child.icon"><component :is="child.icon" /></el-icon>
            <span>{{ child.title }}</span>
          </el-menu-item>
        </el-sub-menu>
        
        <!-- 菜单项 -->
        <el-menu-item v-else :index="menu.path">
          <el-icon v-if="menu.icon"><component :is="menu.icon" /></el-icon>
          <span>{{ menu.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import {
  HomeFilled,
  Document,
  Box,
  Goods,
  User,
  Money,
  OfficeBuilding,
  ShoppingCart,
  Setting,
  DataAnalysis,
  Management,
  ChatDotRound,
  TrendCharts
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const appName = import.meta.env.VITE_APP_NAME || 'Bai\'s ERP'
const logoUrl = import.meta.env.VITE_APP_LOGO || ''

const sidebarOpened = computed(() => appStore.sidebarOpened)
const activeMenu = computed(() => route.path)

const menus = [
  {
    path: '/dashboard',
    title: '仪表盘',
    icon: HomeFilled,
    children: [
      { path: '/dashboard', title: '工作台' },
      { path: '/dashboard/overview', title: '概览' }
    ]
  },
  {
    path: '/orders',
    title: '订单管理',
    icon: Document,
    children: [
      { path: '/orders/list', title: '订单列表' },
      { path: '/orders/create', title: '创建订单' }
    ]
  },
  {
    path: '/inventory',
    title: '库存管理',
    icon: Box,
    children: [
      { path: '/inventory/list', title: '库存列表' },
      { path: '/inventory/stock-adjustment', title: '库存调整' }
    ]
  },
  {
    path: '/products',
    title: '产品管理',
    icon: Goods,
    children: [
      { path: '/products/list', title: '产品列表' },
      { path: '/products/create', title: '创建产品' }
    ]
  },
  {
    path: '/customers',
    title: '客户管理',
    icon: User,
    children: [
      { path: '/customers/list', title: '客户列表' },
      { path: '/customers/create', title: '创建客户' }
    ]
  },
  {
    path: '/finance',
    title: '财务管理',
    icon: Money,
    children: [
      { path: '/finance/transactions', title: '交易记录' },
      { path: '/finance/accounts', title: '账户管理' }
    ]
  },
  {
    path: '/hr',
    title: '人力资源管理',
    icon: OfficeBuilding,
    children: [
      { path: '/hr/employees', title: '员工管理' },
      { path: '/hr/attendance', title: '考勤管理' }
    ]
  },
  {
    path: '/purchase',
    title: '采购管理',
    icon: ShoppingCart,
    children: [
      { path: '/purchase/list', title: '采购列表' },
      { path: '/purchase/create', title: '创建采购' }
    ]
  },
  {
    path: '/system',
    title: '系统管理',
    icon: Setting,
    children: [
      { path: '/system/users', title: '用户管理' },
      { path: '/system/roles', title: '角色管理' },
      { path: '/system/permissions', title: '权限管理' }
    ]
  },
  {
    path: '/reports',
    title: '数据分析',
    icon: DataAnalysis,
    children: [
      { path: '/reports/sales', title: '销售报表' },
      { path: '/reports/inventory', title: '库存报表' }
    ]
  },
  {
    path: '/settings',
    title: '系统设置',
    icon: Management,
    children: [
      { path: '/settings/general', title: '通用设置' },
      { path: '/settings/email', title: '邮件设置' }
    ]
  }
]

const goHome = () => {
  router.push('/dashboard')
}
</script>

<style scoped>
.sidebar {
  height: 100vh;
  background: #1f2d3d;
  overflow-y: auto;
  overflow-x: hidden;
}
.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  font-weight: bold;
  border-bottom: 1px solid #2c3e50;
  cursor: pointer;
}
.logo img {
  height: 36px;
  object-fit: contain;
}
.el-menu {
  border: none;
}
.el-menu-item.is-active {
  background-color: rgba(64, 158, 255, 0.1) !important;
}
</style>
