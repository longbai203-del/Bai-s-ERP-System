<!-- 
  文件路径: frontend/src/modules/inventory/pages/StockCount.vue
  功能: 库存盘点 - 管理库存盘点计划与执行
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="盘点编号">
              <el-input v-model="searchForm.countNo" placeholder="请输入盘点编号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="待盘点" value="pending" />
                <el-option label="盘点中" value="processing" />
                <el-option label="已完成" value="completed" />
                <el-option label="已取消" value="cancelled" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新建盘点</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in statistics" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="countNo" label="盘点编号" width="140" />
        <el-table-column prop="warehouse" label="仓库" width="120" />
        <el-table-column prop="totalItems" label="总SKU数" align="center" />
        <el-table-column prop="countedItems" label="已盘点" align="center" />
        <el-table-column label="进度" align="center" width="150">
          <template #default="{ row }">
            <el-progress :percentage="row.progress" :color="row.progress === 100 ? '#67C23A' : '#409EFF'" />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'completed' ? 'success' : row.status === 'processing' ? 'warning' : row.status === 'pending' ? 'info' : 'danger'">
              {{ row.status === 'pending' ? '待盘点' : row.status === 'processing' ? '盘点中' : row.status === 'completed' ? '已完成' : '已取消' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleCount(row)" v-if="row.status !== 'completed'"><el-icon><Edit /></el-icon> 盘点</el-button>
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

const searchForm = reactive({ countNo: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, countNo: 'SC-2024-001', warehouse: '利雅得仓库', totalItems: 500, countedItems: 500, progress: 100, status: 'completed', createdAt: '2024-11-20 10:30' },
  { id: 2, countNo: 'SC-2024-002', warehouse: '吉达仓库', totalItems: 350, countedItems: 200, progress: 57, status: 'processing', createdAt: '2024-11-19 14:20' },
  { id: 3, countNo: 'SC-2024-003', warehouse: '达曼仓库', totalItems: 280, countedItems: 0, progress: 0, status: 'pending', createdAt: '2024-11-18 09:00' },
])

const statistics = ref([
  { label: '盘点计划', value: '12', type: 'primary' },
  { label: '盘点中', value: '3', type: 'warning' },
  { label: '已完成', value: '8', type: 'success' },
  { label: '差异率', value: '0.8%', type: 'primary' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.countNo = ''; searchForm.status = '' }
const handleCreate = () => { ElMessage.info('新建盘点') }
const handleView = (row: any) => { ElMessage.info(`查看盘点: ${row.countNo}`) }
const handleCount = (row: any) => { ElMessage.info(`开始盘点: ${row.countNo}`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除盘点 ${row.countNo} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
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
.stat-card.primary { border-left: 4px solid #409EFF; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>