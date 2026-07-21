<!-- 
  文件路径: frontend/src/modules/reports/pages/ReportDashboard.vue
  功能: 报表中心 - 报表中心首页
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="报表类别">
              <el-select v-model="searchForm.category" placeholder="请选择类别" clearable style="width: 100%">
                <el-option label="全部" value="all" />
                <el-option label="销售报表" value="sales" />
                <el-option label="采购报表" value="purchase" />
                <el-option label="库存报表" value="inventory" />
                <el-option label="财务报表" value="finance" />
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

    <!-- 报表快捷入口 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in reportStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type" @click="handleNavigate(stat.path)">
          <div class="stat-icon">
            <el-icon :size="32"><component :is="stat.icon" /></el-icon>
          </div>
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.count }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 报表列表 -->
    <el-card>
      <template #header><span>所有报表</span></template>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="name" label="报表名称" min-width="200" />
        <el-table-column prop="category" label="类别" width="120">
          <template #default="{ row }">
            <el-tag :type="getCategoryType(row.category)">{{ row.category }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="200" />
        <el-table-column prop="updatedAt" label="更新时间" width="180" />
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon> 查看</el-button>
            <el-button type="success" size="small" @click="handleExport(row)"><el-icon><Download /></el-icon> 导出</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, View, Download, TrendCharts, ShoppingCart, Box, Money } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ category: 'all' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const reportStats = ref([
  { label: '销售报表', count: '12', icon: 'TrendCharts', type: 'primary', path: '/reports/sales' },
  { label: '采购报表', count: '8', icon: 'ShoppingCart', type: 'success', path: '/reports/purchase' },
  { label: '库存报表', count: '10', icon: 'Box', type: 'warning', path: '/reports/inventory' },
  { label: '财务报表', count: '15', icon: 'Money', type: 'danger', path: '/reports/finance' },
])

const tableData = ref([
  { id: 1, name: '月度销售汇总', category: '销售报表', description: '每月销售数据汇总分析', updatedAt: '2024-11-20 10:30' },
  { id: 2, name: '采购成本分析', category: '采购报表', description: '采购成本趋势与供应商分析', updatedAt: '2024-11-19 14:20' },
  { id: 3, name: '库存周转率', category: '库存报表', description: '库存周转率与呆滞分析', updatedAt: '2024-11-18 09:00' },
  { id: 4, name: '利润表', category: '财务报表', description: '月度/季度/年度利润分析', updatedAt: '2024-11-17 16:30' },
])

const loading = ref(false)

const getCategoryType = (category: string) => {
  const map: Record<string, string> = { '销售报表': 'primary', '采购报表': 'success', '库存报表': 'warning', '财务报表': 'danger' }
  return map[category] || 'info'
}

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.category = 'all' }
const handleNavigate = (path: string) => { ElMessage.info(`跳转到: ${path}`) }
const handleView = (row: any) => { ElMessage.info(`查看报表: ${row.name}`) }
const handleExport = (row: any) => { ElMessage.success(`正在导出 ${row.name}`) }
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.stat-row { margin-bottom: 20px; }
.stat-card { text-align: center; border-radius: 12px; cursor: pointer; transition: all 0.3s; padding: 16px 0; }
.stat-card:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(0,0,0,0.12); }
.stat-card.primary { border-left: 4px solid #409EFF; }
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-card.danger { border-left: 4px solid #F56C6C; }
.stat-icon { margin-bottom: 8px; color: #409EFF; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 24px; font-weight: 700; color: #303133; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>