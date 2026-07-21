<!-- 
  文件路径: frontend/src/modules/project/pages/Projects.vue
  功能: 项目列表 - 管理所有项目
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="项目名称">
              <el-input v-model="searchForm.name" placeholder="请输入项目名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="规划中" value="planning" />
                <el-option label="进行中" value="active" />
                <el-option label="已暂停" value="paused" />
                <el-option label="已完成" value="completed" />
                <el-option label="已取消" value="cancelled" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="优先级">
              <el-select v-model="searchForm.priority" placeholder="请选择优先级" clearable style="width: 100%">
                <el-option label="高" value="high" />
                <el-option label="中" value="medium" />
                <el-option label="低" value="low" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新建项目</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in projectStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="projectNo" label="项目编号" width="140" />
        <el-table-column prop="name" label="项目名称" min-width="160" />
        <el-table-column prop="customer" label="客户" />
        <el-table-column prop="budget" label="预算" align="right">
          <template #default="{ row }">{{ formatCurrency(row.budget) }}</template>
        </el-table-column>
        <el-table-column label="进度" align="center" width="150">
          <template #default="{ row }">
            <el-progress :percentage="row.progress" :color="row.progress === 100 ? '#67C23A' : '#409EFF'" />
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
            <el-tag :type="row.status === 'active' ? 'success' : row.status === 'planning' ? 'info' : row.status === 'completed' ? 'primary' : row.status === 'paused' ? 'warning' : 'danger'">
              {{ row.status === 'planning' ? '规划中' : row.status === 'active' ? '进行中' : row.status === 'paused' ? '已暂停' : row.status === 'completed' ? '已完成' : '已取消' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deadline" label="截止日期" width="120" />
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon></el-button>
            <el-button type="success" size="small" @click="handleStart(row)" v-if="row.status === 'planning'"><el-icon><VideoPlay /></el-icon> 启动</el-button>
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
import { Search, Download, Plus, View, Edit, VideoPlay, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ name: '', status: '', priority: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const projectStats = ref([
  { label: '总项目数', value: '28', type: 'primary' },
  { label: '进行中', value: '12', type: 'success' },
  { label: '已完成', value: '8', type: 'primary' },
  { label: '逾期项目', value: '3', type: 'danger' },
])

const tableData = ref([
  { id: 1, projectNo: 'PRJ-2024-001', name: 'STC 5G网络升级', customer: '沙特电信公司', budget: 5000000, progress: 76, priority: 'high', status: 'active', deadline: '2024-12-20' },
  { id: 2, projectNo: 'PRJ-2024-002', name: '阿尔拉吉银行核心系统', customer: '阿尔拉吉银行', budget: 3200000, progress: 45, priority: 'high', status: 'active', deadline: '2025-03-15' },
  { id: 3, projectNo: 'PRJ-2024-003', name: '沙特阿美数据中心建设', customer: '沙特阿美', budget: 8000000, progress: 0, priority: 'medium', status: 'planning', deadline: '2025-06-30' },
  { id: 4, projectNo: 'PRJ-2024-004', name: '利雅得银行移动应用', customer: '利雅得银行', budget: 1800000, progress: 100, priority: 'low', status: 'completed', deadline: '2024-10-15' },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.name = ''; searchForm.status = ''; searchForm.priority = '' }
const handleExport = () => { ElMessage.success('导出完成') }
const handleCreate = () => { ElMessage.info('新建项目') }
const handleView = (row: any) => { ElMessage.info(`查看项目: ${row.name}`) }
const handleEdit = (row: any) => { ElMessage.info(`编辑项目: ${row.name}`) }
const handleStart = (row: any) => {
  ElMessageBox.confirm(`确认启动项目 ${row.name}？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' })
    .then(() => { row.status = 'active'; ElMessage.success('项目已启动') }).catch(() => {})
}
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除项目 ${row.name} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
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
.stat-card.danger { border-left: 4px solid #F56C6C; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>