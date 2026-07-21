<!-- 
  文件路径: frontend/src/modules/marketing/pages/CampaignDetail.vue
  功能: 营销活动详情
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>{{ campaign.name }}</h2>
          <p class="subtitle">活动详情</p>
        </div>
        <div>
          <el-button type="primary" @click="handleEdit">编辑</el-button>
          <el-button @click="handleBack"><el-icon><ArrowLeft /></el-icon> 返回</el-button>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card>
          <template #header><span>活动信息</span></template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="活动名称">{{ campaign.name }}</el-descriptions-item>
            <el-descriptions-item label="活动类型">
              <el-tag :type="campaign.type === 'promotion' ? 'danger' : 'primary'">
                {{ campaign.type === 'promotion' ? '促销活动' : campaign.type === 'brand' ? '品牌活动' : '内容营销' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="campaign.status === 'active' ? 'success' : 'info'">
                {{ campaign.status === 'active' ? '进行中' : '策划中' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="目标受众">{{ campaign.targetAudience }}</el-descriptions-item>
            <el-descriptions-item label="预算">{{ formatCurrency(campaign.budget) }}</el-descriptions-item>
            <el-descriptions-item label="已花费">{{ formatCurrency(campaign.spent) }}</el-descriptions-item>
            <el-descriptions-item label="开始日期">{{ campaign.startDate }}</el-descriptions-item>
            <el-descriptions-item label="结束日期">{{ campaign.endDate }}</el-descriptions-item>
            <el-descriptions-item label="活动目标" :span="2">{{ campaign.goal }}</el-descriptions-item>
            <el-descriptions-item label="描述" :span="2">{{ campaign.description }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header><span>活动效果</span></template>
          <div class="effect-item">
            <span>总曝光</span>
            <span class="effect-value">{{ campaign.exposure }}</span>
          </div>
          <div class="effect-item">
            <span>总点击</span>
            <span class="effect-value">{{ campaign.clicks }}</span>
          </div>
          <div class="effect-item">
            <span>点击率</span>
            <span class="effect-value">{{ campaign.ctr }}%</span>
          </div>
          <div class="effect-item">
            <span>转化率</span>
            <span class="effect-value">{{ campaign.conversionRate }}%</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

const campaign = ref({
  id: 1,
  name: '双十一大促',
  type: 'promotion',
  status: 'active',
  targetAudience: '全部客户',
  budget: 2000000,
  spent: 1500000,
  startDate: '2024-11-01',
  endDate: '2024-11-11',
  goal: '提升销售额30%，新增客户500人',
  description: '双十一年度促销活动，全场折扣+满减优惠',
  exposure: '2,856,000',
  clicks: '256,000',
  ctr: 8.96,
  conversionRate: 5.2,
})

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleEdit = () => { router.push(`/marketing/campaigns/edit/${campaign.value.id}`) }
const handleBack = () => { router.push('/marketing/campaigns') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
.effect-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
.effect-item:last-child { border-bottom: none; }
.effect-value { font-weight: 700; color: #303133; }
</style>