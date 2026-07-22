<!-- 
  文件路径: frontend/src/modules/customers/pages/Detail.vue
  功能: 客户详情 - 查看客户完整信息
-->

<template>
  <div class="customers-detail-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="handleBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon> 返回
        </el-button>
        <div class="header-title">
          <h1>👤 客户详情</h1>
          <p class="header-subtitle">客户ID: {{ detail.id || 'CUS-001' }}</p>
        </div>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleEdit">
          <el-icon><Edit /></el-icon> 编辑
        </el-button>
        <el-button type="success" @click="handleSendMessage">
          <el-icon><ChatDotSquare /></el-icon> 发送消息
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
          <div class="overview-avatar">
            <el-avatar :size="80" icon="UserFilled" />
          </div>
          <div class="overview-info">
            <div class="overview-name">{{ detail.name || '未命名客户' }}</div>
            <div class="overview-meta">
              <el-tag :type="getLevelTag(detail.level)" size="large">
                {{ getLevelLabel(detail.level) }}
              </el-tag>
              <el-tag :type="detail.status === 'active' ? 'success' : 'info'" size="large">
                {{ detail.status === 'active' ? '🟢 活跃' : '⛔ 非活跃' }}
              </el-tag>
              <span class="overview-id">客户ID: {{ detail.id || 'CUS-001' }}</span>
            </div>
            <div class="overview-contact">
              <span><el-icon><Phone /></el-icon> {{ detail.phone || '-' }}</span>
              <span><el-icon><Message /></el-icon> {{ detail.email || '-' }}</span>
              <span><el-icon><Location /></el-icon> {{ getCityLabel(detail.city) }}, {{ getCountryLabel(detail.country) }}</span>
            </div>
          </div>
          <div class="overview-stats">
            <div class="stat-item">
              <div class="stat-value">SAR {{ formatCurrency(detail.totalSpent) }}</div>
              <div class="stat-label">累计消费</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ detail.orderCount || 0 }}</div>
              <div class="stat-label">订单数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ detail.avgOrderValue || '—' }}</div>
              <div class="stat-label">客单价</div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 详细信息 -->
      <el-row :gutter="20" class="info-row">
        <el-col :span="16">
          <el-card class="info-card" shadow="hover">
            <template #header>
              <span>📋 基本信息</span>
            </template>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="客户名称">{{ detail.name || '-' }}</el-descriptions-item>
              <el-descriptions-item label="客户类型">{{ getTypeLabel(detail.type) }}</el-descriptions-item>
              <el-descriptions-item label="联系电话">{{ detail.phone || '-' }}</el-descriptions-item>
              <el-descriptions-item label="电子邮箱">{{ detail.email || '-' }}</el-descriptions-item>
              <el-descriptions-item label="客户等级">
                <el-tag :type="getLevelTag(detail.level)">{{ getLevelLabel(detail.level) }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="客户来源">{{ getSourceLabel(detail.source) }}</el-descriptions-item>
              <el-descriptions-item label="国家/地区">{{ getCountryLabel(detail.country) }}</el-descriptions-item>
              <el-descriptions-item label="城市">{{ getCityLabel(detail.city) }}</el-descriptions-item>
              <el-descriptions-item label="行业">{{ getIndustryLabel(detail.industry) }}</el-descriptions-item>
              <el-descriptions-item label="企业规模">{{ getSizeLabel(detail.size) }}</el-descriptions-item>
              <el-descriptions-item label="详细地址" :span="2">{{ detail.address || '-' }}</el-descriptions-item>
              <el-descriptions-item label="注册日期" :span="2">{{ detail.createdAt || '2024-10-15 14:30' }}</el-descriptions-item>
              <el-descriptions-item label="最后更新" :span="2">{{ detail.updatedAt || '2024-10-20 10:00' }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>

        <el-col :span="8">
          <!-- 标签 -->
          <el-card class="info-card" shadow="hover">
            <template #header>
              <span>🏷️ 客户标签</span>
            </template>
            <div class="tags-container">
              <el-tag
                v-for="tag in detail.tags || []"
                :key="tag"
                size="large"
                class="tag-item"
                :type="getTagType(tag)"
              >
                {{ getTagLabel(tag) }}
              </el-tag>
              <span v-if="!detail.tags?.length" style="color: #9CA3AF;">暂无标签</span>
            </div>
          </el-card>

          <!-- 备注 -->
          <el-card class="info-card" shadow="hover" style="margin-top: 20px;">
            <template #header>
              <span>📝 备注信息</span>
            </template>
            <div class="notes-container">
              <p>{{ detail.notes || '暂无备注' }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 最近订单 -->
      <el-card class="info-card" shadow="hover" style="margin-top: 20px;">
        <template #header>
          <div class="card-header-with-action">
            <span>📋 最近订单</span>
            <el-button size="small" type="text" @click="handleViewAllOrders">
              查看全部订单 →
            </el-button>
          </div>
        </template>
        <el-table :data="recentOrders" style="width: 100%" stripe>
          <el-table-column prop="orderNumber" label="订单号" width="160" />
          <el-table-column prop="date" label="日期" width="180" />
          <el-table-column prop="amount" label="金额" align="right" width="120">
            <template #default="{ row }">
              SAR {{ formatCurrency(row.amount) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" align="center" width="100">
            <template #default="{ row }">
              <el-tag :type="getOrderStatusTag(row.status)">
                {{ getOrderStatusLabel(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100">
            <template #default="{ row }">
              <el-button size="small" type="primary" text @click="handleViewOrder(row)">
                查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </template>

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
        <p>确定要删除客户 <strong>{{ detail.name }}</strong> 吗？</p>
        <p class="delete-hint">此操作将删除所有相关数据，不可恢复！</p>
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
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft, Edit, Delete, WarningFilled,
  Phone, Message, Location, ChatDotSquare
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

// ============================================================
// 详情数据
// ============================================================

const detail = reactive({
  id: 'CUS-001',
  name: '沙特电信公司',
  type: 'business',
  phone: '+966 50 123 4567',
  email: 'contact@stc.com.sa',
  level: 'vip',
  source: 'store',
  country: 'saudi',
  city: 'riyadh',
  address: '利雅得王国大厦 15楼',
  industry: 'it',
  size: 'enterprise',
  status: 'active',
  tags: ['high-value', 'long-term', 'focus'],
  notes: '重要客户，需定期跟进维护关系。',
  totalSpent: 8560000,
  orderCount: 286,
  avgOrderValue: 'SAR 29,930',
  createdAt: '2024-10-15 14:30',
  updatedAt: '2024-10-20 10:00'
})

// ============================================================
// 最近订单
// ============================================================

const recentOrders = ref([
  { orderNumber: 'ORD-2024-001', date: '2024-10-18 14:30', amount: 285600, status: 'completed' },
  { orderNumber: 'ORD-2024-002', date: '2024-10-15 09:20', amount: 198700, status: 'processing' },
  { orderNumber: 'ORD-2024-003', date: '2024-10-12 16:45', amount: 176500, status: 'pending' },
])

// ============================================================
// 工具函数
// ============================================================

const getLevelLabel = (level: string) => {
  const map: Record<string, string> = {
    vip: 'VIP',
    gold: '黄金',
    silver: '白银',
    bronze: '青铜'
  }
  return map[level] || level
}

const getLevelTag = (level: string) => {
  const map: Record<string, string> = {
    vip: 'danger',
    gold: 'warning',
    silver: 'info',
    bronze: 'primary'
  }
  return map[level] || 'info'
}

const getTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    business: '企业客户',
    individual: '个人客户',
    government: '政府客户'
  }
  return map[type] || type
}

const getSourceLabel = (source: string) => {
  const map: Record<string, string> = {
    store: '线下门店',
    website: '官网',
    social: '社交媒体',
    referral: '推荐介绍',
    phone: '电话销售'
  }
  return map[source] || source
}

const getCountryLabel = (country: string) => {
  const map: Record<string, string> = {
    saudi: '沙特阿拉伯',
    uae: '阿联酋',
    qatar: '卡塔尔',
    kuwait: '科威特',
    oman: '阿曼',
    bahrain: '巴林'
  }
  return map[country] || country
}

const getCityLabel = (city: string) => {
  const map: Record<string, string> = {
    riyadh: '利雅得',
    jeddah: '吉达',
    dammam: '达曼',
    makkah: '麦加',
    madinah: '麦地那'
  }
  return map[city] || city
}

const getIndustryLabel = (industry: string) => {
  const map: Record<string, string> = {
    it: '信息技术',
    finance: '金融银行',
    energy: '石油能源',
    retail: '零售贸易',
    manufacturing: '制造业',
    service: '服务业'
  }
  return map[industry] || industry
}

const getSizeLabel = (size: string) => {
  const map: Record<string, string> = {
    micro: '1-10人',
    small: '11-50人',
    medium: '51-200人',
    large: '201-500人',
    enterprise: '500人以上'
  }
  return map[size] || size
}

const getTagLabel = (tag: string) => {
  const map: Record<string, string> = {
    'high-value': '高价值客户',
    'long-term': '长期客户',
    'new': '新客户',
    'focus': '重点关注'
  }
  return map[tag] || tag
}

const getTagType = (tag: string) => {
  const map: Record<string, string> = {
    'high-value': 'danger',
    'long-term': 'success',
    'new': 'primary',
    'focus': 'warning'
  }
  return map[tag] || 'info'
}

const getOrderStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    pending: '待处理',
    processing: '处理中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return map[status] || status
}

const getOrderStatusTag = (status: string) => {
  const map: Record<string, string> = {
    pending: 'warning',
    processing: 'primary',
    completed: 'success',
    cancelled: 'danger'
  }
  return map[status] || 'info'
}

const formatCurrency = (value: number) => {
  if (!value) return '0'
  return new Intl.NumberFormat('en-SA').format(value)
}

// ============================================================
// 页面操作
// ============================================================

const handleBack = () => {
  router.push('/customers')
}

const handleEdit = () => {
  router.push(`/customers/${detail.id}/edit`)
}

const handleSendMessage = () => {
  ElMessage.info('发送消息功能开发中')
}

const handleDelete = () => {
  deleteVisible.value = true
}

const confirmDelete = async () => {
  deleting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('✅ 客户已删除')
    deleteVisible.value = false
    router.push('/customers')
  } catch (error) {
    ElMessage.error('删除失败，请重试')
  } finally {
    deleting.value = false
  }
}

const handleViewAllOrders = () => {
  ElMessage.info('查看全部订单')
}

const handleViewOrder = (row: any) => {
  ElMessage.info(`查看订单: ${row.orderNumber}`)
}

// ============================================================
// 加载数据
// ============================================================

const loadDetail = async () => {
  loading.value = true
  try {
    const id = route.params.id as string
    // 实际项目中调用 API
    // const res = await api.get(`/customers/${id}`)
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
.customers-detail-page {
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

.overview-avatar {
  flex-shrink: 0;
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

.overview-contact {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  font-size: 14px;
  color: #6B7280;
}

.overview-contact span {
  display: flex;
  align-items: center;
  gap: 4px;
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
   备注
   ============================================================ */

.notes-container {
  padding: 4px 0;
  color: #4B5563;
  line-height: 1.8;
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

[data-theme="dark"] .customers-detail-page {
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

[data-theme="dark"] .overview-contact {
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

[data-theme="dark"] .notes-container {
  color: #D1D5DB;
}

[data-theme="dark"] .delete-confirm p {
  color: #F5F5F7;
}

/* ============================================================
   响应式
   ============================================================ */

@media (max-width: 768px) {
  .customers-detail-page {
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

  .overview-contact {
    flex-direction: column;
    gap: 4px;
  }

  :deep(.el-descriptions) {
    font-size: 13px;
  }

  :deep(.el-descriptions__label) {
    width: 80px;
  }
}
</style>