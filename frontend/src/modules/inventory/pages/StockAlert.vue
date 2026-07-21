<!-- 
  文件路径: frontend/src/modules/inventory/pages/StockAlert.vue
  功能: 库存预警 - 查看库存预警信息
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="产品名称">
              <el-input v-model="searchForm.product" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="预警级别">
              <el-select v-model="searchForm.level" placeholder="请选择级别" clearable style="width: 100%">
                <el-option label="紧急" value="critical" />
                <el-option label="警告" value="warning" />
                <el-option label="提示" value="info" />
              </el-select>
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

    <!-- 预警统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in alertStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="product" label="产品名称" />
        <el-table-column prop="sku" label="SKU" width="120" />
        <el-table-column prop="currentStock" label="当前库存" align="center" width="100">
          <template #default="{ row }">
            <span style="color: #F56C6C; font-weight: 700;">{{ row.currentStock }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="safetyStock" label="安全库存" align="center" width="100" />
        <el-table-column prop="reorderPoint" label="补货点" align="center" width="100" />
        <el-table-column prop="shortage" label="缺货量" align="center" width="100">
          <template #default="{ row }">
            <span style="color: #F56C6C; font-weight: 700;">{{ row.shortage }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="级别" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.level === 'critical' ? 'danger' : row.level === 'warning' ? 'warning' : 'info'">
              {{ row.level === 'critical' ? '紧急' : row.level === 'warning' ? '警告' : '提示' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handlePurchase(row)"><el-icon><ShoppingCart /></el-icon> 生成采购单</el-button>
            <el-button type="warning" size="small" @click="handleTransfer(row)"><el-icon><Refresh /></el-icon> 调拨</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, ShoppingCart, Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ product: '', level: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const alertStats = ref([
  { label: '总预警数', value: '45', type: 'primary' },
  { label: '紧急预警', value: '12', type: 'danger' },
  { label: '警告', value: '18', type: 'warning' },
  { label: '提示', value: '15', type: 'info' },
])

const tableData = ref([
  { id: 1, product: 'AirPods Pro 2', sku: 'APP-2-WH', currentStock: 8, safetyStock: 30, reorderPoint: 25, shortage: 17, level: 'critical' },
  { id: 2, product: 'iPad Pro 12.9"', sku: 'IPP-129-M2-256', currentStock: 12, safetyStock: 25, reorderPoint: 20, shortage: 8, level: 'critical' },
  { id: 3, product: 'iPhone 15 Pro Max', sku: 'IPH-15-PM-256', currentStock: 45, safetyStock: 50, reorderPoint: 40, shortage: 0, level: 'warning' },
  { id: 4, product: 'Apple Watch Ultra 2', sku: 'AWU-2-49', currentStock: 18, safetyStock: 20, reorderPoint: 15, shortage: 0, level: 'info' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.product = ''; searchForm.level = '' }
const handlePurchase = (row: any) => { ElMessage.info(`为 ${row.product} 生成采购单`) }
const handleTransfer = (row: any) => { ElMessage.info(`为 ${row.product} 发起调拨`) }
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.stat-row { margin-bottom: 20px; }
.stat-card { text-align: center; border-radius: 12px; }
.stat-card.primary { border-left: 4px solid #409EFF; }
.stat-card.danger { border-left: 4px solid #F56C6C; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-card.info { border-left: 4px solid #909399; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>