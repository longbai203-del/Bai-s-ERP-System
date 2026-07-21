<!-- 
  文件路径: frontend/src/modules/ai/pages/PurchaseSuggestion.vue
  功能: AI采购建议 - 智能采购优化建议
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="分析维度">
              <el-select v-model="searchForm.dimension" style="width: 100%">
                <el-option label="供应商优化" value="supplier" />
                <el-option label="价格优化" value="price" />
                <el-option label="综合建议" value="comprehensive" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleAnalyze"><el-icon><Monitor /></el-icon> 分析</el-button>
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in savingStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <template #header><span>AI 采购建议</span></template>
      <el-timeline>
        <el-timeline-item
          v-for="suggestion in suggestions"
          :key="suggestion.id"
          :timestamp="suggestion.priority"
          :type="suggestion.type"
          placement="top"
        >
          <el-card>
            <div class="suggestion-header">
              <span class="suggestion-title">{{ suggestion.title }}</span>
              <el-tag :type="suggestion.impact === '高' ? 'success' : suggestion.impact === '中' ? 'warning' : 'info'">
                预计节省: {{ suggestion.savings }}
              </el-tag>
            </div>
            <div class="suggestion-desc">{{ suggestion.desc }}</div>
            <div class="suggestion-actions">
              <el-button type="primary" size="small" @click="handleApply(suggestion)">应用建议</el-button>
              <el-button size="small" @click="handleDetail(suggestion)">查看详情</el-button>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Monitor, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ dimension: 'comprehensive' })

const savingStats = ref([
  { label: '建议节省总额', value: 'SAR 856,000', type: 'success' },
  { label: '优化供应商数', value: '12', type: 'primary' },
  { label: '价格优化建议', value: '28条', type: 'warning' },
  { label: '综合评分', value: '92分', type: 'primary' },
])

const suggestions = ref([
  { id: 1, title: 'Apple Supplier 批量采购折扣', desc: '建议增加Apple Supplier采购量至500台，可获得5%批量折扣', savings: 'SAR 42,800', priority: '高', impact: '高', type: 'success' },
  { id: 2, title: 'Samsung Supplier 价格谈判', desc: '当前价格高于市场均价8.5%，建议重新谈判', savings: 'SAR 28,600', priority: '中', impact: '中', type: 'warning' },
  { id: 3, title: 'Dell Supplier 替代方案', desc: '发现更优供应商，可降低采购成本12%', savings: 'SAR 35,200', priority: '高', impact: '高', type: 'success' },
])

const handleAnalyze = () => { ElMessage.success('分析完成') }
const handleExport = () => { ElMessage.success('导出完成') }
const handleApply = (suggestion: any) => { ElMessage.success(`已应用建议: ${suggestion.title}`) }
const handleDetail = (suggestion: any) => { ElMessage.info(`查看建议详情: ${suggestion.title}`) }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.stat-row { margin-bottom: 20px; }
.stat-card { text-align: center; border-radius: 12px; padding: 8px 0; }
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-card.primary { border-left: 4px solid #409EFF; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
.suggestion-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.suggestion-title { font-size: 16px; font-weight: 600; }
.suggestion-desc { color: #606266; margin-bottom: 8px; }
.suggestion-actions { display: flex; gap: 8px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>