<template>
  <div class="report-dashboard">
    <h1>📊 报表仪表盘</h1>
    <p>系统报表与数据分析</p>
    
    <div class="stats-grid">
      <div class="stat-card" v-for="stat in stats" :key="stat.label">
        <div class="stat-value">{{ stat.value }}</div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReportDashboard',
  data() {
    return {
      stats: [
        { value: '25', label: '报表模板' },
        { value: '1,234', label: '本月生成' },
        { value: '98%', label: '满意度' }
      ]
    }
  }
}
</script>

<style scoped>
.report-dashboard { padding: 20px; }
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}
.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  text-align: center;
}
.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #667eea;
}
.stat-label { color: #7f8c8d; margin-top: 8px; }
</style>
