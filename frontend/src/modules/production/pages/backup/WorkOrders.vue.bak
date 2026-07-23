<!-- 
  文件路径: frontend/src/modules/production/pages/WorkOrders.vue
  功能: 工单管理 - 生产工单管理
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="工单号">
              <el-input v-model="searchForm.workOrderNo" placeholder="请输入工单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="产品名称">
              <el-input v-model="searchForm.product" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="待生产" value="pending" />
                <el-option label="生产中" value="processing" />
                <el-option label="已完成" value="completed" />
                <el-option label="已取消" value="cancelled" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新建工单</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in workOrderStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="workOrderNo" label="工单号" width="140" />
        <el-table-column prop="product" label="产品名称" />
        <el-table-column prop="quantity" label="计划数量" align="center" />
        <el-table-column prop="completedQuantity" label="完成数量" align="center" />
        <el-table-column label="完成率" align="center" width="120">
          <template #default="{ row }">
            <el-progress :percentage="row.completionRate" :color="row.completionRate === 100 ? '#67C23A' : '#409EFF'" />
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.priority === 'high' ? 'danger' : row.priority === 'medium' ? 'warning' : 'info'">
              {{ row.priority === 'high' ? '高' : row.priority === 'medium' ? '中' : '低' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'completed' ? 'success' : row.status === 'processing' ? 'warning' : row.status === 'pending' ? 'info' : 'danger'">
              {{ row.status === 'pending' ? '待生产' : row.status === 'processing' ? '生产中' : row.status === 'completed' ? '已完成' : '已取消' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deadline" label="截止日期" width="120" />
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon></el-button>
            <el-button type="success" size="small" @click="handleStart(row)" v-if="row.status === 'pending'"><el-icon><VideoPlay /></el-icon> 开始</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Download, Plus, View, Edit, VideoPlay } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ workOrderNo: '', product: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const workOrderStats = ref([
  { label: '总工单', value: '86', type: 'primary' },
  { label: '待生产', value: '28', type: 'info' },
  { label: '生产中', value: '32', type: 'warning' },
  { label: '已完成', value: '26', type: 'success' },
])

const tableData = ref([
  { id: 1, workOrderNo: 'WO-2024-001', product: 'iPhone 15 Pro Max', quantity: 500, completedQuantity: 380, completionRate: 76, priority: 'high', status: 'processing', deadline: '2024-12-20' },
  { id: 2, workOrderNo: 'WO-2024-002', product: '三星 Galaxy S24 Ultra', quantity: 300, completedQuantity: 0, completionRate: 0, priority: 'medium', status: 'pending', deadline: '2024-12-25' },
  { id: 3, workOrderNo: 'WO-2024-003', product: 'MacBook Pro 16"', quantity: 150, completedQuantity: 150, completionRate: 100, priority: 'high', status: 'completed', deadline: '2024-12-15' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.workOrderNo = ''; searchForm.product = ''; searchForm.status = '' }
const handleExport = () => { ElMessage.success('导出完成') }
const handleCreate = () => { ElMessage.info('新建工单') }
const handleView = (row: any) => { ElMessage.info(`查看工单: ${row.workOrderNo}`) }
const handleEdit = (row: any) => { ElMessage.info(`编辑工单: ${row.workOrderNo}`) }
const handleStart = (row: any) => {
  ElMessageBox.confirm(`确认开始工单 ${row.workOrderNo}？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' })
    .then(() => { row.status = 'processing'; ElMessage.success('工单已开始') }).catch(() => {})
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
.stat-card.info { border-left: 4px solid #909399; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>