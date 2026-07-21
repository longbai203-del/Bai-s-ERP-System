<!-- 
  文件路径: frontend/src/modules/system/pages/RolePermissions.vue
  功能: 角色权限 - 配置角色权限
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
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button type="primary" @click="handleSave">保存权限</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="菜单权限" name="menu">
          <el-tree
            ref="menuTreeRef"
            :data="menuTreeData"
            show-checkbox
            node-key="id"
            default-expand-all
            :props="{ label: 'label', children: 'children' }"
          />
        </el-tab-pane>
        <el-tab-pane label="按钮权限" name="button">
          <el-tree
            ref="buttonTreeRef"
            :data="buttonTreeData"
            show-checkbox
            node-key="id"
            default-expand-all
            :props="{ label: 'label', children: 'children' }"
          />
        </el-tab-pane>
        <el-tab-pane label="API权限" name="api">
          <el-table :data="apiData" style="width: 100%" stripe>
            <el-table-column type="selection" width="40" />
            <el-table-column prop="method" label="方法" width="80">
              <template #default="{ row }">
                <el-tag :type="row.method === 'GET' ? 'success' : row.method === 'POST' ? 'primary' : row.method === 'PUT' ? 'warning' : 'danger'">
                  {{ row.method }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="path" label="API路径" min-width="200" />
            <el-table-column prop="description" label="描述" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ role: 'admin' })
const activeTab = ref('menu')

const menuTreeData = ref([
  {
    id: 1,
    label: '系统管理',
    children: [
      { id: 11, label: '用户管理' },
      { id: 12, label: '角色管理' },
      { id: 13, label: '菜单管理' },
    ],
  },
  {
    id: 2,
    label: '业务管理',
    children: [
      { id: 21, label: '销售管理' },
      { id: 22, label: '采购管理' },
      { id: 23, label: '库存管理' },
    ],
  },
  {
    id: 3,
    label: '财务管理',
    children: [
      { id: 31, label: '总账' },
      { id: 32, label: '凭证管理' },
      { id: 33, label: '财务报表' },
    ],
  },
])

const buttonTreeData = ref([
  {
    id: 1,
    label: '用户管理',
    children: [
      { id: 11, label: '新增用户' },
      { id: 12, label: '编辑用户' },
      { id: 13, label: '删除用户' },
      { id: 14, label: '重置密码' },
    ],
  },
  {
    id: 2,
    label: '订单管理',
    children: [
      { id: 21, label: '创建订单' },
      { id: 22, label: '编辑订单' },
      { id: 23, label: '删除订单' },
      { id: 24, label: '导出订单' },
    ],
  },
])

const apiData = ref([
  { method: 'GET', path: '/api/users', description: '获取用户列表' },
  { method: 'POST', path: '/api/users', description: '创建用户' },
  { method: 'PUT', path: '/api/users/:id', description: '更新用户' },
  { method: 'DELETE', path: '/api/users/:id', description: '删除用户' },
  { method: 'GET', path: '/api/roles', description: '获取角色列表' },
  { method: 'POST', path: '/api/roles', description: '创建角色' },
])

const handleSearch = () => { ElMessage.success('查询完成') }
const handleSave = () => { ElMessage.success('权限已保存') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>