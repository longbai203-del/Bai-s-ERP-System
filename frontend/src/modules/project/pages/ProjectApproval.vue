<!-- 
  文件路径: frontend/src/modules/project/pages/ProjectApproval.vue
  功能: 项目审批 - 项目审批流程
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="项目">
              <el-select v-model="searchForm.project" placeholder="请选择项目" style="width: 100%" filterable>
                <el-option label="STC 5G网络升级" value="STC 5G网络升级" />
                <el-option label="阿尔拉吉银行核心系统" value="阿尔拉吉银行核心系统" />
                <el-option label="沙特阿美数据中心建设" value="沙特阿美数据中心建设" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="待审批" value="pending" />
                <el-option label="已批准" value="approved" />
                <el-option label="已驳回" value="rejected" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 提交审批</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 审批统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in approvalStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="approvalNo" label="审批编号" width="140" />
        <el-table-column prop="project" label="项目名称" />
        <el-table-column prop="type" label="审批类型" width="120">
          <template #default="{ row }">
            <el-tag :type="row.type === 'budget' ? 'warning' : row.type === 'scope' ? 'primary' : 'success'">
              {{ row.type === 'budget' ? '预算审批' : row.type === 'scope' ? '范围变更' : '验收审批' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="applicant" label="申请人" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'approved' ? 'success' : row.status === 'pending' ? 'warning' : 'danger'">
              {{ row.status === 'pending' ? '待审批' : row.status === 'approved' ? '已批准' : '已驳回' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="submittedDate" label="提交日期" width="160" />
        <el-table-column label="操作" align="center" width="250" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="success" size="small" @click="handleApprove(row)" v-if="row.status === 'pending'"><el-icon><Check /></el-icon> 批准</el-button>
            <el-button type="danger" size="small" @click="handleReject(row)" v-if="row.status === 'pending'"><el-icon><Close /></el-icon> 驳回</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, View, Check, Close } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ project: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const approvalStats = ref([
  { label: '待审批', value: '6', type: 'warning' },
  { label: '已批准', value: '18', type: 'success' },
  { label: '已驳回', value: '4', type: 'danger' },
  { label: '平均审批时长', value: '2.5天', type: 'primary' },
])

const tableData = ref([
  { id: 1, approvalNo: 'AP-2024-001', project: 'STC 5G网络升级', type: 'budget', applicant: 'Ahmed Al-Fahd', status: 'pending', submittedDate: '2024-11-18 10:30' },
  { id: 2, approvalNo: 'AP-2024-002', project: '阿尔拉吉银行核心系统', type: 'scope', applicant: 'Mohammed Al-Qahtani', status: 'approved', submittedDate: '2024-11-15 14:20' },
  { id: 3, approvalNo: 'AP-2024-003', project: '沙特阿美数据中心建设', type: 'acceptance', applicant: 'Saud Al-Otaibi', status: 'rejected', submittedDate: '2024-11-10 09:00' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.project = ''; searchForm.status = '' }
const handleCreate = () => { ElMessage.info('提交审批') }
const handleView = (row: any) => { ElMessage.info(`查看审批: ${row.approvalNo}`) }
const handleApprove = (row: any) => {
  ElMessageBox.confirm(`批准审批 ${row.approvalNo}？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' })
    .then(() => { row.status = 'approved'; ElMessage.success('已批准') }).catch(() => {})
}
const handleReject = (row: any) => {
  ElMessageBox.confirm(`驳回审批 ${row.approvalNo}？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
    .then(() => { row.status = 'rejected'; ElMessage.warning('已驳回') }).catch(() => {})
}
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.stat-row { margin-bottom: 20px; }
.stat-card { text-align: center; border-radius: 12px; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-card.danger { border-left: 4px solid #F56C6C; }
.stat-card.primary { border-left: 4px solid #409EFF; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>