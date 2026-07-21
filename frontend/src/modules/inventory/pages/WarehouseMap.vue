<!-- 
  文件路径: frontend/src/modules/inventory/pages/WarehouseMap.vue
  功能: 仓库地图 - 可视化仓库货位布局
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-select v-model="selectedWarehouse" placeholder="选择仓库" style="width: 100%">
            <el-option label="利雅得仓库" value="riyadh" />
            <el-option label="吉达仓库" value="jeddah" />
            <el-option label="达曼仓库" value="dammam" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="handleRefresh"><el-icon><Refresh /></el-icon> 刷新</el-button>
        </el-col>
        <el-col :span="14">
          <div class="legend">
            <span class="legend-item"><span class="legend-color" style="background: #67C23A;"></span> 充足</span>
            <span class="legend-item"><span class="legend-color" style="background: #409EFF;"></span> 正常</span>
            <span class="legend-item"><span class="legend-color" style="background: #E6A23C;"></span> 偏低</span>
            <span class="legend-item"><span class="legend-color" style="background: #F56C6C;"></span> 紧缺</span>
            <span class="legend-item"><span class="legend-color" style="background: #909399;"></span> 空位</span>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card>
      <div class="warehouse-grid">
        <div v-for="(row, rowIndex) in warehouseLayout" :key="rowIndex" class="grid-row">
          <div class="row-label">{{ getRowLabel(rowIndex) }}</div>
          <div
            v-for="(cell, colIndex) in row"
            :key="colIndex"
            class="grid-cell"
            :class="cell.status"
            @click="handleCellClick(rowIndex, colIndex)"
          >
            <div class="cell-content">
              <div class="cell-sku">{{ cell.sku || '' }}</div>
              <div class="cell-qty">{{ cell.quantity || '' }}</div>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 货位详情弹窗 -->
    <el-dialog v-model="dialogVisible" title="货位详情" width="400px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="货位">{{ selectedCell.location }}</el-descriptions-item>
        <el-descriptions-item label="产品">{{ selectedCell.product || '空位' }}</el-descriptions-item>
        <el-descriptions-item label="SKU">{{ selectedCell.sku || '-' }}</el-descriptions-item>
        <el-descriptions-item label="数量">{{ selectedCell.quantity || 0 }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="selectedCell.status === 'full' ? 'success' : selectedCell.status === 'normal' ? 'primary' : selectedCell.status === 'low' ? 'warning' : selectedCell.status === 'empty' ? 'info' : 'danger'">
            {{ getStatusLabel(selectedCell.status) }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const selectedWarehouse = ref('riyadh')
const dialogVisible = ref(false)

const selectedCell = ref({
  location: '',
  product: '',
  sku: '',
  quantity: 0,
  status: '',
})

const warehouseLayout = ref([
  [
    { sku: 'IPH-15', quantity: 156, status: 'full' },
    { sku: 'SGS-S24', quantity: 89, status: 'full' },
    { sku: 'MBP-16', quantity: 34, status: 'normal' },
    { sku: 'IPP-129', quantity: 12, status: 'low' },
    { sku: 'APP-2', quantity: 8, status: 'critical' },
    { sku: '', quantity: 0, status: 'empty' },
  ],
  [
    { sku: 'AWU-2', quantity: 18, status: 'normal' },
    { sku: 'SWH-1000', quantity: 25, status: 'full' },
    { sku: 'DXP-16', quantity: 15, status: 'normal' },
    { sku: 'TPX-1', quantity: 10, status: 'low' },
    { sku: '', quantity: 0, status: 'empty' },
    { sku: '', quantity: 0, status: 'empty' },
  ],
  [
    { sku: 'HMP-60', quantity: 45, status: 'full' },
    { sku: '', quantity: 0, status: 'empty' },
    { sku: '', quantity: 0, status: 'empty' },
    { sku: '', quantity: 0, status: 'empty' },
    { sku: '', quantity: 0, status: 'empty' },
    { sku: '', quantity: 0, status: 'empty' },
  ],
])

const getRowLabel = (index: number) => {
  return String.fromCharCode(65 + index)
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    full: '充足',
    normal: '正常',
    low: '偏低',
    critical: '紧缺',
    empty: '空位',
  }
  return map[status] || status
}

const handleRefresh = () => {
  ElMessage.success('已刷新')
}

const handleCellClick = (rowIndex: number, colIndex: number) => {
  const cell = warehouseLayout.value[rowIndex][colIndex]
  selectedCell.value = {
    location: getRowLabel(rowIndex) + (colIndex + 1),
    product: cell.sku ? 'iPhone 15 Pro Max' : '',
    sku: cell.sku || '',
    quantity: cell.quantity,
    status: cell.status,
  }
  dialogVisible.value = true
}
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.legend { display: flex; justify-content: flex-end; align-items: center; gap: 16px; }
.legend-item { display: flex; align-items: center; gap: 4px; font-size: 13px; color: #666; }
.legend-color { width: 16px; height: 16px; border-radius: 4px; }
.warehouse-grid { overflow-x: auto; }
.grid-row { display: flex; align-items: center; margin-bottom: 8px; }
.row-label { width: 30px; text-align: center; font-weight: 600; color: #666; margin-right: 8px; }
.grid-cell { width: 100px; height: 80px; border: 1px solid #d0d7de; border-radius: 6px; margin-right: 8px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
.grid-cell:last-child { margin-right: 0; }
.grid-cell:hover { transform: scale(1.05); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
.grid-cell.full { background: #E8F5E9; border-color: #66BB6A; }
.grid-cell.normal { background: #E3F2FD; border-color: #42A5F5; }
.grid-cell.low { background: #FFF3E0; border-color: #FFA726; }
.grid-cell.critical { background: #FFEBEE; border-color: #EF5350; }
.grid-cell.empty { background: #F5F5F5; border-color: #BDBDBD; }
.cell-content { text-align: center; }
.cell-sku { font-size: 12px; font-weight: 600; color: #333; }
.cell-qty { font-size: 10px; color: #666; }
</style>