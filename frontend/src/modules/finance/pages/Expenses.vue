<!-- 
  文件路径: frontend/src/modules/finance/pages/Expenses.vue
  功能: 费用管理 - 管理各项费用支出
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="费用编号">
              <el-input v-model="searchForm.expenseNo" placeholder="请输入费用编号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="费用类别">
              <el-select v-model="searchForm.category" placeholder="请选择类别" clearable style="width: 100%">
                <el-option label="办公费用" value="office" />
                <el-option label="差旅费用" value="travel" />
                <el-option label="设备费用" value="equipment" />
                <el-option label="人力成本" value="labor" />
                <el-option label="营销费用" value="marketing" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="待审批" value="pending" />
                <el-option label="已批准" value="approved" />
                <el-option label="已支付" value="paid" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新增费用</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="expenseNo" label="费用编号" width="140" />
        <el-table-column prop="category" label="费用类别" width="100" />
        <el-table-column prop="amount" label="费用金额" align="right">
          <template #default="{ row }}"><span style="color: #F56C6C; font-weight: 600;">{{ formatCurrency(row.amount) }}</span></template>
        </el-table-column>
        <el-table-column prop="description" label="费用说明" min-width="150" />
        <el-table-column prop="department" label="部门" width="100" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'paid' ? 'success' : row.status === 'approved' ? 'primary' : 'warning'">
              {{ row.status === 'pending' ? '待审批' : row.status === 'approved' ? '已批准' : '已支付' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="expenseDate" label="费用日期" width="120" />
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
import { Search, Download, Plus, View, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ expenseNo: '', category: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, expenseNo: 'EXP-2024-001', category: '办公费用', amount: 28560, description: '办公用品采购', department: '采购部', status: 'paid', expenseDate: '2024-11-20' },
  { id: 2, expenseNo: 'EXP-2024-002', category: '差旅费用', amount: 18700, description: '出差利雅得', department: '销售部', status: 'approved', expenseDate: '2024-11-19' },
  { id: 3, expenseNo: 'EXP-2024-003', category: '营销费用', amount: 45600, description: '广告投放', department: '市场部', status: 'pending', expenseDate: '2024-11-18' },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.expenseNo = ''; searchForm.category = ''; searchForm.status = '' }
const handleExport = () => { ElMessage.success('导出完成') }
const handleCreate = () => { ElMessage.info('新增费用') }
const handleView = (row: any) => { ElMessage.info(`查看费用: ${row.expenseNo}`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除费用 ${row.expenseNo} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
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