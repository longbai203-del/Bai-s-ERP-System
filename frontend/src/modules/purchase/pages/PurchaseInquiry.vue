<!-- 
  文件路径: frontend/src/modules/purchase/pages/PurchaseInquiry.vue
  功能: 询价管理 - 管理采购询价
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="询价编号">
              <el-input v-model="searchForm.inquiryNo" placeholder="请输入询价编号" clearable />
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
                <el-option label="进行中" value="active" />
                <el-option label="已结束" value="ended" />
                <el-option label="已发单" value="ordered" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新建询价</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="inquiryNo" label="询价编号" width="140" />
        <el-table-column prop="product" label="产品名称" />
        <el-table-column prop="quantity" label="询价数量" align="center" />
        <el-table-column prop="supplierCount" label="参与供应商" align="center" />
        <el-table-column prop="bestPrice" label="最低报价" align="right">
          <template #default="{ row }">{{ formatCurrency(row.bestPrice) }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : row.status === 'ended' ? 'warning' : 'info'">
              {{ row.status === 'active' ? '进行中' : row.status === 'ended' ? '已结束' : '已发单' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deadline" label="截止日期" width="120" />
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleCompare(row)"><el-icon><DataLine /></el-icon> 比价</el-button>
            <el-button type="success" size="small" @click="handleOrder(row)" v-if="row.status === 'ended'"><el-icon><Document /></el-icon> 下单</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, View, DataLine, Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ inquiryNo: '', product: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, inquiryNo: 'INQ-2024-001', product: 'iPhone 15 Pro Max', quantity: 100, supplierCount: 5, bestPrice: 4800, status: 'active', deadline: '2024-12-01' },
  { id: 2, inquiryNo: 'INQ-2024-002', product: '三星 Galaxy S24 Ultra', quantity: 80, supplierCount: 4, bestPrice: 4400, status: 'ended', deadline: '2024-11-20' },
  { id: 3, inquiryNo: 'INQ-2024-003', product: 'MacBook Pro 16"', quantity: 50, supplierCount: 3, bestPrice: 9200, status: 'ordered', deadline: '2024-11-15' },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.inquiryNo = ''; searchForm.product = ''; searchForm.status = '' }
const handleCreate = () => { ElMessage.info('新建询价') }
const handleView = (row: any) => { ElMessage.info(`查看询价: ${row.inquiryNo}`) }
const handleCompare = (row: any) => { ElMessage.info(`比价: ${row.inquiryNo}`) }
const handleOrder = (row: any) => { ElMessage.success(`已从 ${row.inquiryNo} 生成采购订单`) }
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>