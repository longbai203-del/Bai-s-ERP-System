<template>
  <div class="dashboard">
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
      <el-col :span="24">
        <el-card shadow="hover">
          <template #header><span>欢迎使用 Bai's ERP System</span></template>
          <div style="padding: 20px; text-align: center;">
            <h2 style="color: #409EFF;">🎉 系统运行正常</h2>
            <p style="color: #666; margin-top: 10px;">点击左侧菜单开始使用</p>
            <el-button type="primary" style="margin-top: 10px;" @click="logout">退出登录</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

const stats = ref([
  { title: '总订单', value: '1,234', icon: 'Document', color: '#409EFF' },
  { title: '总用户', value: '56', icon: 'User', color: '#67C23A' },
  { title: '总收入', value: '¥98,765', icon: 'Money', color: '#E6A23C' },
  { title: '库存商品', value: '4,321', icon: 'Box', color: '#F56C6C' },
])

const logout = () => {
  localStorage.removeItem('token')
  ElMessage.success('已退出登录')
  router.push('/login')
}
</script>

<style scoped>
.dashboard { padding: 20px; }
.stat-card { cursor: pointer; transition: transform 0.2s; }
.stat-card:hover { transform: translateY(-5px); }
.stat-content { display: flex; align-items: center; gap: 15px; }
.stat-icon { width: 50px; height: 50px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; }
.stat-number { font-size: 24px; font-weight: bold; color: #333; }
.stat-title { font-size: 14px; color: #999; margin-top: 4px; }
</style>
