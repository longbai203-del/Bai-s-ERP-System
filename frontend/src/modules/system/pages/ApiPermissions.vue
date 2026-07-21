<!-- 
  文件路径: frontend/src/modules/system/pages/ApiPermissions.vue
  功能: API权限 - 管理API接口权限
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="角色">
              <el-select v-model="searchForm.role" placeholder="请选择角色" style="width: 100%">
                <el-option label="超级管理员" value="admin" />
                <el-option label="部门经理" value="manager" />
                <el-option label="普通用户" value="user" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="模块">
              <el-select v-model="searchForm.module" placeholder="请选择模块" style="width: 100%">
                <el-option label="全部" value="all" />
                <el-option label="用户管理" value="users" />
                <el-option label="订单管理" value="orders" />
                <el-option label="产品管理" value="products" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button type="primary" @click="handleSave">保存</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" style="width: 100%" stripe>
        <el-table-column prop="module" label="模块" width="120" />
        <el-table-column prop="api" label="API接口" min-width="200" />
        <el-table-column prop="method" label="方法" width="80">
          <template #default="{ row }">
            <el-tag :type="row.method === 'GET' ? 'success' : row.method === 'POST' ? 'primary' : row.method === 'PUT' ? 'warning' : 'danger'">
              {{ row.method }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="权限状态" align="center" width="120">
          <template #default="{ row }">
            <el-switch v-model="row.checked" @change="handleSwitchChange(row)" />
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ role: 'admin', module: 'all' })

const tableData = ref([
  { id: 1, module: '用户管理', api: '/api/users', method: 'GET', checked: true, description: '获取用户列表' },
  { id: 2, module: '用户管理', api: '/api/users', method: 'POST', checked: true, description: '创建用户' },
  { id: 3, module: '用户管理', api: '/api/users/:id', method: 'PUT', checked: false, description: '更新用户' },
  { id: 4, module: '用户管理', api: '/api/users/:id', method: 'DELETE', checked: false, description: '删除用户' },
  { id: 5, module: '订单管理', api: '/api/orders', method: 'GET', checked: true, description: '获取订单列表' },
  { id: 6, module: '订单管理', api: '/api/orders', method: 'POST', checked: true, description: '创建订单' },
])

const handleSearch = () => { ElMessage.success('查询完成') }
const handleSave = () => { ElMessage.success('权限已保存') }
const handleSwitchChange = (row: any) => { ElMessage.info(`${row.api} 权限已${row.checked ? '启用' : '禁用'}`) }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>