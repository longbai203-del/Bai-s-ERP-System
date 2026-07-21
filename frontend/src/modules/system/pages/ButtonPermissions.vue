<!-- 
  文件路径: frontend/src/modules/system/pages/ButtonPermissions.vue
  功能: 按钮权限 - 管理按钮级权限
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="页面">
              <el-select v-model="searchForm.page" placeholder="请选择页面" style="width: 100%">
                <el-option label="用户管理" value="users" />
                <el-option label="角色管理" value="roles" />
                <el-option label="订单管理" value="orders" />
              </el-select>
            </el-form-item>
          </el-col>
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
              <el-button type="primary" @click="handleSave">保存</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" style="width: 100%" stripe>
        <el-table-column prop="buttonName" label="按钮名称" />
        <el-table-column prop="code" label="按钮编码" />
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

const searchForm = reactive({ page: 'users', role: 'admin' })

const tableData = ref([
  { id: 1, buttonName: '新增用户', code: 'user:add', checked: true, description: '允许新增用户' },
  { id: 2, buttonName: '编辑用户', code: 'user:edit', checked: true, description: '允许编辑用户信息' },
  { id: 3, buttonName: '删除用户', code: 'user:delete', checked: false, description: '允许删除用户' },
  { id: 4, buttonName: '重置密码', code: 'user:resetPwd', checked: false, description: '允许重置用户密码' },
  { id: 5, buttonName: '导出用户', code: 'user:export', checked: true, description: '允许导出用户列表' },
])

const handleSearch = () => { ElMessage.success('查询完成') }
const handleSave = () => { ElMessage.success('权限已保存') }
const handleSwitchChange = (row: any) => { ElMessage.info(`${row.buttonName} 权限已${row.checked ? '启用' : '禁用'}`) }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>