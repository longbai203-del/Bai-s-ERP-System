<template>
  <div class="system-overview">
    <h1>📊 系统概览</h1>
    <p>系统整体运行状态</p>
    
    <div class="stats-grid">
      <div class="stat-card" v-for="stat in stats" :key="stat.label">
        <div class="stat-value">{{ stat.value }}</div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>

    <div class="info-cards">
      <div class="info-card" v-for="info in systemInfo" :key="info.name">
        <h3>{{ info.name }}</h3>
        <p>{{ info.value }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SystemOverview',
  data() {
    return {
      stats: [
        { value: '21', label: '总模块数' },
        { value: '439', label: '总页面数' },
        { value: '17', label: '测试文件' },
        { value: '99.9%', label: '系统可用性' }
      ],
      systemInfo: [
        { name: '系统版本', value: 'v3.0.0' },
        { name: '运行环境', value: 'Development' },
        { name: '数据库', value: 'PostgreSQL 16' },
        { name: '前端框架', value: 'Vue 3 + Vite' }
      ]
    }
  }
}
</script>

<style scoped>
.system-overview { padding: 20px; }
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 20px 0;
}
.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  text-align: center;
}
.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #667eea;
}
.stat-label {
  color: #7f8c8d;
  margin-top: 8px;
}
.info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 20px;
}
.info-card {
  background: #f8f9fa;
  padding: 16px 20px;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}
.info-card h3 {
  color: #2c3e50;
  font-size: 14px;
  margin-bottom: 4px;
}
.info-card p {
  color: #667eea;
  font-size: 16px;
  font-weight: 500;
}
</style>
