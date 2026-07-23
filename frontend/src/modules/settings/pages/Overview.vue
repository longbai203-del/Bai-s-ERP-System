<template>
  <div class="settings-overview">
    <h1>📊 设置概览</h1>
    <p>系统设置总览</p>
    
    <div class="stats-grid">
      <div class="stat-card" v-for="stat in stats" :key="stat.label">
        <div class="stat-value">{{ stat.value }}</div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>

    <div class="settings-groups">
      <div class="group-card" v-for="group in groups" :key="group.name">
        <div class="group-icon">{{ group.icon }}</div>
        <h3>{{ group.name }}</h3>
        <p>{{ group.desc }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsOverview',
  data() {
    return {
      stats: [
        { value: '25', label: '配置项' },
        { value: '12', label: '已启用' },
        { value: '100%', label: '覆盖率' }
      ],
      groups: [
        { name: '系统设置', icon: '⚙️', desc: '系统基础配置' },
        { name: '用户设置', icon: '👤', desc: '用户与权限' },
        { name: '安全设置', icon: '🔒', desc: '安全与认证' },
        { name: '通知设置', icon: '🔔', desc: '消息通知' }
      ]
    }
  }
}
</script>

<style scoped>
.settings-overview { padding: 20px; }
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
  font-size: 28px;
  font-weight: bold;
  color: #667eea;
}
.stat-label { color: #7f8c8d; margin-top: 8px; }
.settings-groups {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 20px;
}
.group-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
}
.group-icon { font-size: 32px; margin-bottom: 8px; }
.group-card h3 { color: #2c3e50; margin-bottom: 4px; }
.group-card p { color: #7f8c8d; font-size: 13px; }
</style>
