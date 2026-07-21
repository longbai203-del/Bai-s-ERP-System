<!-- 
  文件路径: frontend/src/modules/system/pages/ThemeManagement.vue
  功能: 主题管理 - 管理系统主题
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="主题名称">
              <el-input v-model="searchForm.name" placeholder="请输入主题名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 创建主题</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-row :gutter="20">
      <el-col :span="8" v-for="theme in tableData" :key="theme.id">
        <el-card class="theme-card" :class="{ 'theme-active': theme.isDefault }">
          <div class="theme-preview" :style="{ background: theme.primaryColor }"></div>
          <div class="theme-info">
            <div class="theme-name">
              {{ theme.name }}
              <el-tag v-if="theme.isDefault" type="success" size="small">默认</el-tag>
            </div>
            <div class="theme-colors">
              <span class="color-dot" :style="{ background: theme.primaryColor }" />
              <span class="color-dot" :style="{ background: theme.secondaryColor }" />
              <span class="color-dot" :style="{ background: theme.backgroundColor }" />
            </div>
          </div>
          <div class="theme-actions">
            <el-button type="primary" size="small" @click="handleApply(theme)" v-if="!theme.isDefault">应用</el-button>
            <el-button type="warning" size="small" @click="handleEdit(theme)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(theme)" v-if="!theme.isDefault">删除</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ name: '' })

const tableData = ref([
  { id: 1, name: '默认主题', primaryColor: '#409EFF', secondaryColor: '#67C23A', backgroundColor: '#F0F2F5', isDefault: true },
  { id: 2, name: '暗色主题', primaryColor: '#1A1A2E', secondaryColor: '#2D2D44', backgroundColor: '#0D0D1A', isDefault: false },
  { id: 3, name: '绿色主题', primaryColor: '#1ABC9C', secondaryColor: '#2ECC71', backgroundColor: '#E8F8F5', isDefault: false },
  { id: 4, name: '紫色主题', primaryColor: '#9B59B6', secondaryColor: '#8E44AD', backgroundColor: '#F4ECF7', isDefault: false },
])

const handleSearch = () => { ElMessage.success('查询完成') }
const handleReset = () => { searchForm.name = '' }
const handleCreate = () => { ElMessage.info('创建主题') }
const handleApply = (theme: any) => { 
  tableData.value.forEach(t => t.isDefault = false)
  theme.isDefault = true
  ElMessage.success(`已应用 ${theme.name}`)
}
const handleEdit = (theme: any) => { ElMessage.info(`编辑主题: ${theme.name}`) }
const handleDelete = (theme: any) => {
  ElMessageBox.confirm(`确定要删除主题 ${theme.name} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
    .then(() => ElMessage.success('删除成功')).catch(() => {})
}
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.theme-card { border-radius: 12px; overflow: hidden; transition: all 0.3s; }
.theme-card:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(0,0,0,0.12); }
.theme-active { border: 2px solid #409EFF; }
.theme-preview { height: 60px; }
.theme-info { padding: 12px 16px; }
.theme-name { font-weight: 600; font-size: 15px; display: flex; justify-content: space-between; align-items: center; }
.theme-colors { margin-top: 8px; display: flex; gap: 8px; }
.color-dot { width: 24px; height: 24px; border-radius: 50%; display: inline-block; border: 1px solid #e4e7ed; }
.theme-actions { padding: 8px 16px 16px; display: flex; gap: 8px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>