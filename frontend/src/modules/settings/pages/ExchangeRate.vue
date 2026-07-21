<!-- 
  文件路径: frontend/src/modules/settings/pages/ExchangeRate.vue
  功能: 汇率管理 - 管理汇率
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>汇率管理</h2>
          <p class="subtitle">管理实时汇率</p>
        </div>
        <div>
          <el-button type="primary" @click="handleSave">保存汇率</el-button>
          <el-button @click="handleFetchRates"><el-icon><Refresh /></el-icon> 获取实时汇率</el-button>
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-table :data="tableData" style="width: 100%" stripe>
        <el-table-column prop="currency" label="币种" width="120" />
        <el-table-column prop="code" label="代码" width="100" />
        <el-table-column prop="rate" label="买入价" align="right">
          <template #default="{ row }">
            <el-input-number v-model="row.buyRate" :precision="4" controls-position="right" style="width: 120px" />
          </template>
        </el-table-column>
        <el-table-column prop="rate" label="卖出价" align="right">
          <template #default="{ row }">
            <el-input-number v-model="row.sellRate" :precision="4" controls-position="right" style="width: 120px" />
          </template>
        </el-table-column>
        <el-table-column prop="rate" label="中间价" align="right">
          <template #default="{ row }">
            <el-input-number v-model="row.midRate" :precision="4" controls-position="right" style="width: 120px" />
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="180" />
        <el-table-column label="趋势" align="center" width="80">
          <template #default="{ row }">
            <el-tag :type="row.trend === 'up' ? 'success' : row.trend === 'down' ? 'danger' : 'info'">
              {{ row.trend === 'up' ? '↑' : row.trend === 'down' ? '↓' : '→' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const tableData = ref([
  { id: 1, currency: '美元', code: 'USD', buyRate: 3.7500, sellRate: 3.7600, midRate: 3.7550, updatedAt: '2024-11-20 10:30', trend: 'up' },
  { id: 2, currency: '欧元', code: 'EUR', buyRate: 4.0800, sellRate: 4.0900, midRate: 4.0850, updatedAt: '2024-11-20 10:30', trend: 'down' },
  { id: 3, currency: '英镑', code: 'GBP', buyRate: 4.7500, sellRate: 4.7600, midRate: 4.7550, updatedAt: '2024-11-20 10:30', trend: 'up' },
  { id: 4, currency: '人民币', code: 'CNY', buyRate: 0.5100, sellRate: 0.5150, midRate: 0.5125, updatedAt: '2024-11-20 10:30', trend: 'info' },
])

const handleSave = () => { ElMessage.success('汇率已保存') }
const handleFetchRates = () => {
  ElMessage.loading('获取实时汇率...', { duration: 1500 })
  setTimeout(() => { ElMessage.success('汇率已更新') }, 1500)
}
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
</style>