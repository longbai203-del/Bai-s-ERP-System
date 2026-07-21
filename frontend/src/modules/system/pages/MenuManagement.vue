<!-- 
  文件路径: frontend/src/modules/system/pages/MenuManagement.vue
  功能: 菜单管理 - 管理系统菜单
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="菜单名称">
              <el-input v-model="searchForm.name" placeholder="请输入菜单名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 添加菜单</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" row-key="id" border>
        <el-table-column prop="name" label="菜单名称" />
        <el-table-column prop="icon" label="图标" width="100" align="center">
          <template #default="{ row }">
            <el-icon><component :is="row.icon" /></el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路径" width="180" />
        <el-table-column prop="component" label="组件" width="180" />
        <el-table-column prop="sort" label="排序" align="center" width="80" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '显示' : '隐藏' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon></el-button>
            <el-button type="success" size="small" @click="handleAddChild(row)"><el-icon><Plus /></el-icon></el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)"><el-icon><Delete /></el-icon></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, Edit, Delete, Document, Setting, User, ShoppingCart } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ name: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, name: '仪表盘', icon: 'Document', path: '/dashboard', component: 'Dashboard', sort: 1, status: 'active' },
  { id: 2, name: '销售管理', icon: 'ShoppingCart', path: '/orders', component: 'Orders', sort: 2, status: 'active' },
  { id: 3, name: '采购管理', icon: 'ShoppingCart', path: '/purchase', component: 'Purchase', sort: 3, status: 'active' },
  { id: 4, name: '库存管理', icon: 'Box', path: '/inventory', component: 'Inventory', sort: 4, status: 'active' },
  { id: 5, name: '系统管理', icon: 'Setting', path: '/system', component: 'System', sort: 10, status: 'active' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.name = '' }
const handleCreate = () => { ElMessage.info('添加菜单') }
const handleEdit = (row: any) => { ElMessage.info(`编辑菜单: ${row.name}`) }
const handleAddChild = (row: any) => { ElMessage.info(`为 ${row.name} 添加子菜单`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除菜单 ${row.name} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
    .then(() => ElMessage.success('删除成功')).catch(() => {})
}
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>