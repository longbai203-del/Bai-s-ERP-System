<!-- 
  文件路径: frontend/src/modules/system/pages/WebhookManagement.vue
  功能: Webhook管理 - 管理Webhook配置
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="Webhook名称">
              <el-input v-model="searchForm.name" placeholder="请输入Webhook名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="启用" value="active" />
                <el-option label="禁用" value="inactive" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 创建Webhook</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="name" label="Webhook名称" />
        <el-table-column prop="url" label="URL" min-width="250" />
        <el-table-column prop="events" label="触发事件" width="200">
          <template #default="{ row }">
            <el-tag v-for="event in row.events" :key="event" size="small" style="margin: 2px;">
              {{ event }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastTrigger" label="最后触发" width="180" />
        <el-table-column label="操作" align="center" width="250" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleTest(row)"><el-icon><Monitor /></el-icon> 测试</el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon></el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)"><el-icon><Delete /></el-icon></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, Monitor, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ name: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, name: '订单通知', url: 'https://api.example.com/webhook/order', events: ['order.created', 'order.updated'], status: 'active', lastTrigger: '2024-11-20 10:30:00' },
  { id: 2, name: '库存预警', url: 'https://api.example.com/webhook/inventory', events: ['inventory.low'], status: 'active', lastTrigger: '2024-11-19 14:20:00' },
  { id: 3, name: '用户同步', url: 'https://api.example.com/webhook/user', events: ['user.created', 'user.updated', 'user.deleted'], status: 'inactive', lastTrigger: '2024-11-15 09:00:00' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.name = ''; searchForm.status = '' }
const handleCreate = () => { ElMessage.info('创建Webhook') }
const handleTest = (row: any) => { 
  ElMessage.loading(`测试 ${row.name}...`, { duration: 1500 })
  setTimeout(() => { ElMessage.success(`${row.name} 测试成功`) }, 1500)
}
const handleEdit = (row: any) => { ElMessage.info(`编辑Webhook: ${row.name}`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除Webhook ${row.name} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
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