<template>
  <div class="app-layout">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="sidebarWidth" class="app-aside">
        <AppSidebar />
      </el-aside>
      
      <el-container>
        <!-- 头部 -->
        <el-header height="60px" class="app-header">
          <AppHeader />
        </el-header>
        
        <!-- 内容 -->
        <el-main class="app-main">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/store/modules/app'
import AppSidebar from './components/Sidebar.vue'
import AppHeader from './components/Header.vue'

const appStore = useAppStore()

const sidebarWidth = computed(() => appStore.sidebarOpened ? '240px' : '64px')
</script>

<style scoped>
.app-layout {
  height: 100vh;
  overflow: hidden;
}
.app-aside {
  background: #1f2d3d;
  transition: width 0.3s;
  overflow: hidden;
}
.app-header {
  background: #ffffff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  padding: 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}
.app-main {
  background: #f0f2f5;
  padding: 20px;
  overflow-y: auto;
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
