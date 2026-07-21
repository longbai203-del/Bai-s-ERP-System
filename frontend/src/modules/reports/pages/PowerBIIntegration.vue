<!-- 
  文件路径: frontend/src/modules/reports/pages/PowerBIIntegration.vue
  功能: PowerBI对接 - PowerBI集成
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3>PowerBI 集成</h3>
        <el-tag type="success" size="large">已连接</el-tag>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header><span>连接配置</span></template>
          <el-form :model="config" label-width="120px">
            <el-form-item label="工作区">
              <el-select v-model="config.workspace" style="width: 100%">
                <el-option label="Bai's ERP 工作区" value="erp" />
                <el-option label="销售分析" value="sales" />
                <el-option label="财务分析" value="finance" />
              </el-select>
            </el-form-item>
            <el-form-item label="数据集">
              <el-select v-model="config.dataset" style="width: 100%">
                <el-option label="销售数据集" value="sales_dataset" />
                <el-option label="财务数据集" value="finance_dataset" />
                <el-option label="库存数据集" value="inventory_dataset" />
              </el-select>
            </el-form-item>
            <el-form-item label="自动刷新">
              <el-switch v-model="config.autoRefresh" />
            </el-form-item>
            <el-form-item label="刷新频率" v-if="config.autoRefresh">
              <el-select v-model="config.refreshInterval" style="width: 100%">
                <el-option label="每小时" value="hourly" />
                <el-option label="每天" value="daily" />
                <el-option label="每周" value="weekly" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" style="width: 100%;" @click="handleConnect">
                <el-icon><Connection /></el-icon> 连接PowerBI
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header><span>数据同步状态</span></template>
          <div class="sync-status">
            <div class="status-item">
              <span class="status-label">最后同步</span>
              <span class="status-value">2024-11-20 10:30:00</span>
            </div>
            <div class="status-item">
              <span class="status-label">同步状态</span>
              <el-tag type="success">成功</el-tag>
            </div>
            <div class="status-item">
              <span class="status-label">同步记录数</span>
              <span class="status-value">2,856 条</span>
            </div>
            <div class="status-item">
              <span class="status-label">下次同步</span>
              <span class="status-value">2024-11-21 10:30:00</span>
            </div>
          </div>
          <el-divider />
          <div class="sync-actions">
            <el-button type="primary" @click="handleSyncNow"><el-icon><Refresh /></el-icon> 立即同步</el-button>
            <el-button @click="handleViewDashboard"><el-icon><Monitor /></el-icon> 查看仪表盘</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px">
      <template #header><span>可用数据集</span></template>
      <el-table :data="datasets" style="width: 100%" stripe>
        <el-table-column prop="name" label="数据集名称" />
        <el-table-column prop="records" label="记录数" align="center" />
        <el-table-column prop="lastUpdated" label="最后更新" width="180" />
        <el-table-column label="操作" align="center" width="150">
          <template #default>
            <el-button type="primary" size="small">刷新</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Connection, Refresh, Monitor } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const config = reactive({
  workspace: 'erp',
  dataset: 'sales_dataset',
  autoRefresh: true,
  refreshInterval: 'daily',
})

const datasets = ref([
  { name: '销售数据集', records: 2856, lastUpdated: '2024-11-20 10:30' },
  { name: '财务数据集', records: 1856, lastUpdated: '2024-11-20 10:25' },
  { name: '库存数据集', records: 1286, lastUpdated: '2024-11-20 10:20' },
])

const handleConnect = () => { ElMessage.success('PowerBI连接成功') }
const handleSyncNow = () => {
  ElMessage.loading('同步中...', { duration: 1500 })
  setTimeout(() => { ElMessage.success('同步完成') }, 1500)
}
const handleViewDashboard = () => { ElMessage.info('正在打开PowerBI仪表盘...') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.filter-card h3 { margin: 0; }
.sync-status { padding: 8px 0; }
.status-item { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f0f0f0; }
.status-item:last-child { border-bottom: none; }
.status-label { color: #909399; }
.status-value { font-weight: 500; }
.sync-actions { display: flex; gap: 12px; }
.sync-actions .el-button { flex: 1; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>