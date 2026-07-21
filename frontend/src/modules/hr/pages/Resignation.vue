<!-- 
  文件路径: frontend/src/modules/hr/pages/Resignation.vue
  功能: 离职管理 - 管理员工离职
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="姓名">
              <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="待审批" value="pending" />
                <el-option label="已批准" value="approved" />
                <el-option label="已离职" value="completed" />
                <el-option label="已取消" value="cancelled" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 申请离职</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in resignationStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="position" label="职位" />
        <el-table-column prop="department" label="部门" />
        <el-table-column prop="applicationDate" label="申请日期" width="120" />
        <el-table-column prop="effectiveDate" label="生效日期" width="120" />
        <el-table-column prop="reason" label="离职原因" min-width="120" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'completed' ? 'success' : row.status === 'approved' ? 'primary' : row.status === 'pending' ? 'warning' : 'info'">
              {{ row.status === 'pending' ? '待审批' : row.status === 'approved' ? '已批准' : row.status === 'completed' ? '已离职' : '已取消' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="250" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="success" size="small" @click="handleApprove(row)" v-if="row.status === 'pending'"><el-icon><Check /></el-icon> 批准</el-button>
            <el-button type="danger" size="small" @click="handleReject(row)" v-if="row.status === 'pending'"><el-icon><Close /></el-icon> 驳回</el-button>
            <el-button type="info" size="small" @click="handleCancel(row)" v-if="row.status === 'approved'"><el-icon><CircleClose /></el-icon> 取消</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, View, Check, Close, CircleClose } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ name: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const resignationStats = ref([
  { label: '离职申请', value: '12', type: 'warning' },
  { label: '已批准待离职', value: '6', type: 'primary' },
  { label: '已完成离职', value: '18', type: 'success' },
  { label: '离职率', value: '4.5%', type: 'danger' },
])

const tableData = ref([
  { id: 1, name: 'Ahmed Al-Fahd', position: '销售经理', department: '销售部', applicationDate: '2024-11-20', effectiveDate: '2024-12-20', reason: '个人发展', status: 'pending' },
  { id: 2, name: 'Mohammed Al-Qahtani', position: '采购主管', department: '采购部', applicationDate: '2024-11-15', effectiveDate: '2024-12-15', reason: '家庭原因', status: 'approved' },
  { id: 3, name: 'Saud Al-Otaibi', position: '财务总监', department: '财务部', applicationDate: '2024-10-20', effectiveDate: '2024-11-20', reason: '移民', status: 'completed' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.name = ''; searchForm.status = '' }
const handleCreate = () => { ElMessage.info('申请离职') }
const handleView = (row: any) => { ElMessage.info(`查看离职: ${row.name}`) }
const handleApprove = (row: any) => {
  ElMessageBox.confirm(`批准 ${row.name} 的离职申请？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' })
    .then(() => { row.status = 'approved'; ElMessage.success('已批准') }).catch(() => {})
}
const handleReject = (row: any) => {
  ElMessageBox.confirm(`驳回 ${row.name} 的离职申请？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
    .then(() => { row.status = 'cancelled'; ElMessage.warning('已驳回') }).catch(() => {})
}
const handleCancel = (row: any) => {
  ElMessageBox.confirm(`取消 ${row.name} 的离职流程？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' })
    .then(() => { row.status = 'cancelled'; ElMessage.success('已取消') }).catch(() => {})
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
.stat-card.primary { border-left: 4px solid #409EFF; }
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-card.danger { border-left: 4px solid #F56C6C; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>