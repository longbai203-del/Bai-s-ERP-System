<template>
  <div class="finance-dashboard">
    <h1>💰 财务仪表盘</h1>
    <p>财务数据概览</p>
    
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
  name: 'FinanceDashboard',
  data() {
    return {
      stats: [
        { value: '¥1,234,567', label: '总收入' },
        { value: '¥876,543', label: '总支出' },
        { value: '¥358,024', label: '净利润' },
        { value: '95.6%', label: '毛利率' }
      ]
    }
  }
}
</script>

<style scoped>
.finance-dashboard {
  padding: 20px;
}
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
.stat-label {
  color: #7f8c8d;
  margin-top: 8px;
}
</style>
