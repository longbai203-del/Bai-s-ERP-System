<!-- 
  文件路径: frontend/src/modules/finance/pages/ElectronicInvoice.vue
  功能: 电子发票 - 管理电子发票
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="发票号">
              <el-input v-model="searchForm.invoiceNo" placeholder="请输入发票号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="客户">
              <el-input v-model="searchForm.customer" placeholder="请输入客户名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="待开" value="pending" />
                <el-option label="已开" value="issued" />
                <el-option label="已作废" value="cancelled" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 开具发票</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="invoiceNo" label="发票号" width="140" />
        <el-table-column prop="customer" label="客户" />
        <el-table-column prop="amount" label="金额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.amount) }}</template>
        </el-table-column>
        <el-table-column prop="vat" label="VAT" align="right">
          <template #default="{ row }">{{ formatCurrency(row.vat) }}</template>
        </el-table-column>
        <el-table-column prop="total" label="含税总额" align="right">
          <template #default="{ row }"><span style="font-weight: 600; color: #409EFF;">{{ formatCurrency(row.total) }}</span></template>
        </el-table-column>
        <el-table-column prop="issueDate" label="开票日期" width="120" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'issued' ? 'success' : row.status === 'pending' ? 'warning' : 'danger'">
              {{ row.status === 'pending' ? '待开' : row.status === 'issued' ? '已开' : '已作废' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handlePrint(row)"><el-icon><Printer /></el-icon> 打印</el-button>
            <el-button type="danger" size="small" @click="handleCancel(row)" v-if="row.status === 'pending'"><el-icon><Close /></el-icon> 作废</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Download, Plus, View, Printer, Close } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ invoiceNo: '', customer: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, invoiceNo: 'INV-2024-001', customer: '沙特电信公司', amount: 285600, vat: 42840, total: 328440, issueDate: '2024-11-20', status: 'issued' },
  { id: 2, invoiceNo: 'INV-2024-002', customer: '阿尔拉吉银行', amount: 198700, vat: 29805, total: 228505, issueDate: '', status: 'pending' },
  { id: 3, invoiceNo: 'INV-2024-003', customer: '沙特阿美', amount: 176500, vat: 26475, total: 202975, issueDate: '2024-11-18', status: 'issued' },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.invoiceNo = ''; searchForm.customer = ''; searchForm.status = '' }
const handleExport = () => { ElMessage.success('导出完成') }
const handleCreate = () => { ElMessage.info('开具发票') }
const handleView = (row: any) => { ElMessage.info(`查看发票: ${row.invoiceNo}`) }
const handlePrint = (row: any) => { ElMessage.success(`发票 ${row.invoiceNo} 已发送打印`) }
const handleCancel = (row: any) => {
  ElMessageBox.confirm(`确定要作废发票 ${row.invoiceNo} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
    .then(() => ElMessage.success('已作废')).catch(() => {})
}
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>