<!-- 
  文件路径: frontend/src/modules/customers/pages/CustomerProfile.vue
  功能: 客户画像 - 客户360度全景视图
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="profile-header">
        <div class="profile-avatar">
          <el-avatar :size="80" icon="UserFilled" />
        </div>
        <div class="profile-info">
          <h2>{{ customerName }}</h2>
          <div class="profile-tags">
            <el-tag type="primary">VIP客户</el-tag>
            <el-tag type="success">活跃</el-tag>
            <el-tag>A级信用</el-tag>
          </div>
          <div class="profile-meta">
            <span><el-icon><Phone /></el-icon> {{ phone }}</span>
            <span><el-icon><Message /></el-icon> {{ email }}</span>
            <span><el-icon><Location /></el-icon> {{ address }}</span>
          </div>
        </div>
        <div class="profile-actions">
          <el-button type="primary" @click="handleEdit"><el-icon><Edit /></el-icon> 编辑</el-button>
          <el-button @click="handleFollow"><el-icon><Bell /></el-icon> 跟进</el-button>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="6" v-for="stat in customerStats" :key="stat.label">
        <el-card class="stat-card">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-change" :class="stat.trend">{{ stat.trend === 'up' ? '↑' : '↓' }} {{ stat.change }}%</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card>
          <template #header><span>客户信息</span></template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="客户名称">{{ customerName }}</el-descriptions-item>
            <el-descriptions-item label="客户等级"><el-tag type="primary">VIP</el-tag></el-descriptions-item>
            <el-descriptions-item label="行业">通信/IT</el-descriptions-item>
            <el-descriptions-item label="规模">500-1000人</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ phone }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ email }}</el-descriptions-item>
            <el-descriptions-item label="地址" :span="2">{{ address }}</el-descriptions-item>
            <el-descriptions-item label="纳税人编号">SA-1234567890</el-descriptions-item>
            <el-descriptions-item label="注册日期">2022-01-15</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header><span>客户评级</span></template>
          <div class="rating-section">
            <div class="rating-item">
              <span>综合评分</span>
              <el-rate v-model="rating.overall" disabled show-score :texts="['极差', '差', '一般', '好', '极好']" />
            </div>
            <div class="rating-item">
              <span>信用评分</span>
              <el-progress :percentage="85" color="#67C23A" />
            </div>
            <div class="rating-item">
              <span>活跃度</span>
              <el-progress :percentage="92" color="#409EFF" />
            </div>
            <div class="rating-item">
              <span>忠诚度</span>
              <el-progress :percentage="78" color="#E6A23C" />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  User,
  Edit,
  Download,
  Delete,
  ArrowLeft,
  InfoFilled,
  Phone,
  Message,
  WarningFilled
} from '@element-plus/icons-vue'
// ============================================================
// API 导入
// ============================================================
import { getCustomerDetail, deleteCustomer } from '@/api/modules/customers'
import { ElMessage } from 'element-plus'

const customerName = ref('沙特电信公司')
const phone = ref('+966 50 123 4567')
const email = ref('contact@stc.com.sa')
const address = ref('利雅得，沙特阿拉伯')

const customerStats = ref([
  { label: '累计消费', value: 'SAR 8,560,000', change: 12.5, trend: 'up' },
  { label: '订单总数', value: '286', change: 8.3, trend: 'up' },
  { label: '客单价', value: 'SAR 29,930', change: 3.2, trend: 'up' },
  { label: '满意度', value: '4.8/5', change: 0.5, trend: 'up' },
])

const rating = ref({
  overall: 4.8,
  credit: 85,
  activity: 92,
  loyalty: 78,
})

const handleEdit = () => { ElMessage.info('编辑客户信息') }
const handleFollow = () => { ElMessage.info('创建跟进任务') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.profile-header { display: flex; align-items: center; gap: 24px; }
.profile-info h2 { margin: 0; font-size: 22px; }
.profile-tags { margin: 8px 0; display: flex; gap: 8px; }
.profile-meta { display: flex; gap: 20px; color: #909399; font-size: 14px; }
.profile-meta span { display: flex; align-items: center; gap: 4px; }
.profile-actions { margin-left: auto; display: flex; gap: 8px; }
.stat-card { text-align: center; border-radius: 12px; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
.stat-change { font-size: 12px; }
.stat-change.up { color: #67C23A; }
.stat-change.down { color: #F56C6C; }
.rating-section { padding: 8px 0; }
.rating-item { margin-bottom: 16px; }
.rating-item span { display: block; margin-bottom: 4px; color: #606266; font-size: 14px; }
</style>
