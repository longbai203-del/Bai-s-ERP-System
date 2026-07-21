<!-- 
  文件路径: frontend/src/modules/production/pages/MaterialIssue.vue
  功能: 生产领料 - 管理生产领料单
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="领料单号">
              <el-input v-model="searchForm.issueNo" placeholder="请输入领料单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工单号">
              <el-input v-model="searchForm.workOrderNo" placeholder="请输入工单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="待领料" value="pending" />
                <el-option label="已领料" value="issued" />
                <el-option label="已退回" value="returned" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新建领料</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="issueNo" label="领料单号" width="140" />
        <el-table-column prop="workOrderNo" label="工单号" width="140" />
        <el-table-column prop="product" label="产品名称" />
        <el-table-column prop="materialName" label="物料名称" />
        <el-table-column prop="quantity" label="数量" align="center" />
        <el-table-column prop="unit" label="单位" align="center" width="80" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'issued' ? 'success' : row.status === 'pending' ? 'warning' : 'info'">
              {{ row.status === 'pending' ? '待领料' : row.status === 'issued' ? '已领料' : '已退回' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="success" size="small" @click="handleIssue(row)" v-if="row.status === 'pending'"><el-icon><Check /></el-icon> 领料</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, View, Check } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ issueNo: '', workOrderNo: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, issueNo: 'MI-2024-001', workOrderNo: 'WO-2024-001', product: 'iPhone 15 Pro Max', materialName: '屏幕总成', quantity: 100, unit: '片', status: 'pending', createdAt: '2024-11-20 10:30' },
  { id: 2, issueNo: 'MI-2024-002', workOrderNo: 'WO-2024-001', product: 'iPhone 15 Pro Max', materialName: '主板', quantity: 100, unit: '片', status: 'issued', createdAt: '2024-11-19 14:20' },
  { id: 3, issueNo: 'MI-2024-003', workOrderNo: 'WO-2024-002', product: '三星 Galaxy S24 Ultra', materialName: '屏幕总成', quantity: 80, unit: '片', status: 'pending', createdAt: '2024-11-18 09:00' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.issueNo = ''; searchForm.workOrderNo = ''; searchForm.status = '' }
const handleCreate = () => { ElMessage.info('新建领料') }
const handleView = (row: any) => { ElMessage.info(`查看领料: ${row.issueNo}`) }
const handleIssue = (row: any) => {
  ElMessageBox.confirm(`确认领料 ${row.issueNo}？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' })
    .then(() => { row.status = 'issued'; ElMessage.success('领料成功') }).catch(() => {})
}
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>