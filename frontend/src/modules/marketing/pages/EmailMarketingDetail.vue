<!-- 
  文件路径: frontend/src/modules/marketing/pages/EmailMarketingDetail.vue
  功能: 邮件营销详情
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>邮件详情</h2>
          <p class="subtitle">主题: {{ email.subject }}</p>
        </div>
        <div>
          <el-button @click="handleBack"><el-icon><ArrowLeft /></el-icon> 返回</el-button>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card>
          <template #header><span>邮件内容</span></template>
          <div class="email-content" v-html="email.content"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header><span>统计数据</span></template>
          <div class="stat-item"><span>收件人数</span><span class="stat-value">{{ email.recipients }}</span></div>
          <div class="stat-item"><span>打开人数</span><span class="stat-value">{{ email.opened }}</span></div>
          <div class="stat-item"><span>打开率</span><span class="stat-value">{{ email.openRate }}%</span></div>
          <div class="stat-item"><span>点击数</span><span class="stat-value">{{ email.clicked }}</span></div>
          <div class="stat-item"><span>点击率</span><span class="stat-value">{{ email.clickRate }}%</span></div>
          <div class="stat-item"><span>发送时间</span><span class="stat-value">{{ email.sentAt }}</span></div>
        </el-card>
        <el-card style="margin-top: 20px">
          <template #header><span>性能趋势</span></template>
          <div ref="trendChartRef" class="chart-container" style="height: 150px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const router = useRouter()

const email = ref({
  subject: '双十一大促活动通知',
  recipients: 856,
  opened: 328,
  openRate: 38.3,
  clicked: 86,
  clickRate: 10.0,
  sentAt: '2024-11-20 10:30',
  content: '<h2>双十一大促活动</h2><p>亲爱的客户，双十一大促火热进行中！</p><p>全场折扣低至5折，满减优惠叠加使用！</p><p><a href="#">点击立即抢购</a></p>',
})

const trendChartRef = ref<HTMLElement>()

const handleBack = () => { router.push('/marketing/email') }

const initChart = async () => {
  await nextTick()
  if (trendChartRef.value) {
    const chart = echarts.init(trendChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '5%', right: '5%', top: '10%', bottom: '10%' },
      xAxis: { type: 'category', data: ['1h', '2h', '4h', '8h', '24h'] },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [{
        type: 'line',
        data: [85, 150, 220, 280, 328],
        smooth: true,
        lineStyle: { color: '#409EFF', width: 2 },
        areaStyle: { color: 'rgba(64,158,255,0.1)' },
      }],
    })
    window.addEventListener('resize', () => chart.resize())
  }
}

onMounted(() => { initChart() })
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
.email-content { padding: 16px; background: #fafafa; border-radius: 8px; min-height: 200px; }
.stat-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
.stat-item:last-child { border-bottom: none; }
.stat-value { font-weight: 700; color: #303133; }
.chart-container { width: 100%; }
</style>