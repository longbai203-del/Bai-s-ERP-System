<!-- 
  文件路径: frontend/src/modules/ai/pages/AIReport.vue
  功能: AI报表 - 智能报表生成
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="报表类型">
              <el-select v-model="searchForm.type" style="width: 100%">
                <el-option label="销售报表" value="sales" />
                <el-option label="财务报表" value="finance" />
                <el-option label="综合运营" value="operation" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="期间">
              <el-date-picker v-model="searchForm.period" type="month" placeholder="选择期间" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleGenerate"><el-icon><Monitor /></el-icon> 生成报表</el-button>
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- AI 报表摘要 -->
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>🤖 AI 智能分析报告</span>
          <el-tag type="warning" size="small">AI生成</el-tag>
        </div>
      </template>
      <div class="report-summary">
        <h4>📊 2024年11月 销售运营报告</h4>
        <div class="summary-grid">
          <div class="summary-item" v-for="item in reportSummary" :key="item.label">
            <span class="summary-label">{{ item.label }}</span>
            <span class="summary-value" :class="item.trend">{{ item.value }}</span>
          </div>
        </div>
        <el-divider />
        <div class="insight-section">
          <h4>💡 AI 洞察</h4>
          <ul>
            <li v-for="insight in insights" :key="insight">{{ insight }}</li>
          </ul>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Monitor, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ type: 'sales', period: new Date() })

const reportSummary = ref([
  { label: '总销售额', value: 'SAR 12,856,000', trend: 'up' },
  { label: '环比增长', value: '+12.5%', trend: 'up' },
  { label: '订单数', value: '1,286', trend: 'up' },
  { label: '客单价', value: 'SAR 9,998', trend: 'up' },
  { label: '利润率', value: '33.4%', trend: 'up' },
  { label: '客户数', value: '2,856', trend: 'up' },
])

const insights = ref([
  '📈 电子产品销售额同比增长18.5%，为主要增长驱动力',
  '🎯 利雅得地区贡献总销售额的42%，表现优于其他区域',
  '⚠️ 服装品类利润率下降3.2%，建议关注库存结构调整',
  '💡 大客户（月消费>10万SAR）复购率达85%，建议加强大客户服务',
])

const handleGenerate = () => { ElMessage.success('报表生成完成') }
const handleExport = () => { ElMessage.success('导出完成') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.report-summary { padding: 8px 0; }
.report-summary h4 { margin: 0 0 16px 0; font-size: 18px; }
.summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.summary-item { display: flex; flex-direction: column; padding: 12px; background: #f5f7fa; border-radius: 8px; }
.summary-label { color: #909399; font-size: 13px; }
.summary-value { font-size: 20px; font-weight: 700; }
.summary-value.up { color: #67C23A; }
.summary-value.down { color: #F56C6C; }
.insight-section ul { padding-left: 20px; margin: 8px 0 0; }
.insight-section li { padding: 6px 0; color: #606266; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>