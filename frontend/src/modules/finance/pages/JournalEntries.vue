<!-- 
  文件路径: frontend/src/modules/finance/pages/JournalEntries.vue
  功能: 凭证管理 - 管理会计凭证
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="凭证号">
              <el-input v-model="searchForm.voucherNo" placeholder="请输入凭证号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="期间">
              <el-date-picker v-model="searchForm.period" type="month" placeholder="选择期间" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="草稿" value="draft" />
                <el-option label="已审核" value="approved" />
                <el-option label="已过账" value="posted" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新增凭证</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="voucherNo" label="凭证号" width="140" />
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="summary" label="摘要" min-width="180" />
        <el-table-column prop="debit" label="借方金额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.debit) }}</template>
        </el-table-column>
        <el-table-column prop="credit" label="贷方金额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.credit) }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'posted' ? 'success' : row.status === 'approved' ? 'primary' : 'info'">
              {{ row.status === 'draft' ? '草稿' : row.status === 'approved' ? '已审核' : '已过账' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdBy" label="创建人" width="100" />
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon></el-button>
            <el-button type="success" size="small" @click="handlePost(row)" v-if="row.status === 'approved'"><el-icon><Check /></el-icon> 过账</el-button>
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
import { Search, Download, Plus, View, Edit, Check, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ voucherNo: '', period: new Date(), status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, voucherNo: 'VOU-2024-001', date: '2024-11-01', summary: '采购入库-苹果供应商', debit: 285600, credit: 0, status: 'posted', createdBy: 'Ahmed' },
  { id: 2, voucherNo: 'VOU-2024-002', date: '2024-11-05', summary: '销售收款-沙特电信', debit: 0, credit: 198700, status: 'approved', createdBy: 'Mohammed' },
  { id: 3, voucherNo: 'VOU-2024-003', date: '2024-11-10', summary: '支付供应商货款', debit: 0, credit: 156800, status: 'draft', createdBy: 'Saud' },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.voucherNo = ''; searchForm.status = '' }
const handleExport = () => { ElMessage.success('导出完成') }
const handleCreate = () => { ElMessage.info('新增凭证') }
const handleView = (row: any) => { ElMessage.info(`查看凭证: ${row.voucherNo}`) }
const handleEdit = (row: any) => { ElMessage.info(`编辑凭证: ${row.voucherNo}`) }
const handlePost = (row: any) => { ElMessage.success(`凭证 ${row.voucherNo} 已过账`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除凭证 ${row.voucherNo} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
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