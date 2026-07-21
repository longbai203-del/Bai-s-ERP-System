<!-- 
  文件路径: frontend/src/modules/ai/pages/AIDashboard.vue
  功能: AI中心首页 - AI功能总览
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>AI 智能中心</h2>
          <p class="subtitle">人工智能驱动的业务洞察与自动化</p>
        </div>
        <div>
          <el-tag type="success" size="large">🤖 AI 引擎运行中</el-tag>
        </div>
      </div>
    </el-card>

    <!-- AI 能力卡片 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="6" v-for="capability in aiCapabilities" :key="capability.label">
        <el-card class="capability-card" @click="handleNavigate(capability.path)">
          <div class="capability-icon" :style="{ background: capability.color }">
            <el-icon :size="28"><component :is="capability.icon" /></el-icon>
          </div>
          <div class="capability-label">{{ capability.label }}</div>
          <div class="capability-desc">{{ capability.desc }}</div>
          <div class="capability-status">
            <el-tag :type="capability.status === 'ready' ? 'success' : capability.status === 'training' ? 'warning' : 'info'" size="small">
              {{ capability.status === 'ready' ? '已就绪' : capability.status === 'training' ? '训练中' : '开发中' }}
            </el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- AI 统计 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="8" v-for="stat in aiStats" :key="stat.label">
        <el-card class="stat-card">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-change" :class="stat.trend">{{ stat.trend === 'up' ? '↑' : '↓' }} {{ Math.abs(stat.change) }}%</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- AI 活动 -->
    <el-card style="margin-top: 20px">
      <template #header><span>AI 活动日志</span></template>
      <el-timeline>
        <el-timeline-item
          v-for="log in activityLogs"
          :key="log.id"
          :timestamp="log.time"
          :type="log.type"
        >
          {{ log.content }}
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { TrendCharts, Box, ShoppingCart, Money, DataAnalysis, ChatDotSquare, Document, Monitor } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const aiCapabilities = ref([
  { label: '销售预测', desc: 'AI预测未来销售趋势', icon: 'TrendCharts', color: '#409EFF', status: 'ready', path: '/ai/sales-prediction' },
  { label: '库存预测', desc: '智能库存需求预测', icon: 'Box', color: '#67C23A', status: 'ready', path: '/ai/inventory-prediction' },
  { label: '采购建议', desc: 'AI驱动的采购优化', icon: 'ShoppingCart', color: '#E6A23C', status: 'ready', path: '/ai/purchase-suggestion' },
  { label: '利润分析', desc: '智能利润归因分析', icon: 'Money', color: '#F56C6C', status: 'training', path: '/ai/profit-analysis' },
  { label: 'AI报表', desc: '智能报表生成', icon: 'DataAnalysis', color: '#9B59B6', status: 'ready', path: '/ai/report' },
  { label: '智能问答', desc: 'AI驱动的业务问答', icon: 'ChatDotSquare', color: '#1ABC9C', status: 'ready', path: '/ai/qa' },
  { label: 'OCR识别', desc: '智能文档/发票识别', icon: 'Document', color: '#3498DB', status: 'ready', path: '/ai/ocr' },
  { label: 'AI客服', desc: '智能客户服务助手', icon: 'Monitor', color: '#E74C3C', status: 'development', path: '/ai/customer-service' },
])

const aiStats = ref([
  { label: 'AI预测准确率', value: '91.5%', change: 2.8, trend: 'up' },
  { label: '今日AI调用', value: '1,286次', change: 12.5, trend: 'up' },
  { label: '节省人工工时', value: '856h', change: 18.3, trend: 'up' },
])

const activityLogs = ref([
  { id: 1, content: '销售预测模型完成每日训练，准确率 92.3%', time: '2024-11-20 10:30', type: 'success' },
  { id: 2, content: '库存预测引擎生成 56 条补货建议', time: '2024-11-20 09:15', type: 'primary' },
  { id: 3, content: 'AI OCR 识别发票 28 张，其中 26 张自动匹配', time: '2024-11-20 08:00', type: 'warning' },
  { id: 4, content: '智能问答处理 45 个用户问题，解决率 92%', time: '2024-11-19 17:30', type: 'success' },
])

const handleNavigate = (path: string) => {
  if (path) ElMessage.info(`跳转到: ${path}`)
}
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); color: white; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 22px; color: white; }
.subtitle { color: rgba(255,255,255,0.7); margin: 4px 0 0 0; }
.capability-card { text-align: center; border-radius: 12px; cursor: pointer; transition: all 0.3s; padding: 16px 0; }
.capability-card:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(0,0,0,0.12); }
.capability-icon { width: 56px; height: 56px; border-radius: 12px; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; color: white; }
.capability-label { font-size: 16px; font-weight: 600; color: #303133; }
.capability-desc { color: #909399; font-size: 13px; margin: 4px 0 8px; }
.capability-status { margin-top: 4px; }
.stat-card { text-align: center; border-radius: 12px; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 24px; font-weight: 700; color: #303133; margin: 4px 0; }
.stat-change { font-size: 12px; }
.stat-change.up { color: #67C23A; }
.stat-change.down { color: #F56C6C; }
</style>