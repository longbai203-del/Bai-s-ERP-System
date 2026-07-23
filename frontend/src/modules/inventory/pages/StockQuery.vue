<!-- 
  文件路径: frontend/src/modules/inventory/pages/StockQuery.vue
  功能: 库存查询 - 实时库存查询与筛选
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="产品名称">
              <el-input v-model="searchForm.product" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="SKU">
              <el-input v-model="searchForm.sku" placeholder="请输入SKU" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="分类">
              <el-select v-model="searchForm.category" placeholder="请选择分类" clearable style="width: 100%">
                <el-option label="电子产品" value="electronics" />
                <el-option label="服装鞋帽" value="clothing" />
                <el-option label="食品饮料" value="food" />
                <el-option label="家居用品" value="home" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="仓库">
              <el-select v-model="searchForm.warehouse" placeholder="请选择仓库" clearable style="width: 100%">
                <el-option label="全部" value="all" />
                <el-option label="利雅得仓库" value="riyadh" />
                <el-option label="吉达仓库" value="jeddah" />
                <el-option label="达曼仓库" value="dammam" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 库存摘要 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="4" v-for="stat in stockStats" :key="stat.label">
        <el-card class="stat-card">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-change" :class="stat.trend">{{ stat.trend === 'up' ? '↑' : '↓' }} {{ Math.abs(stat.change) }}%</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="sku" label="SKU" width="120" />
        <el-table-column prop="product" label="产品名称" min-width="180" />
        <el-table-column prop="category" label="分类" width="100" />
        <el-table-column prop="quantity" label="库存数量" align="center" width="120">
          <template #default="{ row }">
            <span :style="{ color: row.quantity < row.safetyStock ? '#F56C6C' : '#303133', fontWeight: row.quantity < row.safetyStock ? 700 : 400 }">
              {{ row.quantity }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="safetyStock" label="安全库存" align="center" width="100" />
        <el-table-column prop="warehouse" label="仓库" width="100" />
        <el-table-column label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.quantity > row.safetyStock * 2 ? 'success' : row.quantity > row.safetyStock ? 'warning' : 'danger'">
              {{ row.quantity > row.safetyStock * 2 ? '充足' : row.quantity > row.safetyStock ? '正常' : '紧缺' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastUpdated" label="最后更新" width="160" />
        <el-table-column label="操作" align="center" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleDetail(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleAdjust(row)"><el-icon><Edit /></el-icon> 调整</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  Plus,
  Search,
  Refresh,
  View,
  Edit,
  Delete
} from '@element-plus/icons-vue'
// ============================================================
// API 导入
// ============================================================
import {  } from '@/api/modules/inventory'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ product: '', sku: '', category: '', warehouse: 'all' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const stockStats = ref([
  { label: '总库存数量', value: '285,600', change: 3.2, trend: 'up' },
  { label: '总库存金额', value: 'SAR 8,560,000', change: 5.8, trend: 'up' },
  { label: 'SKU总数', value: '1,286', change: 2.1, trend: 'up' },
  { label: '库存紧缺', value: '45', change: -8.5, trend: 'down' },
])

const tableData = ref([
  { id: 1, sku: 'IPH-15-PM-256', product: 'iPhone 15 Pro Max 256GB', category: '电子产品', quantity: 156, safetyStock: 50, warehouse: '利雅得仓库', lastUpdated: '2024-11-20 10:30' },
  { id: 2, sku: 'SGS-S24-U-512', product: '三星 Galaxy S24 Ultra', category: '电子产品', quantity: 89, safetyStock: 40, warehouse: '利雅得仓库', lastUpdated: '2024-11-20 10:25' },
  { id: 3, sku: 'MBP-16-M3-512', product: 'MacBook Pro 16" M3', category: '电子产品', quantity: 34, safetyStock: 30, warehouse: '吉达仓库', lastUpdated: '2024-11-20 10:20' },
  { id: 4, sku: 'IPP-129-M2-256', product: 'iPad Pro 12.9" M2', category: '电子产品', quantity: 12, safetyStock: 25, warehouse: '利雅得仓库', lastUpdated: '2024-11-20 10:15' },
  { id: 5, sku: 'APP-2-WH', product: 'AirPods Pro 2', category: '电子产品', quantity: 8, safetyStock: 30, warehouse: '达曼仓库', lastUpdated: '2024-11-20 10:10' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.product = ''; searchForm.sku = ''; searchForm.category = ''; searchForm.warehouse = 'all' }
const handleExport = () => { ElMessage.success('导出完成') }
const handleDetail = (row: any) => { ElMessage.info(`查看产品: ${row.product}`) }
const handleAdjust = (row: any) => { ElMessage.info(`调整库存: ${row.product}`) }
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
.stat-change { font-size: 12px; }
.stat-change.up { color: #67C23A; }
.stat-change.down { color: #F56C6C; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>
