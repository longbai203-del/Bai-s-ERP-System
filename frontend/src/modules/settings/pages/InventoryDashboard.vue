<template>
  <div class="inventory-dashboard">
    <h1>📦 库存仪表盘</h1>
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
  name: 'InventoryDashboard',
  data() {
    return {
      stats: [
        { value: '12,847', label: '总库存商品' },
        { value: '3,456', label: '低库存商品' },
        { value: '89', label: '缺货商品' }
      ]
    }
  }
}
</script>

<style scoped>
.inventory-dashboard { padding: 20px; }
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
