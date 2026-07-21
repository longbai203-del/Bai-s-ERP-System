<!-- 
  文件路径: frontend/src/modules/finance/pages/TaxManagement.vue
  功能: 税务管理 - 管理各类税务
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="税种">
              <el-select v-model="searchForm.taxType" placeholder="请选择税种" clearable style="width: 100%">
                <el-option label="增值税" value="vat" />
                <el-option label="企业所得税" value="corporate" />
                <el-option label="个人所得税" value="personal" />
                <el-option label="关税" value="duty" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="期间">
              <el-date-picker v-model="searchForm.period" type="month" placeholder="选择期间" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="taxType" label="税种" width="120" />
        <el-table-column prop="taxableAmount" label="应税金额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.taxableAmount) }}</template>
        </el-table-column>
        <el-table-column prop="rate" label="税率" align="center">
          <template #default="{ row }">{{ row.rate }}%</template>
        </el-table-column>
        <el-table-column prop="taxAmount" label="税额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.taxAmount) }}</template>
        </el-table-column>
        <el-table-column prop="paidAmount" label="已缴" align="right">
          <template #default="{ row }">{{ formatCurrency(row.paidAmount) }}</template>
        </el-table-column>
        <el-table-column prop="balance" label="待缴" align="right">
          <template #default="{ row }">
            <span :style="{ color: row.balance > 0 ? '#F56C6C' : '#67C23A', fontWeight: 600 }">
              {{ formatCurrency(row.balance) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="deadline" label="申报截止" width="120" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'paid' ? 'success' : row.status === 'pending' ? 'warning' : 'danger'">
              {{ row.status === 'paid' ? '已缴' : row.status === 'pending' ? '待缴' : '逾期' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handlePay(row)" v-if="row.status !== 'paid'"><el-icon><Money /></el-icon> 缴纳</el-button>
            <el-button type="warning" size="small" @click="handleDeclare(row)"><el-icon><Document /></el-icon> 申报</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Download, Money, Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ taxType: '', period: new Date() })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, taxType: '增值税', taxableAmount: 2856000, rate: 15, taxAmount: 428400, paidAmount: 0, balance: 428400, deadline: '2024-12-15', status: 'pending' },
  { id: 2, taxType: '企业所得税', taxableAmount: 5200000, rate: 20, taxAmount: 1040000, paidAmount: 520000, balance: 520000, deadline: '2024-12-31', status: 'pending' },
  { id: 3, taxType: '关税', taxableAmount: 856000, rate: 5, taxAmount: 42800, paidAmount: 42800, balance: 0, deadline: '2024-11-10', status: 'paid' },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.taxType = '' }
const handleExport = () => { ElMessage.success('导出完成') }
const handlePay = (row: any) => { ElMessage.success(`已缴纳 ${row.taxType}`) }
const handleDeclare = (row: any) => { ElMessage.success(`${row.taxType} 已申报`) }
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>