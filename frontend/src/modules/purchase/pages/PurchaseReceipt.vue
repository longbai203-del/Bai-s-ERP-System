<!-- 
  文件路径: frontend/src/modules/purchase/pages/PurchaseReceipt.vue
  功能: 采购入库 - 管理采购入库单
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="入库单号">
              <el-input v-model="searchForm.receiptNo" placeholder="请输入入库单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="供应商">
              <el-input v-model="searchForm.supplier" placeholder="请输入供应商名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="待入库" value="pending" />
                <el-option label="部分入库" value="partial" />
                <el-option label="已完成" value="completed" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新建入库</el-button>
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
        <el-table-column prop="receiptNo" label="入库单号" width="140" />
        <el-table-column prop="poNo" label="采购订单号" width="140" />
        <el-table-column prop="supplier" label="供应商" />
        <el-table-column prop="totalAmount" label="入库金额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.totalAmount) }}</template>
        </el-table-column>
        <el-table-column prop="receiptDate" label="入库日期" width="120" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'completed' ? 'success' : row.status === 'partial' ? 'warning' : 'info'">
              {{ row.status === 'pending' ? '待入库' : row.status === 'partial' ? '部分入库' : '已完成' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon></el-button>
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
import { Search, Plus, View, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ receiptNo: '', supplier: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, receiptNo: 'PR-2024-001', poNo: 'PO-2024-001', supplier: 'Apple Supplier', totalAmount: 285600, receiptDate: '2024-11-20', status: 'completed' },
  { id: 2, receiptNo: 'PR-2024-002', poNo: 'PO-2024-003', supplier: 'Samsung Supplier', totalAmount: 198700, receiptDate: '2024-11-18', status: 'partial' },
  { id: 3, receiptNo: 'PR-2024-003', poNo: 'PO-2024-005', supplier: 'Dell Supplier', totalAmount: 176500, receiptDate: '2024-11-15', status: 'pending' },
])

const statistics = ref([
  { label: '本月入库单数', value: '86' },
  { label: '入库总金额', value: 'SAR 3,856,200' },
  { label: '待入库', value: '12' },
  { label: '部分入库', value: '8' },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.receiptNo = ''; searchForm.supplier = ''; searchForm.status = '' }
const handleCreate = () => { ElMessage.info('新建入库单') }
const handleView = (row: any) => { ElMessage.info(`查看入库单: ${row.receiptNo}`) }
const handleEdit = (row: any) => { ElMessage.info(`编辑入库单: ${row.receiptNo}`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除入库单 ${row.receiptNo} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
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