<template>
  <div class="marketing-detail-page">
    <div class="page-header">
      <div class="header-left">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/marketing' }">营销管理</el-breadcrumb-item>
          <el-breadcrumb-item>营销活动详情 #{{ campaignData?.name || '加载中...' }}</el-breadcrumb-item>
        </el-breadcrumb>
        <h1 class="page-title">{{ campaignData?.name || '营销活动详情' }}</h1>
      </div>
      <div class="header-right">
        <el-button :icon="Edit" @click="handleEdit">编辑</el-button>
        <el-button :icon="Refresh" @click="loadCampaignData">刷新</el-button>
        <el-button type="danger" :icon="Delete" @click="handleDelete" v-if="canDelete">删除</el-button>
      </div>
    </div>

    <div v-if="loading" class="loading-container"><el-skeleton :rows="8" animated /></div>

    <template v-else-if="campaignData">
      <!-- 状态横幅 -->
      <div class="status-banner" :class="statusClass">
        <div class="status-info">
          <el-tag :type="statusType" size="large">{{ statusText }}</el-tag>
          <span class="campaign-id">ID: {{ campaignData.id }}</span>
          <span class="campaign-date">{{ formatDate(campaignData.createdAt) }}</span>
        </div>
      </div>

      <el-row :gutter="20">
        <el-col :span="16">
          <!-- 活动信息 -->
          <el-card class="info-card" shadow="hover">
            <template #header><div class="card-header"><span>活动信息</span></div></template>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="活动名称">{{ campaignData.name }}</el-descriptions-item>
              <el-descriptions-item label="类型">
                <el-tag size="small">{{ campaignData.type || '一般' }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="开始时间">{{ formatDate(campaignData.startDate) }}</el-descriptions-item>
              <el-descriptions-item label="结束时间">{{ formatDate(campaignData.endDate) }}</el-descriptions-item>
              <el-descriptions-item label="预算">¥{{ (campaignData.budget || 0).toFixed(2) }}</el-descriptions-item>
              <el-descriptions-item label="已花费">¥{{ (campaignData.spent || 0).toFixed(2) }}</el-descriptions-item>
              <el-descriptions-item label="描述" :span="2">{{ campaignData.description || '无' }}</el-descriptions-item>
            </el-descriptions>
          </el-card>

          <!-- 活动统计 -->
          <el-card class="stats-card" shadow="hover">
            <template #header><div class="card-header"><span>活动统计</span></div></template>
            <el-row :gutter="20">
              <el-col :span="6"><div class="stat-item"><div class="stat-number">{{ campaignData.impressions || 0 }}</div><div class="stat-label">曝光量</div></div></el-col>
              <el-col :span="6"><div class="stat-item"><div class="stat-number">{{ campaignData.clicks || 0 }}</div><div class="stat-label">点击量</div></div></el-col>
              <el-col :span="6"><div class="stat-item"><div class="stat-number">{{ campaignData.conversions || 0 }}</div><div class="stat-label">转化数</div></div></el-col>
              <el-col :span="6"><div class="stat-item"><div class="stat-number">{{ campaignData.conversionRate || 0 }}%</div><div class="stat-label">转化率</div></div></el-col>
            </el-row>
          </el-card>

          <!-- 渠道表现 -->
          <el-card class="channel-card" shadow="hover">
            <template #header><div class="card-header"><span>渠道表现</span></div></template>
            <el-table :data="campaignData.channels || []" border stripe>
              <el-table-column prop="name" label="渠道名称" />
              <el-table-column prop="impressions" label="曝光" align="center" />
              <el-table-column prop="clicks" label="点击" align="center" />
              <el-table-column prop="conversions" label="转化" align="center" />
              <el-table-column prop="cost" label="成本" align="right">
                <template #default="{ row }">¥{{ (row.cost || 0).toFixed(2) }}</template>
              </el-table-column>
              <el-table-column prop="roi" label="ROI" align="right">
                <template #default="{ row }">{{ row.roi || 0 }}%</template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>

        <el-col :span="8">
          <!-- 活动进度 -->
          <el-card class="progress-card" shadow="hover">
            <template #header><div class="card-header"><span>活动进度</span></div></template>
            <div class="progress-info">
              <div class="progress-item">
                <span class="progress-label">预算使用</span>
                <el-progress :percentage="budgetUsed" :status="budgetStatus" />
              </div>
              <div class="progress-item">
                <span class="progress-label">时间进度</span>
                <el-progress :percentage="timeProgress" :status="timeStatus" />
              </div>
              <div class="progress-item">
                <span class="progress-label">目标完成</span>
                <el-progress :percentage="goalProgress" :status="goalStatus" />
              </div>
            </div>
          </el-card>

          <!-- 活动标签 -->
          <el-card class="tags-card" shadow="hover">
            <template #header><div class="card-header"><span>标签</span></div></template>
            <div class="tags-container">
              <el-tag v-for="tag in campaignData.tags || []" :key="tag" size="small" style="margin:4px">{{ tag }}</el-tag>
              <span v-if="!campaignData.tags?.length" class="no-tags">暂无标签</span>
            </div>
          </el-card>

          <!-- 快捷操作 -->
          <el-card class="actions-card" shadow="hover">
            <template #header><div class="card-header"><span>快捷操作</span></div></template>
            <div class="quick-actions">
              <el-button type="primary" size="small" @click="viewReports" block>查看报告</el-button>
              <el-button type="success" size="small" @click="duplicateCampaign" block>复制活动</el-button>
              <el-button type="warning" size="small" @click="pauseCampaign" block v-if="isActive">暂停活动</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Edit, Refresh, Delete } from '@element-plus/icons-vue';
import { useMarketingStore } from '../store';
import { formatDate } from '@/utils/format';

const route = useRoute();
const router = useRouter();
const marketingStore = useMarketingStore();
const loading = ref(true);
const campaignData = ref<any>(null);

const statusText = computed(() => {
  const map: Record<string, string> = { active: '进行中', paused: '已暂停', completed: '已完成', draft: '草稿', cancelled: '已取消' };
  return map[campaignData.value?.status] || '未知';
});
const statusType = computed(() => {
  const map: Record<string, string> = { active: 'success', paused: 'warning', completed: 'info', draft: 'info', cancelled: 'danger' };
  return map[campaignData.value?.status] || 'info';
});
const statusClass = computed(() => `status-${campaignData.value?.status || 'draft'}`);
const canDelete = computed(() => campaignData.value?.status === 'draft' || campaignData.value?.status === 'cancelled');
const isActive = computed(() => campaignData.value?.status === 'active');
const budgetUsed = computed(() => campaignData.value?.budget ? Math.min((campaignData.value.spent || 0) / campaignData.value.budget * 100, 100) : 0);
const budgetStatus = computed(() => budgetUsed.value > 90 ? 'exception' : budgetUsed.value > 70 ? 'warning' : 'success');
const timeProgress = computed(() => {
  if (!campaignData.value?.startDate || !campaignData.value?.endDate) return 0;
  const now = Date.now();
  const start = new Date(campaignData.value.startDate).getTime();
  const end = new Date(campaignData.value.endDate).getTime();
  if (now < start) return 0;
  if (now > end) return 100;
  return ((now - start) / (end - start)) * 100;
});
const timeStatus = computed(() => timeProgress.value > 90 ? 'warning' : 'success');
const goalProgress = computed(() => Math.min(campaignData.value?.goalProgress || 0, 100));
const goalStatus = computed(() => goalProgress.value >= 100 ? 'success' : goalProgress.value >= 80 ? 'warning' : 'info');

const loadCampaignData = async () => {
  const id = route.params.id as string;
  if (!id) { ElMessage.error('活动ID无效'); router.push('/marketing'); return; }
  loading.value = true;
  try {
    const data = await marketingStore.getCampaignDetail(id);
    if (data) { campaignData.value = data; }
    else { ElMessage.error('活动不存在'); router.push('/marketing'); }
  } catch (error) { console.error('加载数据失败:', error); ElMessage.error('加载数据失败'); }
  finally { loading.value = false; }
};

const handleEdit = () => router.push(`/marketing/${campaignData.value?.id}/edit`);
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm('确定要删除此活动吗？', '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' });
    await marketingStore.deleteCampaign(campaignData.value.id);
    ElMessage.success('删除成功');
    router.push('/marketing');
  } catch { /* 用户取消 */ }
};
const viewReports = () => router.push(`/marketing/${campaignData.value?.id}/reports`);
const duplicateCampaign = async () => { ElMessage.success('活动已复制'); router.push(`/marketing/create?copy=${campaignData.value.id}`); };
const pauseCampaign = async () => {
  try {
    await ElMessageBox.confirm('确定要暂停此活动吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消' });
    await marketingStore.updateCampaign(campaignData.value.id, { status: 'paused' });
    ElMessage.success('活动已暂停');
    await loadCampaignData();
  } catch { /* 用户取消 */ }
};

onMounted(() => loadCampaignData());
</script>

<style scoped lang="scss">
.marketing-detail-page { padding: 20px;
  .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; .header-left { .page-title { font-size: 24px; font-weight: 600; margin: 8px 0 0; color: #303133; } } .header-right { display: flex; gap: 8px; } }
  .loading-container { padding: 40px 0; }
  .status-banner { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; border-radius: 8px; margin-bottom: 24px; &.status-active { background: #f0f9eb; border-color: #b3e0b3; } &.status-paused { background: #fdf6ec; border-color: #f5dab1; } &.status-completed { background: #f0f9ff; border-color: #b3d8ff; } &.status-draft { background: #f5f7fa; border-color: #dcdfe6; } &.status-cancelled { background: #fef0f0; border-color: #f5baba; } .status-info { display: flex; align-items: center; gap: 16px; .campaign-id, .campaign-date { color: #909399; font-size: 14px; } } }
  .info-card, .stats-card, .channel-card, .progress-card, .tags-card, .actions-card { margin-bottom: 20px; }
  .card-header { display: flex; justify-content: space-between; align-items: center; font-weight: 600; font-size: 16px; }
  .stat-item { text-align: center; .stat-number { font-size: 28px; font-weight: 700; color: #303133; } .stat-label { color: #909399; font-size: 14px; margin-top: 4px; } }
  .progress-info { .progress-item { margin-bottom: 16px; &:last-child { margin-bottom: 0; } .progress-label { display: block; font-size: 14px; color: #606266; margin-bottom: 6px; } } }
  .tags-container { display: flex; flex-wrap: wrap; .no-tags { color: #909399; } }
  .quick-actions { display: flex; flex-direction: column; gap: 8px; }
}
</style>