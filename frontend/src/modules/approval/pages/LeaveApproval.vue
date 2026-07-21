<!-- 
  文件路径: frontend/src/modules/approval/pages/LeaveApproval.vue
  功能: 请假审批 - 请假审批流程
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="员工姓名">
              <el-input v-model="searchForm.employee" placeholder="请输入姓名" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="请假类型">
              <el-select v-model="searchForm.type" placeholder="请选择类型" clearable style="width: 100%">
                <el-option label="年假" value="annual" />
                <el-option label="病假" value="sick" />
                <el-option label="事假" value="personal" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="待审批" value="pending" />
                <el-option label="已批准" value="approved" />
                <el-option label="已驳回" value="rejected" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="employee" label="姓名" />
        <el-table-column prop="type" label="请假类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 'annual' ? 'primary' : row.type === 'sick' ? 'danger' : 'info'">
              {{ row.type === 'annual' ? '年假' : row.type === 'sick' ? '病假' : '事假' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="days" label="天数" align="center" />
        <el-table-column prop="startDate" label="开始日期" width="120" />
        <el-table-column prop="endDate" label="结束日期" width="120" />
        <el-table-column prop="reason" label="原因" min-width="120" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'approved' ? 'success' : row.status === 'pending' ? 'warning' : 'danger'">
              {{ row.status === 'pending' ? '待审批' : row.status === 'approved' ? '已批准' : '已驳回' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
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
import { Search, View, Check, Close } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ employee: '', type: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, employee: 'Ahmed Al-Fahd', type: 'annual', days: 5, startDate: '2024-12-20', endDate: '2024-12-25', reason: '家庭旅行', status: 'pending' },
  { id: 2, employee: 'Mohammed Al-Qahtani', type: 'sick', days: 2, startDate: '2024-11-18', endDate: '2024-11-19', reason: '身体不适', status: 'approved' },
  { id: 3, employee: 'Saud Al-Otaibi', type: 'personal', days: 1, startDate: '2024-11-25', endDate: '2024-11-25', reason: '私事', status: 'rejected' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.employee = ''; searchForm.type = ''; searchForm.status = '' }
const handleView = (row: any) => { ElMessage.info(`查看请假: ${row.employee}`) }
const handleApprove = (row: any) => {
  ElMessageBox.confirm(`批准 ${row.employee} 的请假？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' })
    .then(() => { row.status = 'approved'; ElMessage.success('已批准') }).catch(() => {})
}
const handleReject = (row: any) => {
  ElMessageBox.confirm(`驳回 ${row.employee} 的请假？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
    .then(() => { row.status = 'rejected'; ElMessage.warning('已驳回') }).catch(() => {})
}
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>