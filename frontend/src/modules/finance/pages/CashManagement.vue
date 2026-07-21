<!-- 
  文件路径: frontend/src/modules/finance/pages/CashManagement.vue
  功能: 现金管理 - 管理现金收支
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="日期范围">
              <el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="类型">
              <el-select v-model="searchForm.type" placeholder="请选择类型" clearable style="width: 100%">
                <el-option label="收入" value="income" />
                <el-option label="支出" value="expense" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 录入收支</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 现金余额 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="8" v-for="stat in cashStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="type" label="类型" align="center" width="80">
          <template #default="{ row }">
            <el-tag :type="row.type === 'income' ? 'success' : 'danger'">
              {{ row.type === 'income' ? '收入' : '支出' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="类别" width="120" />
        <el-table-column prop="amount" label="金额" align="right">
          <template #default="{ row }">
            <span :style="{ color: row.type === 'income' ? '#67C23A' : '#F56C6C', fontWeight: 600 }">
              {{ formatCurrency(row.amount) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="说明" min-width="150" />
        <el-table-column prop="balance" label="余额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.balance) }}</template>
        </el-table-column>
        <el-table-column prop="operator" label="操作人" width="100" />
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
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
import { Search, Plus, View, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ dateRange: [] as [Date, Date] | [], type: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const cashStats = ref([
  { label: '现金余额', value: 'SAR 796,000', type: 'primary' },
  { label: '本月收入', value: 'SAR 2,856,000', type: 'success' },
  { label: '本月支出', value: 'SAR 2,560,000', type: 'danger' },
])

const tableData = ref([
  { id: 1, date: '2024-11-20', type: 'income', category: '销售收款', amount: 285600, description: '沙特电信-订单付款', balance: 796000, operator: 'Ahmed' },
  { id: 2, date: '2024-11-19', type: 'expense', category: '采购付款', amount: 156800, description: '苹果供应商-货款', balance: 510400, operator: 'Mohammed' },
  { id: 3, date: '2024-11-18', type: 'income', category: '销售收款', amount: 198700, description: '阿尔拉吉银行-服务费', balance: 667200, operator: 'Saud' },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.dateRange = []; searchForm.type = '' }
const handleCreate = () => { ElMessage.info('录入收支') }
const handleView = (row: any) => { ElMessage.info(`查看记录: ${row.id}`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm('确定要删除该记录吗？', '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
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