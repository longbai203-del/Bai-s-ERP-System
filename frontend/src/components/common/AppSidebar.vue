<template>
  <aside class="app-sidebar" :class="{ collapsed: isCollapsed }">
    <!-- 菜单 -->
    <el-menu
      :default-active="activeMenu"
      :collapse="isCollapsed"
      :collapse-transition="false"
      router
      background-color="#1F2937"
      text-color="#9CA3AF"
      active-text-color="#818CF8"
    >
      <el-menu-item index="/dashboard">
        <el-icon><HomeFilled /></el-icon>
        <span>仪表板</span>
      </el-menu-item>

      <el-menu-item index="/pos">
        <el-icon><CashRegister /></el-icon>
        <span>收银台</span>
      </el-menu-item>

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
        <el-menu-item index="/products/inventory">
          <span>库存管理</span>
        </el-menu-item>
      </el-sub-menu>

      <el-menu-item index="/customers">
        <el-icon><User /></el-icon>
        <span>客户管理</span>
      </el-menu-item>

      <el-menu-item index="/marketing">
        <el-icon><Promotion /></el-icon>
        <span>营销管理</span>
      </el-menu-item>

      <el-sub-menu index="inventory-group">
        <template #title>
          <el-icon><Inventory /></el-icon>
          <span>库存管理</span>
        </template>
        <el-menu-item index="/inventory">
          <span>库存列表</span>
        </el-menu-item>
        <el-menu-item index="/inventory/stock-adjust">
          <span>库存调整</span>
        </el-menu-item>
      </el-sub-menu>

      <el-menu-item index="/purchase">
        <el-icon><ShoppingCart /></el-icon>
        <span>采购管理</span>
      </el-menu-item>

      <el-menu-item index="/finance">
        <el-icon><Money /></el-icon>
        <span>财务管理</span>
      </el-menu-item>

      <el-menu-item index="/hr">
        <el-icon><UserFilled /></el-icon>
        <span>人事管理</span>
      </el-menu-item>

      <el-menu-item index="/saas">
        <el-icon><Connection /></el-icon>
        <span>SaaS管理</span>
      </el-menu-item>

      <el-menu-item index="/system">
        <el-icon><Setting /></el-icon>
        <span>系统管理</span>
      </el-menu-item>

      <el-sub-menu index="analytics-group">
        <template #title>
          <el-icon><DataAnalysis /></el-icon>
          <span>数据分析</span>
        </template>
        <el-menu-item index="/analytics">
          <span>分析概览</span>
        </el-menu-item>
        <el-menu-item index="/reports">
          <span>报表中心</span>
        </el-menu-item>
      </el-sub-menu>

      <el-menu-item index="/ai">
        <el-icon><Cpu /></el-icon>
        <span>AI助手</span>
      </el-menu-item>
    </el-menu>

    <!-- 底部信息 -->
    <div class="sidebar-footer" v-if="!isCollapsed">
      <div class="version">v2.0.0</div>
      <div class="status">
        <span class="status-dot"></span>
        系统运行中
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  HomeFilled, CashRegister, Document, Box, User, Promotion,
  Inventory, ShoppingCart, Money, UserFilled, Connection,
  Setting, DataAnalysis, Cpu
} from '@element-plus/icons-vue'

const route = useRoute()
const isCollapsed = ref(false)

const activeMenu = computed(() => {
  return route.path
})

// 监听侧边栏切换事件
const handleSidebarToggle = (event: CustomEvent) => {
  isCollapsed.value = event.detail.collapsed
}

onMounted(() => {
  window.addEventListener('sidebar-toggle', handleSidebarToggle as EventListener)
})

onUnmounted(() => {
  window.removeEventListener('sidebar-toggle', handleSidebarToggle as EventListener)
})
</script>

<style scoped>
.app-sidebar {
  width: 240px;
  height: 100vh;
  background: #1F2937;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  overflow: hidden;
}

.app-sidebar.collapsed {
  width: 64px;
}

.app-sidebar :deep(.el-menu) {
  border-right: none;
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.app-sidebar :deep(.el-menu-item) {
  height: 44px;
  line-height: 44px;
  border-radius: 8px;
  margin: 2px 8px;
}

.app-sidebar :deep(.el-menu-item.is-active) {
  background: rgba(129, 140, 248, 0.15) !important;
}

.app-sidebar :deep(.el-menu-item:hover) {
  background: rgba(255, 255, 255, 0.05) !important;
}

.app-sidebar :deep(.el-sub-menu .el-sub-menu__title) {
  height: 44px;
  line-height: 44px;
  border-radius: 8px;
  margin: 2px 8px;
}
.app-sidebar :deep(.el-sub-menu .el-sub-menu__title:hover) {
  background: rgba(255, 255, 255, 0.05) !important;
}

.app-sidebar :deep(.el-menu--collapse .el-menu-item) {
  margin: 2px 4px;
}

.sidebar-footer {
  padding: 12px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  color: #6B7280;
  font-size: 12px;
  flex-shrink: 0;
}

.sidebar-footer .version {
  margin-bottom: 4px;
}

.sidebar-footer .status {
  display: flex;
  align-items: center;
  gap: 6px;
}

.sidebar-footer .status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10B981;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
</style>
