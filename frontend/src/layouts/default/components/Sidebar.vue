<template>
  <div class="sidebar">
    <div class="logo">
      <span v-if="appStore.sidebarOpened">Bai's ERP</span>
      <span v-else>ERP</span>
    </div>
    <el-menu
      :collapse="!appStore.sidebarOpened"
      :default-active="route.path"
      router
      background-color="#1f2d3d"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <el-menu-item index="/dashboard">
        <el-icon><HomeFilled /></el-icon>
        <span>仪表盘</span>
      </el-menu-item>
      <el-menu-item index="/orders/list">
        <el-icon><Document /></el-icon>
        <span>订单管理</span>
      </el-menu-item>
      <el-menu-item index="/inventory/list">
        <el-icon><Box /></el-icon>
        <span>库存管理</span>
      </el-menu-item>
      <el-menu-item index="/products/list">
        <el-icon><Goods /></el-icon>
        <span>产品管理</span>
      </el-menu-item>
      <el-menu-item index="/customers/list">
        <el-icon><User /></el-icon>
        <span>客户管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { HomeFilled, Document, Box, Goods, User } from '@element-plus/icons-vue'

const route = useRoute()
const appStore = useAppStore()
</script>

<style scoped>
.sidebar { height: 100vh; background: #1f2d3d; overflow-y: auto; }
.logo { height: 60px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; font-weight: bold; border-bottom: 1px solid #2c3e50; }
.el-menu { border: none; }
</style>
