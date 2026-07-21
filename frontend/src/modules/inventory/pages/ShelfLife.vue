<!-- 
  文件路径: frontend/src/modules/inventory/pages/ShelfLife.vue
  功能: 保质期管理 - 管理产品保质期
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
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="正常" value="normal" />
                <el-option label="临期" value="expiring" />
                <el-option label="过期" value="expired" />
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

    <!-- 统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in shelfLifeStats" :key="stat.label">
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
        <el-table-column prop="batchNo" label="批次号" width="140" />
        <el-table-column prop="quantity" label="数量" align="center" width="80" />
        <el-table-column prop="productionDate" label="生产日期" width="120" />
        <el-table-column prop="expiryDate" label="有效期至" width="120">
          <template #default="{ row }">
            <span :style="{ color: row.status === 'expired' ? '#F56C6C' : row.status === 'expiring' ? '#E6A23C' : '#303133', fontWeight: row.status !== 'normal' ? 700 : 400 }">
              {{ row.expiryDate }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="daysRemaining" label="剩余天数" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.daysRemaining > 60 ? 'success' : row.daysRemaining > 30 ? 'warning' : 'danger'">
              {{ row.daysRemaining }}天
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'normal' ? 'success' : row.status === 'expiring' ? 'warning' : 'danger'">
              {{ row.status === 'normal' ? '正常' : row.status === 'expiring' ? '临期' : '过期' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="danger" size="small" @click="handleScrap(row)" v-if="row.status === 'expired'"><el-icon><Delete /></el-icon> 报废</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts>
import { ref, reactive } from 'vue'
import { Search, View, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ product: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const shelfLifeStats = ref([
  { label: '产品总数', value: '1,286', type: 'primary' },
  { label: '正常', value: '1,120', type: 'success' },
  { label: '临期(30天内)', value: '86', type: 'warning' },
  { label: '已过期', value: '45', type: 'danger' },
])

const tableData = ref([
  { id: 1, product: '鲜牛奶', sku: 'MILK-001', batchNo: 'BATCH-2024-010', quantity: 200, productionDate: '2024-11-01', expiryDate: '2024-11-28', daysRemaining: 8, status: 'expiring' },
  { id: 2, product: '面包', sku: 'BREAD-001', batchNo: 'BATCH-2024-011', quantity: 150, productionDate: '2024-11-18', expiryDate: '2024-11-24', daysRemaining: 4, status: 'expiring' },
  { id: 3, product: '果汁', sku: 'JUICE-001', batchNo: 'BATCH-2024-012', quantity: 300, productionDate: '2024-10-01', expiryDate: '2024-10-31', daysRemaining: -10, status: 'expired' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.product = ''; searchForm.status = '' }
const handleView = (row: any) => { ElMessage.info(`查看产品: ${row.product}`) }
const handleScrap = (row: any) => {
  ElMessageBox.confirm(`确定要报废 ${row.product} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
    .then(() => ElMessage.success('报废成功')).catch(() => {})
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
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-card.danger { border-left: 4px solid #F56C6C; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>