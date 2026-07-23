<template>
  <div class="app-layout">
    <el-container>
      <el-aside :width="sidebarWidth">
        <app-sidebar />
      </el-aside>
      <el-container>
        <el-header height="60px">
          <app-header />
        </el-header>
        <el-main>
          <router-view />
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
.app-layout { height: 100vh; }
.el-aside { background: #1f2d3d; transition: width 0.3s; overflow: hidden; }
.el-header { background: #fff; border-bottom: 1px solid #e4e7ed; display: flex; align-items: center; padding: 0 20px; }
.el-main { background: #f0f2f5; padding: 20px; overflow-y: auto; }
</style>
