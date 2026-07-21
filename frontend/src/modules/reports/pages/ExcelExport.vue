<!-- 
  文件路径: frontend/src/modules/reports/pages/ExcelExport.vue
  功能: Excel导出 - Excel导出配置
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3>Excel导出</h3>
        <el-tag type="success" size="large">支持 .xlsx 格式</el-tag>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header><span>导出配置</span></template>
          <el-form :model="config" label-width="120px">
            <el-form-item label="报表类型" prop="reportType">
              <el-select v-model="config.reportType" placeholder="请选择报表类型" style="width: 100%">
                <el-option label="销售报表" value="sales" />
                <el-option label="采购报表" value="purchase" />
                <el-option label="库存报表" value="inventory" />
                <el-option label="财务报表" value="finance" />
              </el-select>
            </el-form-item>
            <el-form-item label="日期范围" prop="dateRange">
              <el-date-picker v-model="config.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%" />
            </el-form-item>
            <el-form-item label="导出格式" prop="format">
              <el-radio-group v-model="config.format">
                <el-radio label="xlsx">XLSX</el-radio>
                <el-radio label="xls">XLS</el-radio>
                <el-radio label="csv">CSV</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="包含图表" prop="includeChart">
              <el-switch v-model="config.includeChart" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="large" style="width: 100%;" @click="handleExport">
                <el-icon><Download /></el-icon> 导出Excel
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header><span>导出历史</span></template>
          <el-table :data="historyData" style="width: 100%">
            <el-table-column prop="fileName" label="文件名" />
            <el-table-column prop="size" label="大小" width="100" />
            <el-table-column prop="createdAt" label="导出时间" width="160" />
            <el-table-column label="操作" align="center" width="100">
              <template #default>
                <el-button type="primary" size="small">下载</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const config = reactive({
  reportType: 'sales',
  dateRange: [] as [Date, Date] | [],
  format: 'xlsx',
  includeChart: true,
})

const historyData = ref([
  { fileName: '销售报表_202411.xlsx', size: '2.5MB', createdAt: '2024-11-20 10:30' },
  { fileName: '采购报表_202411.xlsx', size: '1.8MB', createdAt: '2024-11-19 14:20' },
  { fileName: '库存报表_202411.xlsx', size: '3.2MB', createdAt: '2024-11-18 09:00' },
])

const handleExport = () => {
  ElMessage.loading('正在生成Excel...', { duration: 2000 })
  setTimeout(() => {
    ElMessage.success('Excel导出完成，文件已开始下载')
  }, 2000)
}
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.filter-card h3 { margin: 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>