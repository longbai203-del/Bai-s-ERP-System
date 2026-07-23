<template>
  <div class="header">
    <!-- 左侧 -->
    <div class="header-left">
      <el-icon
        :size="20"
        @click="toggleSidebar"
        style="cursor: pointer"
      >
        <Expand v-if="sidebarOpened" />
        <Fold v-else />
      </el-icon>
      
      <el-breadcrumb separator="/" style="margin-left: 15px;">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">
          首页
        </el-breadcrumb-item>
        <el-breadcrumb-item v-if="route.meta.title">
          {{ route.meta.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <!-- 右侧 -->
    <div class="header-right">
      <!-- 搜索 -->
      <el-input
        v-model="searchKeyword"
        placeholder="搜索..."
        prefix-icon="Search"
        size="small"
        style="width: 200px; margin-right: 15px;"
        @keyup.enter="handleSearch"
      />
      
      <!-- 通知 -->
      <el-badge :value="notificationCount" :hidden="notificationCount === 0" style="margin-right: 15px;">
        <el-button :icon="Bell" circle size="small" @click="openNotifications" />
      </el-badge>
      
      <!-- 用户 -->
      <el-dropdown @command="handleCommand">
        <span class="user-info">
          <el-avatar :size="32" :src="userAvatar" />
          <span style="margin-left: 8px;">{{ displayName }}</span>
          <el-icon style="margin-left: 4px;"><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon> 个人设置
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import { ElMessage } from 'element-plus'
import {
  Expand,
  Fold,
  Bell,
  ArrowDown,
  User,
  Setting,
  SwitchButton,
  Search
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const searchKeyword = ref('')
const notificationCount = ref(3)

const sidebarOpened = computed(() => appStore.sidebarOpened)
const userAvatar = computed(() => userStore.userInfo?.avatar || '')
const displayName = computed(() => userStore.realName || userStore.username || '用户')

const toggleSidebar = () => {
  appStore.toggleSidebar()
}

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    ElMessage.info(`搜索: ${searchKeyword.value}`)
  }
}

const openNotifications = () => {
  ElMessage.info('打开通知中心')
}

const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/settings/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      userStore.logout()
      break
  }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 20px;
}
.header-left {
  display: flex;
  align-items: center;
}
.header-right {
  display: flex;
  align-items: center;
}
.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}
.user-info:hover {
  background-color: #f5f7fa;
}
</style>
