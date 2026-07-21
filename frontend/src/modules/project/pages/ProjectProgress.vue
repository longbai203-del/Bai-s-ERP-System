<!-- 
  文件路径: frontend/src/modules/project/pages/ProjectProgress.vue
  功能: 项目进度 - 项目进度追踪
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="项目">
              <el-select v-model="searchForm.project" placeholder="请选择项目" style="width: 100%" filterable>
                <el-option label="STC 5G网络升级" value="STC 5G网络升级" />
                <el-option label="阿尔拉吉银行核心系统" value="阿尔拉吉银行核心系统" />
                <el-option label="沙特阿美数据中心建设" value="沙特阿美数据中心建设" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card>
          <template #header><span>项目进度总览</span></template>
          <div ref="progressChartRef" class="chart-container" style="height: 300px;"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header><span>进度指标</span></template>
          <div class="progress-indicators">
            <div v-for="indicator in indicators" :key="indicator.label" class="indicator-item">
              <div class="indicator-label">{{ indicator.label }}</div>
              <div class="indicator-value">{{ indicator.value }}</div>
              <el-progress :percentage="indicator.percentage" :color="indicator.color" />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <template #header><span>阶段进度</span></template>
          <el-table :data="phaseData" style="width: 100%" stripe>
            <el-table-column prop="phase" label="阶段名称" />
            <el-table-column prop="planned" label="计划完成" align="center" />
            <el-table-column prop="actual" label="实际完成" align="center" />
            <el-table-column label="进度" align="center" width="200">
              <template #default="{ row }">
                <el-progress :percentage="row.progress" :color="row.progress >= row.target ? '#67C23A' : '#E6A23C'" />
              </template>
            </el-table-column>
            <el-table-column prop="target" label="目标(%)" align="center" />
            <el-table-column prop="status" label="状态" align="center" width="100">
              <template #default="{ row }">
                <el-tag :type="row.progress >= row.target ? 'success' : 'warning'">
                  {{ row.progress >= row.target ? '正常' : '滞后' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { Search, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const searchForm = reactive({ project: '' })

const indicators = ref([
  { label: '整体进度', value: '76%', percentage: 76, color: '#409EFF' },
  { label: '任务完成率', value: '68%', percentage: 68, color: '#67C23A' },
  { label: '里程碑达成率', value: '80%', percentage: 80, color: '#E6A23C' },
  { label: '时间偏差', value: '+5天', percentage: 70, color: '#F56C6C' },
])

const phaseData = ref([
  { phase: '需求分析', planned: '2024-08-15', actual: '2024-08-12', progress: 100, target: 100 },
  { phase: '系统设计', planned: '2024-09-15', actual: '2024-09-10', progress: 100, target: 100 },
  { phase: '开发实施', planned: '2024-11-15', actual: '2024-11-20', progress: 75, target: 80 },
  { phase: '测试部署', planned: '2024-12-10', actual: '', progress: 20, target: 30 },
])

const progressChartRef = ref<HTMLElement>()

const handleSearch = () => { ElMessage.success('查询完成') }
const handleReset = () => { searchForm.project = '' }
const handleExport = () => { ElMessage.success('导出完成') }

const initChart = async () => {
  await nextTick()
  if (progressChartRef.value) {
    const chart = echarts.init(progressChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['计划进度', '实际进度'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['需求分析', '系统设计', '开发实施', '测试部署'] },
      yAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [
        {
          name: '计划进度',
          type: 'bar',
          data: [100, 100, 80, 30],
          itemStyle: { color: '#909399', borderRadius: [4, 4, 0, 0] },
        },
        {
          name: '实际进度',
          type: 'bar',
          data: [100, 100, 75, 20],
          itemStyle: { color: '#409EFF', borderRadius: [4, 4, 0, 0] },
        },
      ],
    })
    window.addEventListener('resize', () => chart.resize())
  }
}

onMounted(() => { initChart() })
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.chart-container { width: 100%; }
.progress-indicators { padding: 8px 0; }
.indicator-item { margin-bottom: 20px; }
.indicator-label { color: #909399; font-size: 14px; }
.indicator-value { font-size: 20px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>