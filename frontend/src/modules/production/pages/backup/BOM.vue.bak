<!-- 
  文件路径: frontend/src/modules/production/pages/BOM.vue
  功能: BOM管理 - 物料清单管理
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="BOM编号">
              <el-input v-model="searchForm.bomNo" placeholder="请输入BOM编号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产品名称">
              <el-input v-model="searchForm.product" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="草稿" value="draft" />
                <el-option label="已审核" value="approved" />
                <el-option label="已发布" value="published" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新建BOM</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="bomNo" label="BOM编号" width="140" />
        <el-table-column prop="product" label="产品名称" />
        <el-table-column prop="version" label="版本" align="center" width="80" />
        <el-table-column prop="materialCount" label="物料数量" align="center" />
        <el-table-column prop="totalCost" label="总成本" align="right">
          <template #default="{ row }">{{ formatCurrency(row.totalCost) }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'published' ? 'success' : row.status === 'approved' ? 'primary' : 'info'">
              {{ row.status === 'draft' ? '草稿' : row.status === 'approved' ? '已审核' : '已发布' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建日期" width="160" />
        <el-table-column label="操作" align="center" width="250" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon></el-button>
            <el-button type="success" size="small" @click="handleApprove(row)" v-if="row.status === 'draft'"><el-icon><Check /></el-icon> 审核</el-button>
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

const searchForm = reactive({ bomNo: '', product: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, bomNo: 'BOM-2024-001', product: 'iPhone 15 Pro Max', version: 'V1.0', materialCount: 32, totalCost: 4250, status: 'published', createdAt: '2024-11-20 10:30' },
  { id: 2, bomNo: 'BOM-2024-002', product: '三星 Galaxy S24 Ultra', version: 'V1.0', materialCount: 28, totalCost: 3850, status: 'approved', createdAt: '2024-11-18 14:20' },
  { id: 3, bomNo: 'BOM-2024-003', product: 'MacBook Pro 16"', version: 'V2.1', materialCount: 45, totalCost: 8200, status: 'draft', createdAt: '2024-11-15 09:00' },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.bomNo = ''; searchForm.product = ''; searchForm.status = '' }
const handleCreate = () => { ElMessage.info('新建BOM') }
const handleView = (row: any) => { ElMessage.info(`查看BOM: ${row.bomNo}`) }
const handleEdit = (row: any) => { ElMessage.info(`编辑BOM: ${row.bomNo}`) }
const handleApprove = (row: any) => { ElMessage.success(`BOM ${row.bomNo} 已审核通过`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除BOM ${row.bomNo} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
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