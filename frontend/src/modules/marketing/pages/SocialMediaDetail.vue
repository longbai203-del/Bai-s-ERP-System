<!-- 
  文件路径: frontend/src/modules/marketing/pages/SocialMediaDetail.vue
  功能: 社交媒体内容详情
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>内容详情</h2>
          <p class="subtitle">{{ content.title }}</p>
        </div>
        <div>
          <el-button @click="handleBack"><el-icon><ArrowLeft /></el-icon> 返回</el-button>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card>
          <template #header><span>内容</span></template>
          <div class="content-body">{{ content.content }}</div>
          <div class="content-meta">
            <span>平台: <el-tag size="small">{{ content.platform }}</el-tag></span>
            <span>状态: <el-tag :type="content.status === 'published' ? 'success' : 'warning'" size="small">{{ content.status }}</el-tag></span>
            <span>发布时间: {{ content.publishedAt }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header><span>互动数据</span></template>
          <div class="stat-item"><span>总互动量</span><span class="stat-value">{{ content.engagement }}</span></div>
          <div class="stat-item"><span>点赞</span><span class="stat-value">{{ content.likes }}</span></div>
          <div class="stat-item"><span>评论</span><span class="stat-value">{{ content.comments }}</span></div>
          <div class="stat-item"><span>分享</span><span class="stat-value">{{ content.shares }}</span></div>
          <div class="stat-item"><span>互动率</span><span class="stat-value">{{ content.engagementRate }}%</span></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'

const router = useRouter()

const content = ref({
  id: 1,
  title: '双十一大促活动宣传',
  platform: 'Twitter',
  content: '🎉 双十一大促火热进行中！全场低至5折，满减优惠叠加使用！立即抢购！ #双十一 #大促',
  status: 'published',
  publishedAt: '2024-11-20 10:30',
  engagement: 2856,
  likes: 1856,
  comments: 456,
  shares: 456,
  engagementRate: 4.8,
})

const handleBack = () => { router.push('/marketing/social') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
.content-body { padding: 16px; background: #fafafa; border-radius: 8px; font-size: 15px; line-height: 1.8; }
.content-meta { margin-top: 12px; display: flex; gap: 20px; color: #909399; font-size: 13px; }
.stat-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
.stat-item:last-child { border-bottom: none; }
.stat-value { font-weight: 700; color: #303133; }
</style>