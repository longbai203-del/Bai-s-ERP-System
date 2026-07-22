<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '220px'" class="sidebar">
      <div class="logo">
        <span v-if="!isCollapse">Bai's ERP</span>
        <span v-else>ERP</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        router
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataLine /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        <el-menu-item index="/customers">
          <el-icon><User /></el-icon>
          <span>客户管理</span>
        </el-menu-item>
        <el-menu-item index="/orders">
          <el-icon><Document /></el-icon>
          <span>订单管理</span>
        </el-menu-item>
        <el-menu-item index="/inventory">
          <el-icon><Box /></el-icon>
          <span>库存管理</span>
        </el-menu-item>
        <el-menu-item index="/finance">
          <el-icon><Money /></el-icon>
          <span>财务管理</span>
        </el-menu-item>
        <el-menu-item index="/hr">
          <el-icon><UserFilled /></el-icon>
          <span>人力资源管理</span>
        </el-menu-item>
        <el-menu-item index="/production">
          <el-icon><Setting /></el-icon>
          <span>生产管理</span>
        </el-menu-item>
        <el-menu-item index="/purchase">
          <el-icon><ShoppingCart /></el-icon>
          <span>采购管理</span>
        </el-menu-item>
        <el-menu-item index="/reports">
          <el-icon><PieChart /></el-icon>
          <span>报表中心</span>
        </el-menu-item>
        <el-menu-item index="/settings">
          <el-icon><Tools /></el-icon>
          <span>系统设置</span>
        </el-menu-item>
        <el-menu-item index="/ai">
          <el-icon><Cpu /></el-icon>
          <span>AI 中心</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主内容 -->
    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-icon @click="toggleCollapse">
            <Expand v-if="isCollapse" />
            <Fold v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
              {{ item.meta?.title || item.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="32" />
              <span class="username">管理员</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="logout" divided>
                  <span style="color: #f56c6c;">退出登录</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Expand,
  Fold,
  ArrowDown,
  DataLine,
  User,
  Document,
  Box,
  Money,
  UserFilled,
  Setting,
  ShoppingCart,
  PieChart,
  Tools,
  Cpu
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const isCollapse = ref(false)

const activeMenu = computed(() => route.path)
const breadcrumbs = computed(() => {
  return route.matched.filter(item => item.meta?.title)
})

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const handleCommand = (command: string) => {
  if (command === 'logout') {
    localStorage.removeItem('token')
    router.push('/login')
  } else if (command === 'profile') {
    router.push('/profile')
  }
}
</script>

<style scoped>
.layout-container { height: 100vh; }
.sidebar {
  background-color: #304156;
  height: 100vh;
  overflow: hidden;
  transition: width 0.3s;
}
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  color: white;
  font-size: 20px;
  font-weight: bold;
  background-color: #2b3a4e;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 20px;
  height: 60px;
}
.header-left { display: flex; align-items: center; gap: 16px; }
.header-right { display: flex; align-items: center; gap: 20px; }
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.username { font-size: 14px; color: #333; }
.main-content {
  background-color: #f0f2f5;
  padding: 20px;
  height: calc(100vh - 60px);
  overflow-y: auto;
}
</style>
