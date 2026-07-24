<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6" v-for="stat in stats" :key="stat.title">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" :style="{ background: stat.color }">
              <el-icon :size="24"><component :is="stat.icon" /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stat.value }}</div>
              <div class="stat-title">{{ stat.title }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header><span>趋势分析</span></template>
          <div id="trend-chart" style="height: 300px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header><span>数据统计</span></template>
          <div id="stat-chart" style="height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';

const stats = ref([
  { title: '总数据', value: '1,234', icon: 'Document', color: '#409EFF' },
  { title: '活跃用户', value: '56', icon: 'User', color: '#67C23A' },
  { title: '总收入', value: '¥98,765', icon: 'Money', color: '#E6A23C' },
  { title: '增长率', value: '+12.5%', icon: 'TrendCharts', color: '#F56C6C' }
]);

let trendChart: echarts.ECharts | null = null;
let statChart: echarts.ECharts | null = null;

onMounted(() => {
  // 趋势图
  const trendEl = document.getElementById('trend-chart');
  if (trendEl) {
    trendChart = echarts.init(trendEl);
    trendChart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
      yAxis: { type: 'value' },
      series: [{
        data: [120, 200, 150, 180, 220, 290],
        type: 'line',
        smooth: true,
        areaStyle: { opacity: 0.3 }
      }]
    });
  }

  // 统计图
  const statEl = document.getElementById('stat-chart');
  if (statEl) {
    statChart = echarts.init(statEl);
    statChart.setOption({
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', left: 'left' },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 1048, name: '分类A' },
          { value: 735, name: '分类B' },
          { value: 580, name: '分类C' },
          { value: 484, name: '分类D' }
        ]
      }]
    });
  }
});

onUnmounted(() => {
  trendChart?.dispose();
  statChart?.dispose();
});
</script>

<style scoped>
.dashboard-container { padding: 20px; }
.stat-card { cursor: pointer; transition: transform 0.2s; }
.stat-card:hover { transform: translateY(-5px); }
.stat-content { display: flex; align-items: center; gap: 15px; }
.stat-icon { width: 50px; height: 50px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; }
.stat-number { font-size: 24px; font-weight: bold; color: #333; }
.stat-title { font-size: 14px; color: #999; margin-top: 4px; }
</style>
