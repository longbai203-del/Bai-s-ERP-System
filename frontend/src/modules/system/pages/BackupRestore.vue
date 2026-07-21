<!-- 
  文件路径: frontend/src/modules/system/pages/BackupRestore.vue
  功能: 备份恢复 - 数据备份与恢复
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="备份名称">
              <el-input v-model="searchForm.name" placeholder="请输入备份名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 立即备份</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 备份统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in backupStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="name" label="备份名称" />
        <el-table-column prop="size" label="备份大小" width="120" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 'full' ? 'danger' : row.type === 'incremental' ? 'warning' : 'primary'">
              {{ row.type === 'full' ? '全量' : row.type === 'incremental' ? '增量' : '差异' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'success' ? 'success' : row.status === 'running' ? 'warning' : 'danger'">
              {{ row.status === 'success' ? '成功' : row.status === 'running' ? '进行中' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" align="center" width="250" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleDownload(row)"><el-icon><Download /></el-icon> 下载</el-button>
            <el-button type="warning" size="small" @click="handleRestore(row)"><el-icon><Refresh /></el-icon> 恢复</el-button>
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
import { Search, Plus, Download, Refresh, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ name: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const backupStats = ref([
  { label: '备份总数', value: '28', type: 'primary' },
  { label: '总大小', value: '856GB', type: 'success' },
  { label: '最新备份', value: '2024-11-20', type: 'warning' },
  { label: '成功率', value: '98.5%', type: 'primary' },
])

const tableData = ref([
  { id: 1, name: '全量备份-20241120', size: '128GB', type: 'full', status: 'success', createdAt: '2024-11-20 10:30:00' },
  { id: 2, name: '增量备份-20241119', size: '12GB', type: 'incremental', status: 'success', createdAt: '2024-11-19 10:30:00' },
  { id: 3, name: '全量备份-20241118', size: '120GB', type: 'full', status: 'success', createdAt: '2024-11-18 10:30:00' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.name = '' }
const handleCreate = () => { 
  ElMessage.loading('备份进行中...', { duration: 2000 })
  setTimeout(() => { ElMessage.success('备份完成') }, 2000)
}
const handleDownload = (row: any) => { ElMessage.success(`正在下载 ${row.name}`) }
const handleRestore = (row: any) => {
  ElMessageBox.confirm(`确定要从 ${row.name} 恢复数据吗？此操作将覆盖当前数据。`, '警告', { confirmButtonText: '确定恢复', cancelButtonText: '取消', type: 'warning' })
    .then(() => { ElMessage.success('数据恢复成功') }).catch(() => {})
}
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除备份 ${row.name} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
    .then(() => ElMessage.success('删除成功')).catch(() => {})
}
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.stat-row { margin-bottom: 20px; }
.stat-card { text-align: center; border-radius: 12px; }
.stat-card.primary { border-left: 4px solid #409EFF; }
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>