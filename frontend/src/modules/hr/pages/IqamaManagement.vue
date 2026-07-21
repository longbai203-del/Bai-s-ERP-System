<!-- 
  文件路径: frontend/src/modules/hr/pages/IqamaManagement.vue
  功能: Iqama管理 - 管理员工Iqama（沙特居住证）
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
            <el-form-item label="Iqama状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="有效" value="valid" />
                <el-option label="即将到期" value="expiring" />
                <el-option label="已过期" value="expired" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 添加Iqama</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in iqamaStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="employee" label="员工姓名" />
        <el-table-column prop="iqamaNumber" label="Iqama号码" />
        <el-table-column prop="nationality" label="国籍" width="100" />
        <el-table-column prop="issueDate" label="签发日期" width="120" />
        <el-table-column prop="expiryDate" label="有效期至" width="120">
          <template #default="{ row }">
            <span :style="{ color: isExpiring(row.expiryDate) ? '#F56C6C' : '#303133', fontWeight: isExpiring(row.expiryDate) ? 700 : 400 }">
              {{ row.expiryDate }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'valid' ? 'success' : row.status === 'expiring' ? 'warning' : 'danger'">
              {{ row.status === 'valid' ? '有效' : row.status === 'expiring' ? '即将到期' : '已过期' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="提醒" align="center" width="100">
          <template #default="{ row }">
            <el-button type="warning" size="small" @click="handleRemind(row)" v-if="row.status === 'expiring'">
              <el-icon><Bell /></el-icon> 提醒
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleRenew(row)"><el-icon><Refresh /></el-icon> 续签</el-button>
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
import { Search, Plus, View, Bell, Refresh, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ employee: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const iqamaStats = ref([
  { label: 'Iqama总数', value: '156', type: 'primary' },
  { label: '有效Iqama', value: '132', type: 'success' },
  { label: '即将到期(60天内)', value: '16', type: 'warning' },
  { label: '已过期', value: '8', type: 'danger' },
])

const tableData = ref([
  { id: 1, employee: 'Ahmed Al-Fahd', iqamaNumber: 'SA-1234567890', nationality: '沙特阿拉伯', issueDate: '2023-01-15', expiryDate: '2025-01-14', status: 'valid' },
  { id: 2, employee: 'Mohammed Al-Qahtani', iqamaNumber: 'SA-9876543210', nationality: '埃及', issueDate: '2023-06-20', expiryDate: '2024-06-19', status: 'expiring' },
  { id: 3, employee: 'Saud Al-Otaibi', iqamaNumber: 'SA-5678901234', nationality: '约旦', issueDate: '2022-03-10', expiryDate: '2024-03-09', status: 'expiring' },
])

const loading = ref(false)

const isExpiring = (date: string) => {
  const expiry = new Date(date)
  const now = new Date()
  const daysDiff = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  return daysDiff < 60 && daysDiff > 0
}

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.employee = ''; searchForm.status = '' }
const handleCreate = () => { ElMessage.info('添加Iqama') }
const handleView = (row: any) => { ElMessage.info(`查看 ${row.employee} 的Iqama`) }
const handleRemind = (row: any) => { ElMessage.success(`已向 ${row.employee} 发送续签提醒`) }
const handleRenew = (row: any) => { ElMessage.success(`Iqama已续签`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除 ${row.employee} 的Iqama吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
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
.stat-card.danger { border-left: 4px solid #F56C6C; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>