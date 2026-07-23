<template>
  <div class="auth-index">
    <div class="page-header">
      <h1>🔐 认证管理</h1>
      <p class="subtitle">用户身份认证与权限管理</p>
    </div>
    
    <div class="auth-cards">
      <div class="auth-card" v-for="item in authItems" :key="item.name">
        <div class="auth-icon">{{ item.icon }}</div>
        <h3>{{ item.name }}</h3>
        <p>{{ item.desc }}</p>
        <el-button type="primary" size="small" @click="navigateTo(item.route)">
          进入
        </el-button>
      </div>
    </div>

    <div class="quick-actions">
      <h3>快速操作</h3>
      <div class="action-buttons">
        <el-button type="success" @click="handleLogin">登录</el-button>
        <el-button @click="handleRegister">注册</el-button>
        <el-button type="warning" @click="handleForgotPassword">忘记密码</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthIndex',
  data() {
    return {
      authItems: [
        { name: '用户登录', icon: '🔑', desc: '系统登录入口', route: '/auth/login' },
        { name: '注册账号', icon: '📝', desc: '新用户注册', route: '/auth/register' },
        { name: '权限管理', icon: '🛡️', desc: '角色与权限配置', route: '/auth/permissions' }
      ]
    }
  },
  methods: {
    navigateTo(route) {
      this..push(route)
    },
    handleLogin() {
      this..push('/auth/login')
    },
    handleRegister() {
      this..push('/auth/register')
    },
    handleForgotPassword() {
      this..push('/auth/forgot-password')
    }
  }
}
</script>

<style scoped>
.auth-index {
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
.auth-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}
.auth-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  text-align: center;
}
.auth-icon {
  font-size: 40px;
  margin-bottom: 12px;
}
.auth-card h3 {
  color: #2c3e50;
  margin-bottom: 8px;
}
.auth-card p {
  color: #7f8c8d;
  font-size: 13px;
  margin-bottom: 12px;
}
.quick-actions {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
}
.quick-actions h3 {
  color: #2c3e50;
  margin-bottom: 16px;
}
.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
