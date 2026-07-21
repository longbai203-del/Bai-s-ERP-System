<!-- 
  文件路径: frontend/src/modules/saas/pages/Subscriptions.vue
  功能: 订阅管理 - 管理订阅
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="租户">
              <el-input v-model="searchForm.tenant" placeholder="请输入租户名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="有效" value="active" />
                <el-option label="即将到期" value="expiring" />
                <el-option label="已过期" value="expired" />
                <el-option label="已取消" value="cancelled" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 创建订阅</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in subscriptionStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="tenant" label="租户" />
        <el-table-column prop="plan" label="套餐" width="100">
          <template #default="{ row }">
            <el-tag :type="row.plan === 'enterprise' ? 'danger' : row.plan === 'professional' ? 'primary' : 'info'">
              {{ row.plan === 'enterprise' ? '企业版' : row.plan === 'professional' ? '专业版' : '标准版' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="billingCycle" label="计费周期" width="100" />
        <el-table-column prop="amount" label="金额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.amount) }}</template>
        </el-table-column>
        <el-table-column prop="startDate" label="开始日期" width="120" />
        <el-table-column prop="endDate" label="到期日期" width="120">
          <template #default="{ row }">
            <span :style="{ color: row.status === 'expiring' ? '#E6A23C' : row.status === 'expired' ? '#F56C6C' : '#303133' }">
              {{ row.endDate }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : row.status === 'expiring' ? 'warning' : row.status === 'expired' ? 'danger' : 'info'">
              {{ row.status === 'active' ? '有效' : row.status === 'expiring' ? '即将到期' : row.status === 'expired' ? '已过期' : '已取消' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleRenew(row)" v-if="row.status === 'expiring'"><el-icon><Refresh /></el-icon> 续订</el-button>
            <el-button type="danger" size="small" @click="handleCancel(row)" v-if="row.status === 'active'"><el-icon><Close /></el-icon> 取消</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, View, Refresh, Close } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

const searchForm = reactive({ tenant: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const subscriptionStats = ref([
  { label: '总订阅数', value: '386', type: 'primary' },
  { label: '有效订阅', value: '286', type: 'success' },
  { label: '即将到期', value: '28', type: 'warning' },
  { label: 'MRR', value: 'SAR 856,000', type: 'primary' },
])

const tableData = ref([
  { id: 1, tenant: '沙特电信公司', plan: 'enterprise', billingCycle: '年付', amount: 120000, startDate: '2024-11-01', endDate: '2025-10-31', status: 'active' },
  { id: 2, tenant: '阿尔拉吉银行', plan: 'professional', billingCycle: '月付', amount: 8500, startDate: '2024-11-01', endDate: '2024-11-30', status: 'expiring' },
  { id: 3, tenant: '沙特阿美', plan: 'enterprise', billingCycle: '年付', amount: 100000, startDate: '2023-11-01', endDate: '2024-10-31', status: 'expired' },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.tenant = ''; searchForm.status = '' }
const handleCreate = () => { router.push('/saas/subscriptions/create') }
const handleView = (row: any) => { router.push(`/saas/subscriptions/detail/${row.id}`) }
const handleRenew = (row: any) => {
  ElMessageBox.confirm(`确认续订 ${row.tenant} 的订阅？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' })
    .then(() => { row.status = 'active'; row.endDate = '2025-01-31'; ElMessage.success('续订成功') }).catch(() => {})
}
const handleCancel = (row: any) => {
  ElMessageBox.confirm(`确认取消 ${row.tenant} 的订阅？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
    .then(() => { row.status = 'cancelled'; ElMessage.success('已取消') }).catch(() => {})
}
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.stat-row { margin-bottom: 20px; }
.stat-card { text-align: center; border-radius: 12px; padding: 8px 0; }
.stat-card.primary { border-left: 4px solid #409EFF; }
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>