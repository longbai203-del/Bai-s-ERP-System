<template>
  <aside class="app-sidebar" :class="{ collapsed: isCollapsed }">
    <el-menu
      :default-active="$route.path"
      :collapse="isCollapsed"
      router
      background-color="#1f2937"
      text-color="#9ca3af"
      active-text-color="#818cf8"
    >
      <!-- 仪表板 -->
      <el-menu-item index="/dashboard">
        <el-icon><HomeFilled /></el-icon>
        <span>仪表板</span>
      </el-menu-item>

      <!-- 收银台 -->
      <el-menu-item index="/pos">
        <el-icon><Money /></el-icon>
        <span>收银台</span>
      </el-menu-item>

      <!-- 订单管理 (带子菜单) -->
      <el-sub-menu index="orders-group">
        <template #title>
          <el-icon><Document /></el-icon>
          <span>订单管理</span>
        </template>
        <el-menu-item index="/orders">
          <span>订单列表</span>
        </el-menu-item>
        <el-menu-item index="/orders/create">
          <span>新建订单</span>
        </el-menu-item>
        <el-menu-item index="/orders/returns">
          <span>退货管理</span>
        </el-menu-item>
      </el-sub-menu>

      <!-- 产品管理 (带子菜单) -->
      <el-sub-menu index="products-group">
        <template #title>
          <el-icon><Box /></el-icon>
          <span>产品管理</span>
        </template>
        <el-menu-item index="/products">
          <span>产品列表</span>
        </el-menu-item>
        <el-menu-item index="/products/categories">
          <span>分类管理</span>
        </el-menu-item>
        <el-menu-item index="/products/brands">
          <span>品牌管理</span>
        </el-menu-item>
      </el-sub-menu>

      <!-- 客户管理 -->
      <el-menu-item index="/customers">
        <el-icon><User /></el-icon>
        <span>客户管理</span>
      </el-menu-item>

      <!-- 营销管理 -->
      <el-menu-item index="/marketing">
        <el-icon><Promotion /></el-icon>
        <span>营销管理</span>
      </el-menu-item>

      <!-- 库存管理 (带子菜单) -->
      <el-sub-menu index="inventory-group">
        <template #title>
          <el-icon><Shop /></el-icon>
          <span>库存管理</span>
        </template>
        <el-menu-item index="/inventory">
          <span>库存列表</span>
        </el-menu-item>
        <el-menu-item index="/inventory/stock-adjust">
          <span>库存调整</span>
        </el-menu-item>
      </el-sub-menu>

      <!-- 采购管理 -->
      <el-menu-item index="/purchase">
        <el-icon><ShoppingCart /></el-icon>
        <span>采购管理</span>
      </el-menu-item>

      <!-- 财务管理 -->
      <el-menu-item index="/finance">
        <el-icon><Coin /></el-icon>
        <span>财务管理</span>
      </el-menu-item>

      <!-- 人事管理 -->
      <el-menu-item index="/hr">
        <el-icon><UserFilled /></el-icon>
        <span>人事管理</span>
      </el-menu-item>

      <!-- SaaS管理 -->
      <el-menu-item index="/saas">
        <el-icon><Connection /></el-icon>
        <span>SaaS管理</span>
      </el-menu-item>

      <!-- 系统管理 -->
      <el-menu-item index="/system">
        <el-icon><Setting /></el-icon>
        <span>系统管理</span>
      </el-menu-item>

      <!-- 数据分析 -->
      <el-menu-item index="/analytics">
        <el-icon><TrendCharts /></el-icon>
        <span>数据分析</span>
      </el-menu-item>

      <!-- 报表中心 -->
      <el-menu-item index="/reports">
        <el-icon><PieChart /></el-icon>
        <span>报表中心</span>
      </el-menu-item>

      <!-- AI助手 -->
      <el-menu-item index="/ai">
        <el-icon><Cpu /></el-icon>
        <span>AI助手</span>
      </el-menu-item>
    </el-menu>
  </aside>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {
  HomeFilled, Money, Document, Box, User, Promotion,
  Shop, ShoppingCart, Coin, UserFilled, Connection,
  Setting, TrendCharts, PieChart, Cpu
} from '@element-plus/icons-vue'

const isCollapsed = ref(false)

const handleToggle = (event) => {
  isCollapsed.value = event.detail.collapsed
}

onMounted(() => {
  window.addEventListener('sidebar-toggle', handleToggle)
})

onUnmounted(() => {
  window.removeEventListener('sidebar-toggle', handleToggle)
})
</script>

<style scoped>
.app-sidebar {
  width: 240px;
  height: 100vh;
  background: #1f2937;
  transition: width 0.3s ease;
  flex-shrink: 0;
  overflow: hidden;
}
.app-sidebar.collapsed { width: 64px; }
.app-sidebar :deep(.el-menu) {
  border-right: none;
  height: 100%;
  padding: 8px 0;
}
.app-sidebar :deep(.el-menu-item) {
  height: 44px;
  border-radius: 8px;
  margin: 2px 8px;
}
.app-sidebar :deep(.el-menu-item.is-active) {
  background: rgba(129, 140, 248, 0.15) !important;
}
.app-sidebar :deep(.el-sub-menu .el-sub-menu__title) {
  height: 44px;
  border-radius: 8px;
  margin: 2px 8px;
}
.app-sidebar :deep(.el-sub-menu .el-sub-menu__title:hover) {
  background: rgba(255, 255, 255, 0.05) !important;
}
</style>
