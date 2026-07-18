<template>
  <header class="app-header">
    <div class="header-left">
      <button class="sidebar-toggle" @click="toggleSidebar">
        <el-icon><Expand v-if="!sidebarCollapsed" /><Fold v-else /></el-icon>
      </button>
      <div class="logo">
        <span class="logo-icon">🚗</span>
        <span class="logo-text">Bai's ERP</span>
        <span class="logo-badge">v2.0</span>
      </div>
    </div>

    <div class="header-center">
      <Breadcrumb />
    </div>

    <div class="header-right">
      <!-- 搜索 -->
      <div class="search-box">
        <el-input
          v-model="searchKeyword"
          placeholder="全局搜索..."
          size="small"
          clearable
          @keyup.enter="handleSearch"
          @focus="isSearchFocused = true"
          @blur="isSearchFocused = false"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <div v-if="isSearchFocused && searchKeyword" class="search-dropdown">
          <div class="search-result" v-for="item in searchResults" :key="item.id">
            <span class="result-icon">{{ item.icon }}</span>
            <span class="result-name">{{ item.name }}</span>
            <span class="result-path">{{ item.path }}</span>
          </div>
          <div v-if="searchResults.length === 0" class="search-empty">
            未找到相关结果
          </div>
        </div>
      </div>

      <!-- 通知 -->
      <el-badge :value="notificationCount" :hidden="notificationCount === 0" class="header-badge">
        <el-button circle :icon="Bell" @click="showNotifications" />
      </el-badge>

      <!-- 全屏 -->
      <el-button circle :icon="FullScreen" @click="toggleFullscreen" />

      <!-- 用户 -->
      <el-dropdown @command="handleUserCommand">
        <div class="user-info">
          <el-avatar :size="32" :src="userAvatar" />
          <span class="user-name">{{ userName }}</span>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon> 个人资料
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <el-icon><Setting /></el-icon> 系统设置
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon> 退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Expand, Fold, Search, Bell, FullScreen,
  User, Setting, SwitchButton, ArrowDown
} from '@element-plus/icons-vue'
import Breadcrumb from './Breadcrumb.vue'

const router = useRouter()
const sidebarCollapsed = ref(false)
const searchKeyword = ref('')
const isSearchFocused = ref(false)
const notificationCount = ref(3)
const userName = ref('管理员')
const userAvatar = ref('')

// 搜索结果
const searchResults = computed(() => {
  if (!searchKeyword.value) return []
  // 模拟搜索
  const modules = [
    { id: 1, name: '订单管理', icon: '📋', path: '/orders' },
    { id: 2, name: '产品管理', icon: '📦', path: '/products' },
    { id: 3, name: '客户管理', icon: '👥', path: '/customers' },
    { id: 4, name: '报表中心', icon: '📊', path: '/reports' },
    { id: 5, name: '系统设置', icon: '⚙️', path: '/settings' }
  ]
  return modules.filter(m => 
    m.name.includes(searchKeyword.value) || 
    m.path.includes(searchKeyword.value)
  )
})

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
  // 触发事件
  window.dispatchEvent(new CustomEvent('sidebar-toggle', { 
    detail: { collapsed: sidebarCollapsed.value } 
  }))
}

const handleSearch = () => {
  if (searchResults.value.length > 0) {
    router.push(searchResults.value[0].path)
    searchKeyword.value = ''
    isSearchFocused.value = false
  }
}

const showNotifications = () => {
  ElMessage.info('通知功能开发中')
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

const handleUserCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/login')
      ElMessage.success('已退出登录')
      break
  }
}
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
  background: white;
  border-bottom: 1px solid #E5E7EB;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  flex-shrink: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sidebar-toggle {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #6B7280;
  transition: all 0.2s;
}
.sidebar-toggle:hover {
  background: #F3F4F6;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 18px;
  color: #1F2937;
}
.logo-icon { font-size: 24px; }
.logo-text { color: #1F2937; }
.logo-badge {
  font-size: 10px;
  background: #4F46E5;
  color: white;
  padding: 2px 8px;
  border-radius: 9999px;
  font-weight: 500;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 0 20px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-box {
  position: relative;
  width: 240px;
}
.search-box :deep(.el-input__wrapper) {
  border-radius: 8px;
  background: #F9FAFB;
}
.search-box :deep(.el-input__wrapper:hover) {
  background: #F3F4F6;
}

.search-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
  border: 1px solid #E5E7EB;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  padding: 4px 0;
}

.search-result {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  cursor: pointer;
  transition: all 0.15s;
}
.search-result:hover {
  background: #F3F4F6;
}
.search-result .result-icon { font-size: 16px; }
.search-result .result-name { font-weight: 500; }
.search-result .result-path { font-size: 12px; color: #9CA3AF; margin-left: auto; }

.search-empty {
  padding: 16px;
  text-align: center;
  color: #9CA3AF;
  font-size: 14px;
}

.header-badge {
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 12px 4px 4px;
  border-radius: 9999px;
  transition: all 0.2s;
}
.user-info:hover {
  background: #F3F4F6;
}
.user-info .user-name {
  font-size: 14px;
  font-weight: 500;
  color: #1F2937;
}

@media (max-width: 768px) {
  .header-center { display: none; }
  .search-box { width: 160px; }
  .logo-text { display: none; }
}
</style>
