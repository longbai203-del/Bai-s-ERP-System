<!-- 
  文件路径: frontend/src/modules/orders/pages/CustomerComplaint.vue
  功能: 投诉管理 - 管理客户投诉与处理
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="投诉编号">
              <el-input v-model="searchForm.complaintNo" placeholder="请输入投诉编号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户名称">
              <el-input v-model="searchForm.customer" placeholder="请输入客户名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="待处理" value="pending" />
                <el-option label="处理中" value="processing" />
                <el-option label="已解决" value="resolved" />
                <el-option label="已关闭" value="closed" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新增投诉</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in statistics" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="complaintNo" label="投诉编号" width="140" />
        <el-table-column prop="customer" label="客户名称" />
        <el-table-column prop="type" label="投诉类型" width="120" />
        <el-table-column prop="subject" label="投诉主题" min-width="180" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'pending' ? 'danger' : row.status === 'processing' ? 'warning' : row.status === 'resolved' ? 'success' : 'info'">
              {{ row.status === 'pending' ? '待处理' : row.status === 'processing' ? '处理中' : row.status === 'resolved' ? '已解决' : '已关闭' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="提交时间" width="160" />
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="success" size="small" @click="handleResolve(row)" v-if="row.status !== 'resolved' && row.status !== 'closed'">
              <el-icon><Check /></el-icon> 解决
            </el-button>
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
import { Search, Plus, View, Check, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ complaintNo: '', customer: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, complaintNo: 'CP-2024-001', customer: '沙特电信公司', type: '产品质量', subject: '产品出现故障，无法正常使用', status: 'pending', createdAt: '2024-11-20 10:30' },
  { id: 2, complaintNo: 'CP-2024-002', customer: '阿尔拉吉银行', type: '配送问题', subject: '订单延迟3天未送达', status: 'processing', createdAt: '2024-11-18 14:20' },
  { id: 3, complaintNo: 'CP-2024-003', customer: '利雅得银行', type: '售后服务', subject: '维修响应时间过长，已等待5天', status: 'resolved', createdAt: '2024-11-15 09:00' },
])

const statistics = ref([
  { label: '总投诉', value: '28', type: 'primary' },
  { label: '待处理', value: '6', type: 'danger' },
  { label: '处理中', value: '8', type: 'warning' },
  { label: '已解决', value: '14', type: 'success' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.complaintNo = ''; searchForm.customer = ''; searchForm.status = '' }
const handleCreate = () => { ElMessage.info('新增投诉') }
const handleView = (row: any) => { ElMessage.info(`查看投诉: ${row.complaintNo}`) }
const handleResolve = (row: any) => { ElMessage.success(`投诉 ${row.complaintNo} 已解决`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除投诉 ${row.complaintNo} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
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
.stat-card.danger { border-left: 4px solid #F56C6C; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>