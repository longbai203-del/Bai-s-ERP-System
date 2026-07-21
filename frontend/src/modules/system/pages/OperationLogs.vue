<!-- 
  文件路径: frontend/src/modules/system/pages/OperationLogs.vue
  功能: 操作日志 - 查看用户操作记录
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="操作人">
              <el-input v-model="searchForm.operator" placeholder="请输入操作人" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="操作类型">
              <el-select v-model="searchForm.type" placeholder="请选择类型" clearable style="width: 100%">
                <el-option label="新增" value="create" />
                <el-option label="编辑" value="update" />
                <el-option label="删除" value="delete" />
                <el-option label="查询" value="query" />
                <el-option label="导出" value="export" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="模块">
              <el-select v-model="searchForm.module" placeholder="请选择模块" clearable style="width: 100%">
                <el-option label="用户管理" value="users" />
                <el-option label="订单管理" value="orders" />
                <el-option label="产品管理" value="products" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="id" label="日志ID" width="80" />
        <el-table-column prop="operator" label="操作人" />
        <el-table-column prop="type" label="操作类型" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 'create' ? 'success' : row.type === 'update' ? 'warning' : row.type === 'delete' ? 'danger' : 'info'">
              {{ row.type === 'create' ? '新增' : row.type === 'update' ? '编辑' : row.type === 'delete' ? '删除' : row.type === 'query' ? '查询' : '导出' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="module" label="模块" width="100" />
        <el-table-column prop="operation" label="操作内容" min-width="200" />
        <el-table-column prop="ip" label="IP地址" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'success' ? 'success' : 'danger'">
              {{ row.status === 'success' ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="操作时间" width="180" />
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ operator: '', type: '', module: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, operator: 'Ahmed Al-Fahd', type: 'create', module: '用户管理', operation: '新增用户 Ahmed Al-Fahd', ip: '192.168.1.100', status: 'success', createdAt: '2024-11-20 10:30:00' },
  { id: 2, operator: 'Mohammed Al-Qahtani', type: 'update', module: '订单管理', operation: '修改订单 SO-2024-001 状态', ip: '192.168.1.101', status: 'success', createdAt: '2024-11-20 09:15:00' },
  { id: 3, operator: 'Saud Al-Otaibi', type: 'delete', module: '产品管理', operation: '删除产品 三星 Galaxy S22', ip: '192.168.1.102', status: 'success', createdAt: '2024-11-20 08:45:00' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.operator = ''; searchForm.type = ''; searchForm.module = '' }
const handleExport = () => { ElMessage.success('导出完成') }
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>