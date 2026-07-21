<!-- 
  文件路径: frontend/src/modules/purchase/pages/PurchasePlan.vue
  功能: 采购计划 - 管理采购计划与执行
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="计划编号">
              <el-input v-model="searchForm.planNo" placeholder="请输入计划编号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="年份">
              <el-select v-model="searchForm.year" placeholder="请选择年份" style="width: 100%">
                <el-option label="2024" value="2024" />
                <el-option label="2025" value="2025" />
                <el-option label="2026" value="2026" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="草稿" value="draft" />
                <el-option label="已审批" value="approved" />
                <el-option label="执行中" value="executing" />
                <el-option label="已完成" value="completed" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新建计划</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="planNo" label="计划编号" width="140" />
        <el-table-column prop="year" label="年份" align="center" width="80" />
        <el-table-column prop="totalBudget" label="总预算" align="right">
          <template #default="{ row }">{{ formatCurrency(row.totalBudget) }}</template>
        </el-table-column>
        <el-table-column prop="usedAmount" label="已执行" align="right">
          <template #default="{ row }">{{ formatCurrency(row.usedAmount) }}</template>
        </el-table-column>
        <el-table-column label="执行率" align="center" width="150">
          <template #default="{ row }">
            <el-progress :percentage="row.executionRate" :color="row.executionRate >= 80 ? '#67C23A' : row.executionRate >= 50 ? '#E6A23C' : '#F56C6C'" />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'draft' ? 'info' : row.status === 'approved' ? 'success' : row.status === 'executing' ? 'warning' : 'primary'">
              {{ row.status === 'draft' ? '草稿' : row.status === 'approved' ? '已审批' : row.status === 'executing' ? '执行中' : '已完成' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon></el-button>
            <el-button type="success" size="small" @click="handleApprove(row)" v-if="row.status === 'draft'"><el-icon><Check /></el-icon> 审批</el-button>
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
import { Search, Plus, View, Edit, Check, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ planNo: '', year: '2024', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, planNo: 'PP-2024-001', year: '2024', totalBudget: 5000000, usedAmount: 3856000, executionRate: 77.1, status: 'executing' },
  { id: 2, planNo: 'PP-2024-002', year: '2024', totalBudget: 3000000, usedAmount: 1568000, executionRate: 52.3, status: 'approved' },
  { id: 3, planNo: 'PP-2025-001', year: '2025', totalBudget: 6000000, usedAmount: 0, executionRate: 0, status: 'draft' },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.planNo = ''; searchForm.status = '' }
const handleCreate = () => { ElMessage.info('新建采购计划') }
const handleView = (row: any) => { ElMessage.info(`查看计划: ${row.planNo}`) }
const handleEdit = (row: any) => { ElMessage.info(`编辑计划: ${row.planNo}`) }
const handleApprove = (row: any) => { ElMessage.success(`计划 ${row.planNo} 已审批通过`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除计划 ${row.planNo} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
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