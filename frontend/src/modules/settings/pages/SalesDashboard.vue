<template>
  <div class="sales-dashboard">
    <h1>📈 销售仪表盘</h1>
    <p>销售数据概览与分析</p>
    
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
  name: 'SalesDashboard',
  data() {
    return {
      stats: [
        { value: '¥2,345,678', label: '总销售额' },
        { value: '12,345', label: '订单数' },
        { value: '89%', label: '增长率' },
        { value: '98.5%', label: '完成率' }
      ]
    }
  }
}
</script>

<style scoped>
.sales-dashboard { padding: 20px; }
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
.stat-value { font-size: 28px; font-weight: bold; color: #667eea; }
.stat-label { color: #7f8c8d; margin-top: 8px; }
</style>
