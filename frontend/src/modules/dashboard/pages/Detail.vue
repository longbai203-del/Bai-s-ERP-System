<!-- 
  文件路径: frontend/src/modules/dashboard/pages/Detail.vue
  功能: 仪表盘详情 - 查看仪表盘完整配置
-->

<template>
  <div class="dashboard-detail-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="handleBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon> 返回
        </el-button>
        <div class="header-title">
          <h1>📊 仪表盘详情</h1>
          <p class="header-subtitle">仪表盘ID: {{ detail.id || 'DASH-001' }}</p>
        </div>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleEdit">
          <el-icon><Edit /></el-icon> 编辑
        </el-button>
        <el-button type="success" @click="handlePreview">
          <el-icon><View /></el-icon> 预览
        </el-button>
        <el-button type="danger" plain @click="handleDelete">
          <el-icon><Delete /></el-icon> 删除
        </el-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>

    <!-- 详情内容 -->
    <template v-else>
      <!-- 概览卡片 -->
      <el-card class="overview-card" shadow="hover">
        <div class="overview-content">
          <div class="overview-icon">
            <span class="icon-large">{{ getTypeIcon(detail.type) }}</span>
          </div>
          <div class="overview-info">
            <div class="overview-name">{{ detail.name || '未命名仪表盘' }}</div>
            <div class="overview-meta">
              <el-tag :type="getTypeTag(detail.type)" size="large">
                {{ getTypeLabel(detail.type) }}
              </el-tag>
              <el-tag :type="detail.status === 'active' ? 'success' : 'info'" size="large">
                {{ detail.status === 'active' ? '🟢 已启用' : '⛔ 已停用' }}
              </el-tag>
              <span class="overview-id">ID: {{ detail.id || 'DASH-001' }}</span>
            </div>
            <div class="overview-desc">{{ detail.description || '无描述信息' }}</div>
          </div>
          <div class="overview-stats">
            <div class="stat-item">
              <div class="stat-value">{{ detail.chartCount || 0 }}</div>
              <div class="stat-label">图表数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ detail.viewCount || 0 }}</div>
              <div class="stat-label">浏览次数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ detail.favoriteCount || 0 }}</div>
              <div class="stat-label">收藏数</div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 详细信息 -->
      <el-row :gutter="20" class="info-row">
        <el-col :span="16">
          <el-card class="info-card" shadow="hover">
            <template #header>
              <span>📋 配置信息</span>
            </template>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="仪表盘名称">{{ detail.name || '-' }}</el-descriptions-item>
              <el-descriptions-item label="仪表盘类型">
                <el-tag :type="getTypeTag(detail.type)">{{ getTypeLabel(detail.type) }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="状态">
                <el-tag :type="detail.status === 'active' ? 'success' : 'info'">
                  {{ detail.status === 'active' ? '启用' : '停用' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="自动刷新">
                {{ getAutoRefreshLabel(detail.autoRefresh) }}
              </el-descriptions-item>
              <el-descriptions-item label="布局类型">{{ getLayoutLabel(detail.layout) }}</el-descriptions-item>
              <el-descriptions-item label="列数">{{ detail.columns || 2 }} 列</el-descriptions-item>
              <el-descriptions-item label="主题配色">{{ getThemeLabel(detail.theme) }}</el-descriptions-item>
              <el-descriptions-item label="创建人">{{ detail.createdBy || '系统管理员' }}</el-descriptions-item>
              <el-descriptions-item label="创建时间" :span="2">{{ detail.createdAt || '2024-10-15 14:30' }}</el-descriptions-item>
              <el-descriptions-item label="最后更新" :span="2">{{ detail.updatedAt || '2024-10-20 10:00' }}</el-descriptions-item>
              <el-descriptions-item label="仪表盘描述" :span="2">{{ detail.description || '无描述' }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>

        <el-col :span="8">
          <!-- 图表组件列表 -->
          <el-card class="info-card" shadow="hover">
            <template #header>
              <span>📊 图表组件 ({{ (detail.charts || []).length }})</span>
            </template>
            <div class="chart-list">
              <div
                v-for="(chart, index) in detail.charts || []"
                :key="index"
                class="chart-list-item"
              >
                <span class="chart-icon">{{ getChartIcon(chart.type) }}</span>
                <span class="chart-name">{{ chart.name }}</span>
                <span class="chart-type">{{ getChartTypeLabel(chart.type) }}</span>
              </div>
              <div v-if="!detail.charts?.length" class="chart-empty">
                <span style="color: #9CA3AF;">暂无图表组件</span>
              </div>
            </div>
          </el-card>

          <!-- 标签 -->
          <el-card class="info-card" shadow="hover" style="margin-top: 20px;">
            <template #header>
              <span>🏷️ 标签</span>
            </template>
            <div class="tags-container">
              <el-tag
                v-for="tag in detail.tags || []"
                :key="tag"
                size="large"
                class="tag-item"
              >
                {{ tag }}
              </el-tag>
              <span v-if="!detail.tags?.length" style="color: #9CA3AF;">暂无标签</span>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 预览模拟 -->
      <el-card class="info-card" shadow="hover" style="margin-top: 20px;">
        <template #header>
          <div class="card-header-with-action">
            <span>📈 仪表盘预览</span>
            <el-button size="small" type="text" @click="handleFullPreview">
              全屏预览 →
            </el-button>
          </div>
        </template>
        <div class="preview-mini">
          <el-row :gutter="16" class="mini-kpi">
            <el-col :span="6" v-for="kpi in miniKpis" :key="kpi.label">
              <div class="mini-kpi-card">
                <div class="mini-kpi-label">{{ kpi.label }}</div>
                <div class="mini-kpi-value">{{ kpi.value }}</div>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="16" class="mini-charts">
            <el-col
              v-for="chart in (detail.charts || []).slice(0, 4)"
              :key="chart.id"
              :span="6"
            >
              <div class="mini-chart-placeholder">
                <span class="mini-chart-icon">{{ getChartIcon(chart.type) }}</span>
                <span class="mini-chart-name">{{ chart.name }}</span>
              </div>
            </el-col>
            <el-col v-if="!detail.charts?.length" :span="24">
              <div class="mini-chart-empty">
                <el-empty description="暂无图表" :image-size="50" />
              </div>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </template>

    <!-- 预览对话框 -->
    <el-dialog
      v-model="previewVisible"
      title="仪表盘全屏预览"
      width="95%"
      top="2vh"
      fullscreen
      :destroy-on-close="true"
    >
      <div class="full-preview">
        <div class="full-preview-header">
          <h2>{{ detail.name || '仪表盘预览' }}</h2>
          <div class="full-preview-meta">
            <el-tag :type="getTypeTag(detail.type)">{{ getTypeLabel(detail.type) }}</el-tag>
            <el-tag :type="detail.status === 'active' ? 'success' : 'info'">
              {{ detail.status === 'active' ? '🟢 已启用' : '⛔ 已停用' }}
            </el-tag>
            <span>更新于: {{ detail.updatedAt || '2024-10-20 10:00' }}</span>
          </div>
        </div>

        <el-divider />

        <div class="full-preview-body">
          <el-row :gutter="16" class="full-kpi">
            <el-col :span="6" v-for="kpi in fullKpis" :key="kpi.label">
              <div class="full-kpi-card">
                <div class="full-kpi-label">{{ kpi.label }}</div>
                <div class="full-kpi-value">{{ kpi.value }}</div>
                <div class="full-kpi-change" :class="kpi.trend">
                  {{ kpi.trend === 'up' ? '↑' : '↓' }} {{ kpi.change }}%
                </div>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="16" class="full-charts">
            <el-col
              v-for="chart in detail.charts || []"
              :key="chart.id"
              :span="Math.floor(24 / Math.min((detail.columns || 2), 4))"
            >
              <div class="full-chart-card">
                <div class="full-chart-header">
                  <span class="full-chart-icon">{{ getChartIcon(chart.type) }}</span>
                  <span class="full-chart-name">{{ chart.name }}</span>
                  <span class="full-chart-type">{{ getChartTypeLabel(chart.type) }}</span>
                </div>
                <div class="full-chart-body">
                  <el-empty description="图表数据加载中" :image-size="60" />
                </div>
              </div>
            </el-col>
          </el-row>

          <div v-if="!detail.charts?.length" class="full-empty">
            <el-empty description="暂无图表组件" />
          </div>
        </div>
      </div>

      <template #footer>
        <el-button @click="previewVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleEdit; previewVisible = false">
          <el-icon><Edit /></el-icon> 编辑仪表盘
        </el-button>
      </template>
    </el-dialog>

    <!-- 删除确认对话框 -->
    <el-dialog
      v-model="deleteVisible"
      title="⚠️ 确认删除"
      width="420px"
      :close-on-click-modal="false"
    >
      <div class="delete-confirm">
        <el-icon class="delete-icon" color="#F56C6C" size="48">
          <WarningFilled />
        </el-icon>
        <p>确定要删除仪表盘 <strong>{{ detail.name }}</strong> 吗？</p>
        <p class="delete-hint">此操作将删除所有配置和数据，不可恢复！</p>
      </div>
      <template #footer>
        <el-button @click="deleteVisible = false">取消</el-button>
        <el-button type="danger" :loading="deleting" @click="confirmDelete">
          确认删除
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft, Edit, View, Delete, WarningFilled
} from '@element-plus/icons-vue'

// ============================================================
// 路由
// ============================================================

const router = useRouter()
const route = useRoute()

// ============================================================
// 响应式数据
// ============================================================

const loading = ref(false)
const deleting = ref(false)
const deleteVisible = ref(false)
const previewVisible = ref(false)

// ============================================================
// 详情数据
// ============================================================

const detail = reactive({
  id: 'DASH-001',
  name: '总览仪表盘',
  type: 'overview',
  status: 'active',
  autoRefresh: '60',
  layout: 'grid',
  columns: 2,
  theme: 'light',
  description: '系统总览仪表盘，展示核心业务指标',
  createdBy: 'Ahmed Al-Fahd',
  createdAt: '2024-10-15 14:30',
  updatedAt: '2024-10-20 10:00',
  chartCount: 6,
  viewCount: 286,
  favoriteCount: 45,
  tags: ['核心', '管理层', '实时'],
  charts: [
    { id: 'chart-1', name: '销售趋势图', type: 'trend' },
    { id: 'chart-2', name: '销售占比图', type: 'pie' },
    { id: 'chart-3', name: 'KPI指标卡', type: 'kpi' },
    { id: 'chart-4', name: '柱状对比图', type: 'bar' },
    { id: 'chart-5', name: '表格数据', type: 'table' },
    { id: 'chart-6', name: '热力图', type: 'heatmap' },
  ]
})

// ============================================================
// 预览数据
// ============================================================

const miniKpis = ref([
  { label: '总销售额', value: 'SAR 12.8M' },
  { label: '总利润', value: 'SAR 4.3M' },
  { label: '订单数', value: '1,286' },
  { label: '客单价', value: 'SAR 9,998' },
])

const fullKpis = ref([
  { label: '总销售额', value: 'SAR 12,856,000', change: 12.5, trend: 'up' },
  { label: '总利润', value: 'SAR 4,296,000', change: 18.7, trend: 'up' },
  { label: '订单数', value: '1,286', change: 8.3, trend: 'up' },
  { label: '客单价', value: 'SAR 9,998', change: 3.2, trend: 'up' },
])

// ============================================================
// 工具函数
// ============================================================

const getTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    overview: '总览',
    sales: '销售',
    finance: '财务',
    inventory: '库存',
    purchase: '采购',
    performance: '绩效'
  }
  return map[type] || type
}

const getTypeTag = (type: string) => {
  const map: Record<string, string> = {
    overview: 'primary',
    sales: 'success',
    finance: 'danger',
    inventory: 'warning',
    purchase: 'info',
    performance: 'primary'
  }
  return map[type] || 'info'
}

const getTypeIcon = (type: string) => {
  const map: Record<string, string> = {
    overview: '📊',
    sales: '📈',
    finance: '💰',
    inventory: '📦',
    purchase: '🛒',
    performance: '⭐'
  }
  return map[type] || '📊'
}

const getChartIcon = (type: string) => {
  const map: Record<string, string> = {
    trend: '📈',
    pie: '🍩',
    kpi: '📊',
    bar: '📊',
    table: '📋',
    heatmap: '🔥'
  }
  return map[type] || '📊'
}

const getChartTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    trend: '趋势图',
    pie: '饼图',
    kpi: 'KPI指标',
    bar: '柱状图',
    table: '数据表',
    heatmap: '热力图'
  }
  return map[type] || type
}

const getAutoRefreshLabel = (value: string) => {
  const map: Record<string, string> = {
    none: '不自动刷新',
    '30': '30秒',
    '60': '1分钟',
    '300': '5分钟',
    '600': '10分钟'
  }
  return map[value] || value
}

const getLayoutLabel = (layout: string) => {
  const map: Record<string, string> = {
    grid: '网格布局',
    flex: '弹性布局',
    custom: '自定义'
  }
  return map[layout] || layout
}

const getThemeLabel = (theme: string) => {
  const map: Record<string, string> = {
    light: '☀️ 明亮',
    dark: '🌙 暗色',
    auto: '🔄 跟随系统'
  }
  return map[theme] || theme
}

// ============================================================
// 页面操作
// ============================================================

const handleBack = () => {
  router.push('/dashboard')
}

const handleEdit = () => {
  router.push(`/dashboard/${detail.id}/edit`)
}

const handlePreview = () => {
  previewVisible.value = true
}

const handleFullPreview = () => {
  previewVisible.value = true
}

const handleDelete = () => {
  deleteVisible.value = true
}

const confirmDelete = async () => {
  deleting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('✅ 仪表盘已删除')
    deleteVisible.value = false
    router.push('/dashboard')
  } catch (error) {
    ElMessage.error('删除失败，请重试')
  } finally {
    deleting.value = false
  }
}

// ============================================================
// 加载数据
// ============================================================

const loadDetail = async () => {
  loading.value = true
  try {
    const id = route.params.id as string
    // 实际项目中调用 API
    // const res = await api.get(`/dashboards/${id}`)
    // Object.assign(detail, res.data)
    await new Promise(resolve => setTimeout(resolve, 500))
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDetail()
})
</script>

<style scoped>
.dashboard-detail-page {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}

/* ============================================================
   页面头部
   ============================================================ */

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.back-btn {
  margin-top: 4px;
}

.header-title h1 {
  font-size: 24px;
  font-weight: 700;
  color: #1F2937;
  margin: 0 0 4px 0;
}

.header-subtitle {
  color: #6B7280;
  margin: 0;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* ============================================================
   加载状态
   ============================================================ */

.loading-container {
  padding: 20px 0;
}

/* ============================================================
   概览卡片
   ============================================================ */

.overview-card {
  border-radius: 12px;
  margin-bottom: 20px;
}

.overview-card :deep(.el-card__body) {
  padding: 20px 24px;
}

.overview-content {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.overview-icon {
  flex-shrink: 0;
}

.icon-large {
  font-size: 48px;
}

.overview-info {
  flex: 1;
}

.overview-name {
  font-size: 22px;
  font-weight: 700;
  color: #1F2937;
}

.overview-meta {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  margin: 6px 0;
}

.overview-id {
  font-size: 13px;
  color: #9CA3AF;
}

.overview-desc {
  font-size: 14px;
  color: #6B7280;
}

.overview-stats {
  display: flex;
  gap: 32px;
  flex-shrink: 0;
}

.overview-stats .stat-item {
  text-align: center;
}

.overview-stats .stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #4F46E5;
}

.overview-stats .stat-label {
  font-size: 12px;
  color: #9CA3AF;
}

/* ============================================================
   信息卡片
   ============================================================ */

.info-row {
  margin-bottom: 20px;
}

.info-card {
  border-radius: 12px;
}

.info-card :deep(.el-card__header) {
  font-weight: 600;
  font-size: 16px;
  color: #1F2937;
  border-bottom: 1px solid #F3F4F6;
}

:deep(.el-descriptions) {
  font-size: 14px;
}

:deep(.el-descriptions__label) {
  color: #6B7280;
  font-weight: 500;
  width: 120px;
}

/* ============================================================
   图表列表
   ============================================================ */

.chart-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.chart-list-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: #F9FAFB;
  border-radius: 6px;
  font-size: 13px;
}

.chart-icon {
  font-size: 16px;
}

.chart-name {
  flex: 1;
  font-weight: 500;
  color: #1F2937;
}

.chart-type {
  font-size: 11px;
  color: #9CA3AF;
}

.chart-empty {
  text-align: center;
  padding: 12px 0;
}

/* ============================================================
   标签
   ============================================================ */

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 4px 0;
}

.tag-item {
  margin-bottom: 2px;
}

/* ============================================================
   卡片头部带操作
   ============================================================ */

.card-header-with-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* ============================================================
   预览迷你
   ============================================================ */

.preview-mini {
  padding: 4px 0;
}

.mini-kpi {
  margin-bottom: 12px;
}

.mini-kpi-card {
  text-align: center;
  padding: 8px;
  background: #F9FAFB;
  border-radius: 6px;
}

.mini-kpi-label {
  font-size: 11px;
  color: #9CA3AF;
}

.mini-kpi-value {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
}

.mini-chart-placeholder {
  text-align: center;
  padding: 12px;
  background: #F9FAFB;
  border-radius: 6px;
  border: 1px dashed #D1D5DB;
}

.mini-chart-icon {
  font-size: 24px;
  display: block;
}

.mini-chart-name {
  font-size: 12px;
  color: #6B7280;
}

.mini-chart-empty {
  padding: 8px 0;
}

/* ============================================================
   全屏预览
   ============================================================ */

.full-preview {
  padding: 8px 0;
}

.full-preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.full-preview-header h2 {
  margin: 0;
  font-size: 20px;
  color: #1F2937;
}

.full-preview-meta {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.full-preview-body {
  padding: 8px 0;
}

.full-kpi {
  margin-bottom: 16px;
}

.full-kpi-card {
  text-align: center;
  padding: 16px;
  background: #F9FAFB;
  border-radius: 8px;
}

.full-kpi-label {
  font-size: 13px;
  color: #9CA3AF;
}

.full-kpi-value {
  font-size: 22px;
  font-weight: 700;
  color: #1F2937;
  margin: 4px 0;
}

.full-kpi-change {
  font-size: 12px;
}

.full-kpi-change.up {
  color: #67C23A;
}

.full-kpi-change.down {
  color: #F56C6C;
}

.full-charts {
  margin-top: 8px;
}

.full-chart-card {
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  overflow: hidden;
}

.full-chart-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #F9FAFB;
  border-bottom: 1px solid #E5E7EB;
}

.full-chart-icon {
  font-size: 18px;
}

.full-chart-name {
  font-weight: 600;
  font-size: 14px;
  color: #1F2937;
}

.full-chart-type {
  font-size: 11px;
  color: #9CA3AF;
}

.full-chart-body {
  padding: 20px;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.full-empty {
  padding: 40px 0;
}

/* ============================================================
   删除确认对话框
   ============================================================ */

.delete-confirm {
  text-align: center;
  padding: 16px 0;
}

.delete-icon {
  margin-bottom: 16px;
}

.delete-confirm p {
  font-size: 16px;
  color: #1F2937;
  margin: 8px 0;
}

.delete-hint {
  font-size: 13px;
  color: #EF4444 !important;
}

/* ============================================================
   暗色模式
   ============================================================ */

[data-theme="dark"] .dashboard-detail-page {
  background: #1A1A2E;
}

[data-theme="dark"] .header-title h1 {
  color: #F5F5F7;
}

[data-theme="dark"] .overview-card {
  background: #2C2C2E;
}

[data-theme="dark"] .overview-name {
  color: #F5F5F7;
}

[data-theme="dark"] .overview-desc {
  color: #9CA3AF;
}

[data-theme="dark"] .overview-stats .stat-value {
  color: #818CF8;
}

[data-theme="dark"] .info-card {
  background: #2C2C2E;
}

[data-theme="dark"] .info-card :deep(.el-card__header) {
  color: #F5F5F7;
  border-color: #3A3A3C;
}

[data-theme="dark"] :deep(.el-descriptions) {
  color: #F5F5F7;
}

[data-theme="dark"] :deep(.el-descriptions__label) {
  color: #9CA3AF;
}

[data-theme="dark"] :deep(.el-descriptions .el-descriptions__body .el-descriptions__table .el-descriptions-item__cell) {
  border-color: #3A3A3C;
}

[data-theme="dark"] .chart-list-item {
  background: #3A3A3C;
}

[data-theme="dark"] .chart-name {
  color: #F5F5F7;
}

[data-theme="dark"] .mini-kpi-card {
  background: #3A3A3C;
}

[data-theme="dark"] .mini-kpi-value {
  color: #F5F5F7;
}

[data-theme="dark"] .mini-chart-placeholder {
  background: #3A3A3C;
  border-color: #48484A;
}

[data-theme="dark"] .full-preview-header h2 {
  color: #F5F5F7;
}

[data-theme="dark"] .full-kpi-card {
  background: #3A3A3C;
}

[data-theme="dark"] .full-kpi-value {
  color: #F5F5F7;
}

[data-theme="dark"] .full-chart-card {
  border-color: #3A3A3C;
}

[data-theme="dark"] .full-chart-header {
  background: #3A3A3C;
  border-color: #3A3A3C;
}

[data-theme="dark"] .full-chart-name {
  color: #F5F5F7;
}

[data-theme="dark"] .delete-confirm p {
  color: #F5F5F7;
}

/* ============================================================
   响应式
   ============================================================ */

@media (max-width: 768px) {
  .dashboard-detail-page {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-left {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  .header-actions .el-button {
    flex: 1;
    min-width: 80px;
  }

  .overview-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .overview-stats {
    width: 100%;
    justify-content: space-around;
  }

  :deep(.el-descriptions) {
    font-size: 13px;
  }

  :deep(.el-descriptions__label) {
    width: 80px;
  }

  .full-preview-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .full-chart-card {
    margin-bottom: 12px;
  }
}
</style>