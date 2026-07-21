<!-- 
  文件路径: frontend/src/modules/production/pages/ProductionComplete.vue
  功能: 完工管理 - 生产完工入库
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="工单号">
              <el-input v-model="searchForm.workOrderNo" placeholder="请输入工单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="待完工" value="pending" />
                <el-option label="已完工" value="completed" />
                <el-option label="已入库" value="stored" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleComplete" style="float: right"><el-icon><Check /></el-icon> 完工入库</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="workOrderNo" label="工单号" width="140" />
        <el-table-column prop="product" label="产品名称" />
        <el-table-column prop="plannedQuantity" label="计划产量" align="center" />
        <el-table-column prop="completedQuantity" label="完工数量" align="center">
          <template #default="{ row }">
            <span :style="{ color: row.completedQuantity < row.plannedQuantity ? '#E6A23C' : '#67C23A', fontWeight: 600 }">
              {{ row.completedQuantity }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="defectQuantity" label="不良品" align="center">
          <template #default="{ row }">
            <span style="color: #F56C6C;">{{ row.defectQuantity }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="qualifiedQuantity" label="合格品" align="center">
          <template #default="{ row }">
            <span style="color: #67C23A; font-weight: 600;">{{ row.qualifiedQuantity }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'stored' ? 'success' : row.status === 'completed' ? 'primary' : 'warning'">
              {{ row.status === 'pending' ? '待完工' : row.status === 'completed' ? '已完工' : '已入库' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="success" size="small" @click="handleStore(row)" v-if="row.status === 'completed'"><el-icon><Box /></el-icon> 入库</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Check, View, Box } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ workOrderNo: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, workOrderNo: 'WO-2024-001', product: 'iPhone 15 Pro Max', plannedQuantity: 500, completedQuantity: 380, defectQuantity: 12, qualifiedQuantity: 368, status: 'completed' },
  { id: 2, workOrderNo: 'WO-2024-002', product: '三星 Galaxy S24 Ultra', plannedQuantity: 300, completedQuantity: 0, defectQuantity: 0, qualifiedQuantity: 0, status: 'pending' },
  { id: 3, workOrderNo: 'WO-2024-003', product: 'MacBook Pro 16"', plannedQuantity: 150, completedQuantity: 150, defectQuantity: 3, qualifiedQuantity: 147, status: 'stored' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.workOrderNo = ''; searchForm.status = '' }
const handleComplete = () => { ElMessage.info('完工入库') }
const handleView = (row: any) => { ElMessage.info(`查看工单: ${row.workOrderNo}`) }
const handleStore = (row: any) => {
  ElMessageBox.confirm(`确认将 ${row.workOrderNo} 的 ${row.qualifiedQuantity} 件合格品入库？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' })
    .then(() => { row.status = 'stored'; ElMessage.success('入库成功') }).catch(() => {})
}
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>