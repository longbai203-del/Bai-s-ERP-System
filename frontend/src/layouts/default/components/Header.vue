<template>
  <div class="header">
    <div class="header-left">
      <el-icon :size="20" @click="appStore.toggleSidebar" style="cursor: pointer">
        <Expand v-if="appStore.sidebarOpened" />
        <Fold v-else />
      </el-icon>
      <el-breadcrumb separator="/" style="margin-left: 15px;">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-if="route.meta.title">{{ route.meta.title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="header-right">
      <el-dropdown @command="handleCommand">
        <span class="user-info">
          <el-avatar :size="32" :src="userAvatar" />
          <span style="margin-left: 8px;">{{ username }}</span>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">个人设置</el-dropdown-item>
            <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import { Expand, Fold } from '@element-plus/icons-vue'

const route = useRoute()
const appStore = useAppStore()
const userStore = useUserStore()

const username = computed(() => userStore.realName || userStore.username || 'admin')
const userAvatar = computed(() => userStore.userInfo?.avatar || '')

const handleCommand = (command: string) => {
  if (command === 'logout') {
    userStore.logout()
  } else if (command === 'profile') {
    // 跳转到个人设置
  }
}
</script>

<style scoped>
.header { display: flex; justify-content: space-between; align-items: center; width: 100%; }
.header-left { display: flex; align-items: center; }
.header-right { display: flex; align-items: center; }
.user-info { display: flex; align-items: center; cursor: pointer; }
</style>
