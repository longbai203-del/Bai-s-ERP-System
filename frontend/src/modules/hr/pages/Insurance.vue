<!-- 
  文件路径: frontend/src/modules/hr/pages/Insurance.vue
  功能: 保险管理 - 管理员工保险
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="员工姓名">
              <el-input v-model="searchForm.employee" placeholder="请输入员工姓名" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="保险类型">
              <el-select v-model="searchForm.type" placeholder="请选择类型" clearable style="width: 100%">
                <el-option label="医疗保险" value="medical" />
                <el-option label="工伤保险" value="work" />
                <el-option label="养老保险" value="pension" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 添加保险</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="employee" label="员工姓名" />
        <el-table-column prop="type" label="保险类型" width="120">
          <template #default="{ row }">
            <el-tag :type="row.type === 'medical' ? 'success' : row.type === 'work' ? 'warning' : 'primary'">
              {{ row.type === 'medical' ? '医疗保险' : row.type === 'work' ? '工伤保险' : '养老保险' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="policyNumber" label="保单号" />
        <el-table-column prop="provider" label="保险公司" />
        <el-table-column prop="startDate" label="生效日期" width="120" />
        <el-table-column prop="endDate" label="到期日期" width="120">
          <template #default="{ row }">
            <span :style="{ color: isExpiring(row.endDate) ? '#F56C6C' : '#303133' }">
              {{ row.endDate }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : row.status === 'expiring' ? 'warning' : 'danger'">
              {{ row.status === 'active' ? '有效' : row.status === 'expiring' ? '即将到期' : '已过期' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleRenew(row)"><el-icon><Refresh /></el-icon> 续保</el-button>
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
import { Search, Plus, View, Refresh, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ employee: '', type: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, employee: 'Ahmed Al-Fahd', type: 'medical', policyNumber: 'MED-123456', provider: 'Tawuniya', startDate: '2024-01-01', endDate: '2024-12-31', status: 'active' },
  { id: 2, employee: 'Mohammed Al-Qahtani', type: 'work', policyNumber: 'WRK-789012', provider: 'Saudi Insurance', startDate: '2024-01-01', endDate: '2024-12-31', status: 'active' },
  { id: 3, employee: 'Saud Al-Otaibi', type: 'pension', policyNumber: 'PEN-345678', provider: 'National Pension', startDate: '2023-01-01', endDate: '2023-12-31', status: 'expiring' },
])

const loading = ref(false)

const isExpiring = (date: string) => {
  const expiry = new Date(date)
  const now = new Date()
  const daysDiff = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  return daysDiff < 60 && daysDiff > 0
}

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.employee = ''; searchForm.type = '' }
const handleCreate = () => { ElMessage.info('添加保险') }
const handleView = (row: any) => { ElMessage.info(`查看保险: ${row.employee}`) }
const handleRenew = (row: any) => { ElMessage.success(`保险已续保`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除 ${row.employee} 的保险吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
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