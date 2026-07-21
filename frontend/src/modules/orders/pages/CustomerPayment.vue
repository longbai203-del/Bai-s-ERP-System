<!-- 
  文件路径: frontend/src/modules/orders/pages/CustomerPayment.vue
  功能: 客户收款 - 管理客户收款记录
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="收款单号">
              <el-input v-model="searchForm.paymentNo" placeholder="请输入收款单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户名称">
              <el-input v-model="searchForm.customer" placeholder="请输入客户名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="收款方式">
              <el-select v-model="searchForm.method" placeholder="请选择方式" clearable style="width: 100%">
                <el-option label="银行转账" value="transfer" />
                <el-option label="现金" value="cash" />
                <el-option label="信用卡" value="card" />
                <el-option label="支票" value="cheque" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="日期范围">
              <el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新增收款</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in statistics" :key="stat.label">
        <el-card class="stat-card">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="paymentNo" label="收款单号" width="140" />
        <el-table-column prop="customer" label="客户名称" />
        <el-table-column prop="amount" label="收款金额" align="right">
          <template #default="{ row }"><span style="font-weight: 600; color: #67C23A;">{{ formatCurrency(row.amount) }}</span></template>
        </el-table-column>
        <el-table-column prop="method" label="收款方式" align="center" width="120" />
        <el-table-column prop="paymentDate" label="收款日期" width="120" />
        <el-table-column prop="reference" label="参考号" width="150" />
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

const searchForm = reactive({ paymentNo: '', customer: '', method: '', dateRange: [] as [Date, Date] | [] })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, paymentNo: 'CP-2024-001', customer: '沙特电信公司', amount: 285600, method: '银行转账', paymentDate: '2024-11-20', reference: 'TRX-2024-001' },
  { id: 2, paymentNo: 'CP-2024-002', customer: '阿尔拉吉银行', amount: 198700, method: '信用卡', paymentDate: '2024-11-18', reference: 'CARD-2024-002' },
  { id: 3, paymentNo: 'CP-2024-003', customer: '沙特阿美', amount: 176500, method: '现金', paymentDate: '2024-11-15', reference: 'CASH-2024-003' },
])

const statistics = ref([
  { label: '本期收款总额', value: 'SAR 3,856,200' },
  { label: '本期收款笔数', value: '286' },
  { label: '平均每笔', value: 'SAR 13,482' },
  { label: '逾期未收', value: 'SAR 456,000' },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.paymentNo = ''; searchForm.customer = ''; searchForm.method = ''; searchForm.dateRange = [] }
const handleCreate = () => { ElMessage.info('新增收款') }
const handleView = (row: any) => { ElMessage.info(`查看收款: ${row.paymentNo}`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除收款 ${row.paymentNo} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
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
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>