<!-- 
  文件路径: frontend/src/modules/approval/pages/VehicleApproval.vue
  功能: 用车审批 - 用车审批流程
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="用车人">
              <el-input v-model="searchForm.driver" placeholder="请输入用车人" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="车辆">
              <el-input v-model="searchForm.vehicle" placeholder="请输入车牌号" clearable />
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
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 申请用车</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="driver" label="用车人" />
        <el-table-column prop="vehicle" label="车辆" />
        <el-table-column prop="purpose" label="用途" min-width="150" />
        <el-table-column prop="startTime" label="开始时间" width="160" />
        <el-table-column prop="endTime" label="结束时间" width="160" />
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
import { Search, Plus, View, Check, Close } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ driver: '', vehicle: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, driver: 'Ahmed Al-Fahd', vehicle: 'KSA-1234', purpose: '客户拜访', startTime: '2024-11-20 10:00', endTime: '2024-11-20 16:00', status: 'pending' },
  { id: 2, driver: 'Mohammed Al-Qahtani', vehicle: 'KSA-5678', purpose: '供应商参观', startTime: '2024-11-19 09:00', endTime: '2024-11-19 17:00', status: 'approved' },
  { id: 3, driver: 'Saud Al-Otaibi', vehicle: 'KSA-9012', purpose: '外出办公', startTime: '2024-11-18 08:30', endTime: '2024-11-18 12:30', status: 'rejected' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.driver = ''; searchForm.vehicle = ''; searchForm.status = '' }
const handleCreate = () => { ElMessage.info('申请用车') }
const handleView = (row: any) => { ElMessage.info(`查看用车: ${row.driver}`) }
const handleApprove = (row: any) => {
  ElMessageBox.confirm(`批准 ${row.driver} 的用车申请？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' })
    .then(() => { row.status = 'approved'; ElMessage.success('已批准') }).catch(() => {})
}
const handleReject = (row: any) => {
  ElMessageBox.confirm(`驳回 ${row.driver} 的用车申请？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
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