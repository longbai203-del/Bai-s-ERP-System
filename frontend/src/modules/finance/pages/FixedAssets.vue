<!-- 
  文件路径: frontend/src/modules/finance/pages/FixedAssets.vue
  功能: 固定资产 - 管理固定资产
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="资产编号">
              <el-input v-model="searchForm.assetNo" placeholder="请输入资产编号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="资产名称">
              <el-input v-model="searchForm.assetName" placeholder="请输入资产名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="在用" value="active" />
                <el-option label="闲置" value="idle" />
                <el-option label="维修" value="repair" />
                <el-option label="报废" value="scrap" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新增资产</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="assetNo" label="资产编号" width="120" />
        <el-table-column prop="assetName" label="资产名称" />
        <el-table-column prop="category" label="类别" width="100" />
        <el-table-column prop="purchaseDate" label="购买日期" width="120" />
        <el-table-column prop="cost" label="原值" align="right">
          <template #default="{ row }">{{ formatCurrency(row.cost) }}</template>
        </el-table-column>
        <el-table-column prop="depreciation" label="累计折旧" align="right">
          <template #default="{ row }">{{ formatCurrency(row.depreciation) }}</template>
        </el-table-column>
        <el-table-column prop="netValue" label="净值" align="right">
          <template #default="{ row }">{{ formatCurrency(row.netValue) }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : row.status === 'idle' ? 'info' : row.status === 'repair' ? 'warning' : 'danger'">
              {{ row.status === 'active' ? '在用' : row.status === 'idle' ? '闲置' : row.status === 'repair' ? '维修' : '报废' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150" fixed="right">
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

const searchForm = reactive({ assetNo: '', assetName: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, assetNo: 'FA-001', assetName: '服务器', category: '设备', purchaseDate: '2023-01-15', cost: 125000, depreciation: 25000, netValue: 100000, status: 'active' },
  { id: 2, assetNo: 'FA-002', assetName: '办公桌椅', category: '家具', purchaseDate: '2023-03-20', cost: 58000, depreciation: 11600, netValue: 46400, status: 'active' },
  { id: 3, assetNo: 'FA-003', assetName: '车辆', category: '运输', purchaseDate: '2022-06-10', cost: 180000, depreciation: 72000, netValue: 108000, status: 'active' },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.assetNo = ''; searchForm.assetName = ''; searchForm.status = '' }
const handleCreate = () => { ElMessage.info('新增资产') }
const handleView = (row: any) => { ElMessage.info(`查看资产: ${row.assetNo}`) }
const handleEdit = (row: any) => { ElMessage.info(`编辑资产: ${row.assetNo}`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除资产 ${row.assetNo} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
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