<!-- 
  文件路径: frontend/src/modules/dashboard/pages/PerformanceDashboard.vue
  功能: 绩效仪表板
  最后更新: 2026-07-25 12:44:21
-->

<template>
  <div class="dashboard-page">
    <div class="page-header">
      <div class="header-left">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>绩效仪表板</el-breadcrumb-item>
        </el-breadcrumb>
        <h1 class="page-title">绩效仪表板</h1>
      </div>
      <div class="header-right">
        <el-button @click="handleRefresh">
          <el-icon><Refresh /></el-icon> 刷新
        </el-button>
        <el-button type="primary" @click="handleExport">
          <el-icon><Download /></el-icon> 导出报表
        </el-button>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="8" animated />
    </div>

    <template v-else>
      <!-- 统计卡片 -->
      <el-row :gutter="20" class="stats-row">
        <el-col :span="6" v-for="stat in statCards" :key="stat.key">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-icon" :style="{ background: stat.color }">
              <el-icon><component :is="stat.icon" /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
              <div class="stat-trend" :class="stat.trend > 0 ? 'up' : 'down'">
                {{ stat.trend > 0 ? '↑' : '↓' }} {{ Math.abs(stat.trend) }}%
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 图表区域 -->
      <el-row :gutter="20">
        <el-col :span="16">
          <el-card shadow="hover" class="chart-card">
            <template #header>
              <div class="card-header">
                <span>数据趋势</span>
                <el-radio-group v-model="chartPeriod" size="small">
                  <el-radio-button label="week">本周</el-radio-button>
                  <el-radio-button label="month">本月</el-radio-button>
                  <el-radio-button label="quarter">本季度</el-radio-button>
                </el-radio-group>
              </div>
            </template>
            <div class="chart-container" ref="chartRef"></div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" class="chart-card">
            <template #header>
              <div class="card-header">
                <span>数据分布</span>
              </div>
            </template>
            <div class="chart-container" ref="pieChartRef"></div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 最近数据表格 -->
      <el-card shadow="hover" class="table-card">
        <template #header>
          <div class="card-header">
            <span>最近记录</span>
            <el-button type="text" @click="viewAll">查看全部</el-button>
          </div>
        </template>
        <el-table :data="recentItems" border stripe style="width: 100%">
          <el-table-column prop="name" label="名称" min-width="150" />
          <el-table-column prop="value" label="数值" width="120" align="right" />
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === 'active' ? 'success' : 'danger'" size="small">
                {{ row.status === 'active' ? '正常' : '异常' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="时间" width="180" align="center">
            <template #default="{ row }">
              {{ formatDate(row.createdAt) }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Refresh, Download } from '@element-plus/icons-vue';
import { formatDate } from '@/utils/format';
import * as echarts from 'echarts';
import { dashboardApi } from '@/api/dashboard';

const router = useRouter();
const chartRef = ref<HTMLDivElement>();
const pieChartRef = ref<HTMLDivElement>();
let chartInstance: any = null;
let pieChartInstance: any = null;

// ==================== 状态 ====================
const loading = ref(false);
const chartPeriod = ref('month');
const recentItems = ref<any[]>([]);

// ==================== 统计卡片 ====================
const statCards = reactive([
  { key: 'total', label: '总数', value: 0, icon: 'DataBoard', color: '#409EFF', trend: 12 },
  { key: 'active', label: '活跃数', value: 0, icon: 'UserFilled', color: '#67C23A', trend: 8 },
  { key: 'revenue', label: '总收入', value: '¥0.00', icon: 'Money', color: '#E6A23C', trend: -3 },
  { key: 'growth', label: '增长率', value: '0%', icon: 'TrendCharts', color: '#909399', trend: 5 },
]);

// ==================== 方法 ====================

const loadData = async () => {
  loading.value = true;
  try {
    const data = await dashboardApi.getDashboardData();
    // 更新统计卡片
    Object.assign(statCards, data.stats);
    recentItems.value = data.recent || [];
  } catch (error: any) {
    ElMessage.error(error.message || '加载数据失败');
  } finally {
    loading.value = false;
  }
};

const initChart = async () => {
  await nextTick();
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value);
    chartInstance.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['收入', '支出', '利润'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'] },
      yAxis: { type: 'value' },
      series: [
        { name: '收入', type: 'line', data: [120, 132, 101, 134, 90, 230, 210], smooth: true },
        { name: '支出', type: 'line', data: [80, 100, 90, 110, 70, 150, 140], smooth: true },
        { name: '利润', type: 'bar', data: [40, 32, 11, 24, 20, 80, 70] },
      ],
    });
    window.addEventListener('resize', () => chartInstance?.resize());
  }

  if (pieChartRef.value) {
    pieChartInstance = echarts.init(pieChartRef.value);
    pieChartInstance.setOption({
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', left: 'left' },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: [
            { value: 1048, name: '类别A' },
            { value: 735, name: '类别B' },
            { value: 580, name: '类别C' },
            { value: 484, name: '类别D' },
          ],
          emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.5)' } },
        },
      ],
    });
    window.addEventListener('resize', () => pieChartInstance?.resize());
  }
};

const handleRefresh = () => {
  loadData();
  ElMessage.success('已刷新');
};

const handleExport = () => {
  ElMessage.info('导出功能开发中');
};

const viewAll = () => {
  router.push('/reports');
};

// ==================== 生命周期 ====================
onMounted(() => {
  loadData();
  initChart();
});
</script>

<style scoped lang="scss">
.dashboard-page {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
    background: #fff;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

    .header-left {
      .page-title {
        font-size: 24px;
        font-weight: 600;
        margin: 8px 0 0;
        color: #303133;
      }
    }

    .header-right {
      display: flex;
      gap: 12px;
    }
  }

  .loading-container {
    padding: 40px 0;
  }

  .stats-row {
    margin-bottom: 20px;

    .stat-card {
      display: flex;
      align-items: center;
      padding: 16px 20px;
      border-radius: 12px;

      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 24px;
        margin-right: 16px;
      }

      .stat-content {
        flex: 1;

        .stat-number {
          font-size: 24px;
          font-weight: 700;
          color: #303133;
        }

        .stat-label {
          font-size: 14px;
          color: #909399;
        }

        .stat-trend {
          font-size: 12px;
          margin-top: 4px;

          &.up {
            color: #67C23A;
          }
          &.down {
            color: #F56C6C;
          }
        }
      }
    }
  }

  .chart-card,
  .table-card {
    margin-bottom: 20px;
    border-radius: 12px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    font-size: 16px;
  }

  .chart-container {
    height: 300px;
    width: 100%;
  }

  .pagination-container {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
}

@media (max-width: 768px) {
  .dashboard-page {
    padding: 12px;

    .page-header {
      flex-direction: column;
      gap: 12px;

      .header-right {
        width: 100%;
      }
    }

    .stats-row .el-col {
      margin-bottom: 12px;
    }

    .chart-container {
      height: 200px;
    }
  }
}
</style>
