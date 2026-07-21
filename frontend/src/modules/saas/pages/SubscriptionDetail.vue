<!-- 
  文件路径: frontend/src/modules/saas/pages/SubscriptionDetail.vue
  功能: 订阅详情
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>订阅详情</h2>
          <p class="subtitle">租户: {{ subscription.tenant }}</p>
        </div>
        <div>
          <el-button type="warning" @click="handleRenew" v-if="subscription.status === 'expiring'"><el-icon><Refresh /></el-icon> 续订</el-button>
          <el-button @click="handleBack"><el-icon><ArrowLeft /></el-icon> 返回</el-button>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card>
          <template #header><span>订阅信息</span></template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="租户">{{ subscription.tenant }}</el-descriptions-item>
            <el-descriptions-item label="套餐">
              <el-tag :type="subscription.plan === 'enterprise' ? 'danger' : 'primary'">
                {{ subscription.plan === 'enterprise' ? '企业版' : subscription.plan === 'professional' ? '专业版' : '标准版' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="计费周期">{{ subscription.billingCycle }}</el-descriptions-item>
            <el-descriptions-item label="金额">{{ formatCurrency(subscription.amount) }}</el-descriptions-item>
            <el-descriptions-item label="开始日期">{{ subscription.startDate }}</el-descriptions-item>
            <el-descriptions-item label="到期日期">
              <span :style="{ color: subscription.status === 'expiring' ? '#E6A23C' : subscription.status === 'expired' ? '#F56C6C' : '#303133' }">
                {{ subscription.endDate }}
              </span>
            </el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="subscription.status === 'active' ? 'success' : subscription.status === 'expiring' ? 'warning' : subscription.status === 'expired' ? 'danger' : 'info'">
                {{ subscription.status === 'active' ? '有效' : subscription.status === 'expiring' ? '即将到期' : subscription.status === 'expired' ? '已过期' : '已取消' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="备注" :span="2">{{ subscription.remark }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header><span>订阅历史</span></template>
          <el-timeline>
            <el-timeline-item v-for="log in history" :key="log.id" :timestamp="log.time" :type="log.type">
              {{ log.content }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

const subscription = ref({
  id: 2,
  tenant: '阿尔拉吉银行',
  plan: 'professional',
  billingCycle: '月付',
  amount: 8500,
  startDate: '2024-11-01',
  endDate: '2024-11-30',
  status: 'expiring',
  remark: '标准月付订阅',
})

const history = ref([
  { id: 1, content: '订阅创建', time: '2024-11-01 10:00', type: 'primary' },
  { id: 2, content: '首月付款成功', time: '2024-11-01 10:05', type: 'success' },
  { id: 3, content: '即将到期提醒', time: '2024-11-20 09:00', type: 'warning' },
])

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleBack = () => { router.push('/saas/subscriptions') }
const handleRenew = () => {
  ElMessageBox.confirm(`确认续订 ${subscription.value.tenant} 的订阅？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' })
    .then(() => { subscription.value.status = 'active'; subscription.value.endDate = '2024-12-31'; ElMessage.success('续订成功') }).catch(() => {})
}
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
</style>