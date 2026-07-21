<!-- 
  文件路径: frontend/src/modules/purchase/pages/PurchaseReturns.vue
  功能: 采购退货 - 管理采购退货单
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="退货单号">
              <el-input v-model="searchForm.returnNo" placeholder="请输入退货单号" clearable />
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
                <el-option label="待审核" value="pending" />
                <el-option label="已审核" value="approved" />
                <el-option label="已退货" value="completed" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新建退货</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="returnNo" label="退货单号" width="140" />
        <el-table-column prop="poNo" label="采购订单" width="140" />
        <el-table-column prop="supplier" label="供应商" />
        <el-table-column prop="totalAmount" label="退货金额" align="right">
          <template #default="{ row }"><span style="font-weight: 600; color: #F56C6C;">{{ formatCurrency(row.totalAmount) }}</span></template>
        </el-table-column>
        <el-table-column prop="reason" label="退货原因" width="150" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'completed' ? 'success' : row.status === 'approved' ? 'primary' : 'warning'">
              {{ row.status === 'pending' ? '待审核' : row.status === 'approved' ? '已审核' : '已退货' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="250" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="success" size="small" @click="handleApprove(row)" v-if="row.status === 'pending'"><el-icon><Check /></el-icon> 审核</el-button>
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
import { Search, Plus, View, Check, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ returnNo: '', supplier: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, returnNo: 'PRN-2024-001', poNo: 'PO-2024-002', supplier: 'Apple Supplier', totalAmount: 45600, reason: '产品质量问题', status: 'pending' },
  { id: 2, returnNo: 'PRN-2024-002', poNo: 'PO-2024-004', supplier: 'Samsung Supplier', totalAmount: 32800, reason: '数量不符', status: 'approved' },
  { id: 3, returnNo: 'PRN-2024-003', poNo: 'PO-2024-006', supplier: 'Dell Supplier', totalAmount: 21500, reason: '包装损坏', status: 'completed' },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.returnNo = ''; searchForm.supplier = ''; searchForm.status = '' }
const handleCreate = () => { ElMessage.info('新建退货单') }
const handleView = (row: any) => { ElMessage.info(`查看退货单: ${row.returnNo}`) }
const handleApprove = (row: any) => { ElMessage.success(`退货单 ${row.returnNo} 已审核`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除退货单 ${row.returnNo} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
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