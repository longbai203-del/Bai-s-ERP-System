<!-- 
  文件路径: frontend/src/modules/purchase/pages/PurchaseComparison.vue
  功能: 比价管理 - 供应商报价对比分析
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
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="product" label="产品名称" />
        <el-table-column prop="spec" label="规格型号" />
        <el-table-column prop="quantity" label="数量" align="center" />
        <el-table-column v-for="supplier in suppliers" :key="supplier" :prop="supplier" :label="supplier" align="right">
          <template #default="{ row }">
            <span :class="row[supplier] === row.bestPrice ? 'best-price' : ''">
              {{ formatCurrency(row[supplier] || 0) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="最优价格" align="right" width="120">
          <template #default="{ row }">
            <el-tag type="success">{{ formatCurrency(row.bestPrice) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="推荐供应商" align="center" width="120">
          <template #default="{ row }">
            <el-tag type="primary">{{ row.recommendedSupplier }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'

const searchForm = reactive({ inquiryNo: '', product: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const suppliers = ref(['Apple', 'Samsung', 'Dell', 'Sony'])

const tableData = ref([
  { product: 'iPhone 15 Pro Max', spec: '256GB 黑色', quantity: 100, Apple: 4800, Samsung: 0, Dell: 0, Sony: 0, bestPrice: 4800, recommendedSupplier: 'Apple' },
  { product: '三星 Galaxy S24 Ultra', spec: '512GB 黑色', quantity: 80, Apple: 0, Samsung: 4400, Dell: 0, Sony: 0, bestPrice: 4400, recommendedSupplier: 'Samsung' },
  { product: 'MacBook Pro 16"', spec: 'M3 Pro 36GB', quantity: 50, Apple: 9200, Samsung: 0, Dell: 9600, Sony: 0, bestPrice: 9200, recommendedSupplier: 'Apple' },
  { product: 'iPad Pro 12.9"', spec: 'M2 256GB', quantity: 60, Apple: 5800, Samsung: 0, Dell: 0, Sony: 0, bestPrice: 5800, recommendedSupplier: 'Apple' },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.inquiryNo = ''; searchForm.product = '' }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.best-price { color: #67C23A; font-weight: 700; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>