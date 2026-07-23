<template>
  <div class="ai-index">
    <div class="page-header">
      <h1>🤖 AI 智能模块</h1>
      <p class="subtitle">人工智能驱动的业务智能化解决方案</p>
    </div>
    
    <div class="ai-features">
      <div class="feature-card" v-for="feature in features" :key="feature.name">
        <div class="feature-icon">{{ feature.icon }}</div>
        <h3>{{ feature.name }}</h3>
        <p>{{ feature.desc }}</p>
        <el-button type="primary" size="small" @click="navigateTo(feature.route)">
          进入
        </el-button>
      </div>
    </div>

    <div class="stats-row">
      <div class="stat-item" v-for="stat in stats" :key="stat.label">
        <div class="stat-number">{{ stat.value }}</div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AIIndex',
  data() {
    return {
      features: [
        { name: 'AI 对话', icon: '💬', desc: '智能对话助手', route: '/ai/chat' },
        { name: 'AI 报表', icon: '📊', desc: '智能数据分析', route: '/ai/report' },
        { name: 'AI 预测', icon: '🔮', desc: '销售与库存预测', route: '/ai/prediction' },
        { name: 'AI 文档处理', icon: '📄', desc: 'OCR与文档识别', route: '/ai/ocr' }
      ],
      stats: [
        { label: 'AI 服务调用', value: '12,847' },
        { label: '预测准确率', value: '94.7%' },
        { label: '文档处理量', value: '3,256' },
        { label: '活跃模型', value: '6' }
      ]
    }
  },
  methods: {
    navigateTo(route) {
      this..push(route)
    }
  }
}
</script>

<style scoped>
.ai-index {
  padding: 20px;
}
.page-header {
  margin-bottom: 30px;
}
.page-header h1 {
  color: #2c3e50;
  font-size: 28px;
}
.subtitle {
  color: #7f8c8d;
  font-size: 14px;
  margin-top: 5px;
}
.ai-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}
.feature-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  text-align: center;
  transition: transform 0.3s;
}
.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
}
.feature-icon {
  font-size: 40px;
  margin-bottom: 12px;
}
.feature-card h3 {
  color: #2c3e50;
  margin-bottom: 8px;
}
.feature-card p {
  color: #7f8c8d;
  font-size: 13px;
  margin-bottom: 12px;
}
.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  background: #f8f9fa;
  padding: 24px;
  border-radius: 12px;
}
.stat-item {
  text-align: center;
}
.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: #667eea;
}
.stat-label {
  color: #7f8c8d;
  font-size: 13px;
  margin-top: 4px;
}
</style>
