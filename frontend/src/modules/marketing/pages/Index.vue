<!--
  文件路径: frontend/src/modules/marketing/pages/Index.vue
  功能: 营销仪表盘 - 市场营销总览与控制面板
  包含: 统计卡片、渠道分析、活动趋势、营销活动列表、快速入口、通知提醒
-->

<template>
  <div class="marketing-dashboard">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">📊 营销仪表盘</h1>
        <p class="page-subtitle">实时营销数据总览与智能分析</p>
      </div>
      <div class="header-right">
        <el-button-group>
          <el-button type="primary" @click="handleRefresh" :loading="refreshing">
            <el-icon><Refresh /></el-icon> 刷新数据
          </el-button>
          <el-button type="success" @click="handleExportReport">
            <el-icon><Download /></el-icon> 导出报告
          </el-button>
          <el-button type="warning" @click="handlePrint">
            <el-icon><Printer /></el-icon> 打印
          </el-button>
        </el-button-group>
      </div>
    </div>

    <!-- 统计卡片区域 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :xs="24" :sm="12" :md="6" v-for="(stat, index) in dashboardStats" :key="index">
        <el-card class="stat-card" :class="stat.type" shadow="hover" @click="handleStatClick(stat)">
          <div class="stat-icon" :style="{ background: stat.iconBg }">
            <el-icon :size="28"><component :is="stat.icon" /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-label">{{ stat.label }}</div>
            <div class="stat-value-wrapper">
              <span class="stat-value">{{ stat.value }}</span>
              <span class="stat-trend" :class="stat.trend">
                <el-icon><component :is="stat.trend === 'up' ? 'CaretTop' : 'CaretBottom'" /></el-icon>
                {{ stat.change }}%
              </span>
            </div>
            <div class="stat-compare">较上月 {{ stat.compare }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表和渠道分析区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :lg="16">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span><el-icon><TrendCharts /></el-icon> 营销效果趋势</span>
              <el-radio-group v-model="trendPeriod" size="small" @change="handleTrendChange">
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="quarter">本季</el-radio-button>
                <el-radio-button label="year">本年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container" ref="trendChartRef">
            <div class="trend-chart">
              <div class="chart-grid">
                <div class="grid-line" v-for="n in 5" :key="n" :style="{ bottom: (n * 20) + '%' }">
                  <span class="grid-label">{{ (n * 20) }}%</span>
                </div>
              </div>
              <div class="chart-bars">
                <div class="bar-group" v-for="(item, index) in trendData" :key="index">
                  <div class="bar-wrapper">
                    <div class="bar bar-reach" :style="{ height: item.reachPercent + '%' }">
                      <span class="bar-value">{{ item.reach }}</span>
                    </div>
                    <div class="bar bar-conversion" :style="{ height: item.conversionPercent + '%' }">
                      <span class="bar-value">{{ item.conversion }}%</span>
                    </div>
                  </div>
                  <div class="bar-label">{{ item.label }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="chart-legend">
            <span class="legend-item"><span class="legend-dot reach-dot"></span>触达人数</span>
            <span class="legend-item"><span class="legend-dot conversion-dot"></span>转化率</span>
            <span class="legend-item"><span class="legend-dot roi-dot"></span>ROI</span>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="8">
        <el-card class="quick-actions-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span><el-icon><Odometer /></el-icon> 快捷操作</span>
            </div>
          </template>
          <div class="quick-actions-grid">
            <div class="quick-action" v-for="action in quickActions" :key="action.label" @click="handleQuickAction(action)">
              <div class="action-icon" :style="{ background: action.color }">
                <el-icon :size="24"><component :is="action.icon" /></el-icon>
              </div>
              <span class="action-label">{{ action.label }}</span>
              <span class="action-desc">{{ action.desc }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 活动列表和通知区域 -->
    <el-row :gutter="20" class="list-row">
      <el-col :xs="24" :lg="16">
        <el-card class="campaign-list-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span><el-icon><Present /></el-icon> 最新营销活动</span>
              <div class="header-actions">
                <el-input v-model="searchKeyword" placeholder="搜索活动..." size="small" style="width: 180px" clearable>
                  <template #prefix><el-icon><Search /></el-icon></template>
                </el-input>
                <el-button size="small" type="primary" @click="handleViewAll">查看全部</el-button>
              </div>
            </div>
          </template>
          <el-table :data="filteredCampaignList" style="width: 100%" stripe>
            <el-table-column prop="name" label="活动名称" min-width="150">
              <template #default="{ row }">
                <div class="campaign-name">
                  <span class="name-icon">{{ getTypeIcon(row.type) }}</span>
                  <span class="name-text">{{ row.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="类型" width="100">
              <template #default="{ row }">
                <el-tag :type="getTypeTag(row.type)" size="small">
                  {{ getTypeLabel(row.type) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="budget" label="预算" width="120" align="right">
              <template #default="{ row }">{{ formatCurrency(row.budget) }}</template>
            </el-table-column>
            <el-table-column prop="reach" label="触达" width="100" align="center">
              <template #default="{ row }">{{ row.reach?.toLocaleString() || 0 }}</template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100" align="center">
              <template #default="{ row }">
                <el-tag :type="getStatusTag(row.status)" size="small">
                  {{ getStatusLabel(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" align="center" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" size="small" link @click="handleViewCampaign(row)">
                  查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="table-footer">
            <el-pagination
              v-model:current-page="campaignPage"
              v-model:page-size="campaignPageSize"
              :total="campaignTotal"
              :page-sizes="[5, 10, 20]"
              size="small"
              layout="total, prev, pager, next"
              @current-change="handleCampaignPageChange"
            />
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="8">
        <el-card class="notification-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span><el-icon><Bell /></el-icon> 待办提醒</span>
              <el-badge :value="pendingCount" :hidden="pendingCount === 0" type="danger">
                <el-button size="small" @click="handleViewAllNotifications">全部</el-button>
              </el-badge>
            </div>
          </template>
          <div class="notification-list">
            <div class="notification-item" v-for="(notif, index) in notifications" :key="index" @click="handleNotificationClick(notif)">
              <div class="notif-icon" :class="notif.type">
                <el-icon><component :is="notif.icon" /></el-icon>
              </div>
              <div class="notif-content">
                <div class="notif-title">{{ notif.title }}</div>
                <div class="notif-desc">{{ notif.desc }}</div>
                <div class="notif-time">{{ notif.time }}</div>
              </div>
              <div class="notif-badge" v-if="!notif.read">
                <el-badge value="新" type="danger" />
              </div>
            </div>
          </div>
          <div class="notification-footer">
            <el-button type="primary" link @click="handleViewAllNotifications">查看所有待办 →</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 渠道分布卡片 -->
    <el-card class="channel-card" shadow="hover" style="margin-top: 20px;">
      <template #header>
        <div class="card-header">
          <span><el-icon><Grid /></el-icon> 渠道效果分布</span>
          <el-button size="small" @click="handleViewChannels">管理渠道</el-button>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" :lg="4" v-for="channel in channelStats" :key="channel.name">
          <div class="channel-item" @click="handleChannelClick(channel)">
            <div class="channel-icon" :style="{ background: channel.color }">
              <el-icon :size="20"><component :is="channel.icon" /></el-icon>
            </div>
            <div class="channel-info">
              <div class="channel-name">{{ channel.name }}</div>
              <div class="channel-count">{{ channel.value }}</div>
              <div class="channel-progress">
                <el-progress :percentage="channel.percentage" :color="channel.color" :stroke-width="6" />
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 底部版权信息 -->
    <div class="dashboard-footer">
      <span>© {{ currentYear }} 营销管理系统 v3.0 - 数据实时更新</span>
      <span>最后更新: {{ lastUpdateTime }}</span>
    </div>

    <!-- 活动详情对话框 -->
    <el-dialog v-model="showCampaignDialog" title="活动详情" width="600px" destroy-on-close>
      <div v-if="selectedCampaign" class="campaign-dialog-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="活动名称">{{ selectedCampaign.name }}</el-descriptions-item>
          <el-descriptions-item label="活动类型">
            <el-tag :type="getTypeTag(selectedCampaign.type)">{{ getTypeLabel(selectedCampaign.type) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="预算">{{ formatCurrency(selectedCampaign.budget) }}</el-descriptions-item>
          <el-descriptions-item label="触达人数">{{ selectedCampaign.reach?.toLocaleString() || 0 }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusTag(selectedCampaign.status)">{{ getStatusLabel(selectedCampaign.status) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="ROI">{{ selectedCampaign.roi || '0%' }}</el-descriptions-item>
          <el-descriptions-item label="开始日期" :span="2">{{ selectedCampaign.startDate || '未设置' }}</el-descriptions-item>
          <el-descriptions-item label="结束日期" :span="2">{{ selectedCampaign.endDate || '未设置' }}</el-descriptions-item>
          <el-descriptions-item label="活动描述" :span="2">{{ selectedCampaign.description || '无描述' }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="showCampaignDialog = false">关闭</el-button>
        <el-button type="primary" @click="handleEditCampaign(selectedCampaign)">编辑活动</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Refresh, Download, Printer, TrendCharts, Odometer, Present, Search,
  Bell, Grid, CaretTop, CaretBottom, Setting, Document, Money,
  UserFilled, Plus, Edit, Delete, View, Calendar, Clock, Warning,
  Check, Close, CircleCheck, CircleClose, List, DataLine, PieChart,
  Promotion, Files, Tickets, HomeFilled, OfficeBuilding, Briefcase,
  Location, Phone, Message, ArrowRight, ArrowLeft, Share, Monitor,
  ChatDotRound, Star, Medal, Trophy, Collection, Goods
} from '@element-plus/icons-vue'

// ==================== Router ====================
const router = useRouter()

// ==================== 状态变量 ====================
const refreshing = ref(false)
const searchKeyword = ref('')
const trendPeriod = ref('month')
const campaignPage = ref(1)
const campaignPageSize = ref(5)
const campaignTotal = ref(0)
const pendingCount = ref(6)
const showCampaignDialog = ref(false)
const selectedCampaign = ref<any>(null)
const lastUpdateTime = ref('')
const currentYear = new Date().getFullYear()
const trendChartRef = ref(null)

// ==================== 仪表盘统计数据 ====================
const dashboardStats = ref([
  {
    label: '营销活动数',
    value: '86',
    change: 12.5,
    trend: 'up',
    compare: '增加 9 个',
    type: 'primary',
    icon: 'Present',
    iconBg: 'linear-gradient(135deg, #409EFF, #66b1ff)',
    key: 'total'
  },
  {
    label: '总曝光量',
    value: '1,285,600',
    change: 18.3,
    trend: 'up',
    compare: '增加 198K',
    type: 'success',
    icon: 'View',
    iconBg: 'linear-gradient(135deg, #67C23A, #85ce61)',
    key: 'exposure'
  },
  {
    label: '点击转化率',
    value: '8.5%',
    change: 2.1,
    trend: 'up',
    compare: '增加 0.8%',
    type: 'warning',
    icon: 'TrendCharts',
    iconBg: 'linear-gradient(135deg, #E6A23C, #ebb563)',
    key: 'ctr'
  },
  {
    label: '营销ROI',
    value: '285%',
    change: 5.6,
    trend: 'up',
    compare: '增加 15%',
    type: 'danger',
    icon: 'Money',
    iconBg: 'linear-gradient(135deg, #F56C6C, #f78989)',
    key: 'roi'
  },
  {
    label: '线索总数',
    value: '2,856',
    change: 22.3,
    trend: 'up',
    compare: '增加 521 条',
    type: 'primary',
    icon: 'UserFilled',
    iconBg: 'linear-gradient(135deg, #409EFF, #66b1ff)',
    key: 'leads'
  },
  {
    label: '获客成本',
    value: 'SAR 285',
    change: -3.2,
    trend: 'down',
    compare: '减少 SAR 12',
    type: 'info',
    icon: 'Money',
    iconBg: 'linear-gradient(135deg, #909399, #b1b3b8)',
    key: 'cac'
  }
])

// ==================== 趋势数据 ====================
const trendData = ref([
  { label: '1月', reach: 120, conversion: 6.5, reachPercent: 60, conversionPercent: 32 },
  { label: '2月', reach: 200, conversion: 7.2, reachPercent: 100, conversionPercent: 36 },
  { label: '3月', reach: 150, conversion: 7.8, reachPercent: 75, conversionPercent: 39 },
  { label: '4月', reach: 180, conversion: 8.2, reachPercent: 90, conversionPercent: 41 },
  { label: '5月', reach: 220, conversion: 8.8, reachPercent: 110, conversionPercent: 44 },
  { label: '6月', reach: 260, conversion: 9.5, reachPercent: 130, conversionPercent: 47 },
  { label: '7月', reach: 240, conversion: 9.2, reachPercent: 120, conversionPercent: 46 },
  { label: '8月', reach: 280, conversion: 10.1, reachPercent: 140, conversionPercent: 50 },
  { label: '9月', reach: 210, conversion: 8.9, reachPercent: 105, conversionPercent: 44 },
  { label: '10月', reach: 300, conversion: 10.8, reachPercent: 150, conversionPercent: 54 },
  { label: '11月', reach: 350, conversion: 11.5, reachPercent: 175, conversionPercent: 57 },
  { label: '12月', reach: 400, conversion: 12.2, reachPercent: 200, conversionPercent: 61 }
])

// ==================== 快捷操作 ====================
const quickActions = ref([
  { label: '新建活动', icon: 'Plus', color: '#409EFF', desc: '创建营销活动', route: '/marketing/campaigns/create' },
  { label: '邮件营销', icon: 'Message', color: '#67C23A', desc: '发送邮件', route: '/marketing/email' },
  { label: '社交媒体', icon: 'Share', color: '#E6A23C', desc: '发布内容', route: '/marketing/social' },
  { label: '线索管理', icon: 'UserFilled', color: '#8B5CF6', desc: '管理销售线索', route: '/marketing/leads' },
  { label: '营销分析', icon: 'DataLine', color: '#F59E0B', desc: '查看分析报告', route: '/marketing/analytics' },
  { label: '营销自动化', icon: 'Setting', color: '#10B981', desc: '自动化工作流', route: '/marketing/automation' }
])

// ==================== 活动列表数据 ====================
const campaignList = ref([
  {
    id: 1,
    name: '双十一促销活动',
    type: 'promotion',
    budget: 1250000,
    reach: 285600,
    status: 'active',
    roi: '285%',
    startDate: '2024-11-01',
    endDate: '2024-11-11',
    description: '双十一购物节大型促销活动，覆盖线上线下全渠道'
  },
  {
    id: 2,
    name: '品牌周年庆',
    type: 'brand',
    budget: 980000,
    reach: 198700,
    status: 'active',
    roi: '168%',
    startDate: '2024-10-15',
    endDate: '2024-10-31',
    description: '品牌成立10周年庆祝活动，提升品牌认知度'
  },
  {
    id: 3,
    name: '新客户获客计划',
    type: 'acquisition',
    budget: 750000,
    reach: 176500,
    status: 'pending',
    roi: '0%',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    description: '针对新客户的获客活动，提供首单优惠'
  },
  {
    id: 4,
    name: 'VIP会员专享活动',
    type: 'member',
    budget: 450000,
    reach: 85600,
    status: 'ended',
    roi: '320%',
    startDate: '2024-09-01',
    endDate: '2024-09-30',
    description: 'VIP会员专属优惠活动，提升会员忠诚度'
  },
  {
    id: 5,
    name: '开斋节促销',
    type: 'holiday',
    budget: 820000,
    reach: 215000,
    status: 'active',
    roi: '210%',
    startDate: '2024-04-01',
    endDate: '2024-04-10',
    description: '开斋节节日促销活动'
  },
  {
    id: 6,
    name: '夏季清仓大促',
    type: 'promotion',
    budget: 560000,
    reach: 142000,
    status: 'ended',
    roi: '156%',
    startDate: '2024-07-01',
    endDate: '2024-07-15',
    description: '夏季清仓促销，清理库存'
  }
])

// ==================== 通知列表 ====================
const notifications = ref([
  {
    title: '新活动待审批',
    desc: '夏季促销活动等待审批',
    time: '5分钟前',
    type: 'warning',
    icon: 'Clock',
    read: false
  },
  {
    title: '邮件营销完成',
    desc: '双十一促销邮件已发送至 856 位客户',
    time: '15分钟前',
    type: 'success',
    icon: 'Message',
    read: false
  },
  {
    title: '营销预算提醒',
    desc: '本月营销预算已使用 78%，即将超支',
    time: '1小时前',
    type: 'danger',
    icon: 'Warning',
    read: false
  },
  {
    title: '新线索分配',
    desc: '3 条新销售线索已分配至销售团队',
    time: '2小时前',
    type: 'info',
    icon: 'UserFilled',
    read: true
  },
  {
    title: '社交媒体发布成功',
    desc: 'Instagram 内容已成功发布',
    time: '3小时前',
    type: 'success',
    icon: 'Share',
    read: true
  }
])

// ==================== 渠道统计 ====================
const channelStats = ref([
  { name: '邮件营销', value: '35%', percentage: 35, color: '#409EFF', icon: 'Message' },
  { name: '社交媒体', value: '28%', percentage: 28, color: '#67C23A', icon: 'Share' },
  { name: '内容营销', value: '20%', percentage: 20, color: '#E6A23C', icon: 'Document' },
  { name: '线下活动', value: '12%', percentage: 12, color: '#F56C6C', icon: 'OfficeBuilding' },
  { name: '合作伙伴', value: '5%', percentage: 5, color: '#8B5CF6', icon: 'Connection' }
])

// ==================== 计算属性 ====================
const filteredCampaignList = computed(() => {
  if (!searchKeyword.value) {
    campaignTotal.value = campaignList.value.length
    return campaignList.value.slice(
      (campaignPage.value - 1) * campaignPageSize.value,
      campaignPage.value * campaignPageSize.value
    )
  }
  const filtered = campaignList.value.filter(item =>
    item.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
    getTypeLabel(item.type).includes(searchKeyword.value)
  )
  campaignTotal.value = filtered.length
  return filtered.slice(
    (campaignPage.value - 1) * campaignPageSize.value,
    campaignPage.value * campaignPageSize.value
  )
})

// ==================== 工具函数 ====================
const getTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    promotion: '促销活动',
    brand: '品牌活动',
    acquisition: '获客活动',
    member: '会员活动',
    holiday: '节日活动'
  }
  return map[type] || type
}

const getTypeTag = (type: string) => {
  const map: Record<string, string> = {
    promotion: 'danger',
    brand: 'primary',
    acquisition: 'success',
    member: 'warning',
    holiday: 'info'
  }
  return map[type] || 'info'
}

const getTypeIcon = (type: string) => {
  const map: Record<string, string> = {
    promotion: '🎉',
    brand: '🏷️',
    acquisition: '📈',
    member: '👑',
    holiday: '🎊'
  }
  return map[type] || '📢'
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    active: '进行中',
    ended: '已结束',
    pending: '待启动',
    cancelled: '已取消'
  }
  return map[status] || status
}

const getStatusTag = (status: string) => {
  const map: Record<string, string> = {
    active: 'success',
    ended: 'info',
    pending: 'warning',
    cancelled: 'danger'
  }
  return map[status] || 'info'
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 0
  }).format(value)
}

// ==================== 方法 ====================
// 刷新数据
const handleRefresh = async () => {
  refreshing.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    dashboardStats.value[0].value = (86 + Math.floor(Math.random() * 10)).toString()
    ElMessage.success('数据已刷新')
    updateLastUpdateTime()
  } catch (error) {
    ElMessage.error('刷新失败，请重试')
  } finally {
    refreshing.value = false
  }
}

const updateLastUpdateTime = () => {
  const now = new Date()
  lastUpdateTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const handleExportReport = () => {
  ElMessageBox.confirm('确认导出完整营销报告？', '导出确认', {
    confirmButtonText: '确认导出',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    ElMessage.success('报告导出成功，文件已保存至下载目录')
  }).catch(() => {})
}

const handlePrint = () => {
  window.print()
}

const handleStatClick = (stat: any) => {
  ElMessage.info(`查看 ${stat.label} 详情`)
  const routeMap: Record<string, string> = {
    total: '/marketing/campaigns',
    exposure: '/marketing/analytics',
    ctr: '/marketing/analytics',
    roi: '/marketing/analytics',
    leads: '/marketing/leads',
    cac: '/marketing/analytics'
  }
  if (routeMap[stat.key]) {
    router.push(routeMap[stat.key])
  }
}

const handleTrendChange = (val: string) => {
  ElMessage.info(`切换到 ${val === 'week' ? '本周' : val === 'month' ? '本月' : val === 'quarter' ? '本季' : '本年'} 趋势`)
}

const handleQuickAction = (action: any) => {
  if (action.route) {
    router.push(action.route)
  } else {
    ElMessage.info(`执行: ${action.label}`)
  }
}

const handleViewAll = () => {
  router.push('/marketing/campaigns')
}

const handleViewCampaign = (row: any) => {
  selectedCampaign.value = row
  showCampaignDialog.value = true
}

const handleEditCampaign = (row: any) => {
  showCampaignDialog.value = false
  router.push(`/marketing/campaigns/${row.id}/edit`)
}

const handleCampaignPageChange = (val: number) => {
  campaignPage.value = val
}

const handleViewAllNotifications = () => {
  ElMessage.info('查看所有待办通知')
  notifications.value.forEach(n => n.read = true)
  pendingCount.value = 0
}

const handleNotificationClick = (notif: any) => {
  notif.read = true
  pendingCount.value = notifications.value.filter(n => !n.read).length
  ElMessage.info(`查看: ${notif.title}`)
}

const handleChannelClick = (channel: any) => {
  ElMessage.info(`查看 ${channel.name} 渠道详情`)
}

const handleViewChannels = () => {
  ElMessage.info('管理营销渠道')
}

// 自动刷新定时器
let refreshTimer: number | null = null

// ==================== 生命周期 ====================
onMounted(() => {
  updateLastUpdateTime()
  refreshTimer = window.setInterval(() => {
    handleRefresh()
  }, 300000)
})

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
})
</script>

<style scoped>
/* ==================== 全局容器 ==================== */
.marketing-dashboard {
  padding: 20px;
  background: #f0f2f5;
  min-height: 100vh;
}

/* ==================== 页面头部 ==================== */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #1a1a2e;
  letter-spacing: 0.5px;
}

.page-subtitle {
  margin: 4px 0 0 0;
  color: #909399;
  font-size: 14px;
}

.header-right {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* ==================== 统计卡片 ==================== */
.stat-row {
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  padding: 16px 20px;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.stat-card::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  transform: translate(30px, -50px);
}

.stat-card .stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  float: left;
  margin-right: 16px;
}

.stat-card .stat-content {
  overflow: hidden;
}

.stat-label {
  color: #909399;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 4px;
}

.stat-value-wrapper {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
}

.stat-trend {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
}

.stat-trend.up {
  color: #67C23A;
  background: rgba(103, 194, 58, 0.12);
}

.stat-trend.down {
  color: #F56C6C;
  background: rgba(245, 108, 108, 0.12);
}

.stat-compare {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}

.stat-card.primary { border-left: 4px solid #409EFF; }
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-card.danger { border-left: 4px solid #F56C6C; }
.stat-card.info { border-left: 4px solid #909399; }

/* ==================== 图表区域 ==================== */
.chart-row {
  margin-bottom: 20px;
}

.chart-card {
  border-radius: 12px;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.card-header span {
  font-weight: 600;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ==================== 趋势图表 ==================== */
.chart-container {
  height: 260px;
  position: relative;
  padding: 10px 0;
}

.trend-chart {
  position: relative;
  width: 100%;
  height: 100%;
}

.chart-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.grid-line {
  position: absolute;
  left: 0;
  right: 0;
  border-top: 1px dashed #e8ecf1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.grid-label {
  font-size: 10px;
  color: #c0c4cc;
  padding-right: 8px;
  background: white;
  transform: translateY(-50%);
}

.chart-bars {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  padding: 0 4px;
}

.bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  height: 100%;
  justify-content: flex-end;
  gap: 4px;
}

.bar-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 90%;
  width: 100%;
  justify-content: center;
}

.bar {
  width: 18px;
  border-radius: 3px 3px 0 0;
  position: relative;
  min-height: 4px;
  transition: all 0.5s ease;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.bar-reach {
  background: linear-gradient(180deg, #409EFF, #66b1ff);
}

.bar-conversion {
  background: linear-gradient(180deg, #E6A23C, #ebb563);
}

.bar-value {
  font-size: 8px;
  color: white;
  padding-top: 2px;
  font-weight: 600;
}

.bar-label {
  font-size: 10px;
  color: #909399;
  text-align: center;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
  margin-top: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #606266;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.reach-dot { background: #409EFF; }
.conversion-dot { background: #E6A23C; }
.roi-dot { background: #67C23A; }

/* ==================== 快捷操作 ==================== */
.quick-actions-card {
  border-radius: 12px;
  height: 100%;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.quick-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
  border-radius: 10px;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.quick-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  background: #f0f2f5;
}

.action-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 8px;
}

.action-label {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
}

.action-desc {
  font-size: 11px;
  color: #909399;
  margin-top: 2px;
}

/* ==================== 活动列表 ==================== */
.list-row {
  margin-bottom: 20px;
}

.campaign-list-card {
  border-radius: 12px;
}

.campaign-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.name-icon {
  font-size: 16px;
}

.name-text {
  font-weight: 500;
}

.table-footer {
  padding-top: 16px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #ebeef5;
  margin-top: 12px;
}

/* ==================== 通知列表 ==================== */
.notification-card {
  border-radius: 12px;
  height: 100%;
}

.notification-list {
  max-height: 360px;
  overflow-y: auto;
}

.notification-list::-webkit-scrollbar {
  width: 4px;
}

.notification-list::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 2px;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f2f5;
  cursor: pointer;
  transition: background 0.2s ease;
  position: relative;
}

.notification-item:hover {
  background: #f8f9fa;
  margin: 0 -16px;
  padding-left: 16px;
  padding-right: 16px;
}

.notif-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
}

.notif-icon.warning { background: #E6A23C; }
.notif-icon.danger { background: #F56C6C; }
.notif-icon.info { background: #409EFF; }
.notif-icon.success { background: #67C23A; }

.notif-content {
  flex: 1;
  min-width: 0;
}

.notif-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.notif-desc {
  font-size: 13px;
  color: #606266;
  margin-top: 2px;
}

.notif-time {
  font-size: 11px;
  color: #c0c4cc;
  margin-top: 4px;
}

.notif-badge {
  flex-shrink: 0;
  padding-top: 4px;
}

.notification-footer {
  padding-top: 12px;
  text-align: center;
  border-top: 1px solid #ebeef5;
}

/* ==================== 渠道分布 ==================== */
.channel-card {
  border-radius: 12px;
}

.channel-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 8px;
}

.channel-item:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  background: #f0f2f5;
}

.channel-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.channel-info {
  flex: 1;
  min-width: 0;
}

.channel-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.channel-count {
  font-size: 12px;
  color: #909399;
}

.channel-progress {
  margin-top: 2px;
}

/* ==================== 底部 ==================== */
.dashboard-footer {
  margin-top: 24px;
  padding: 16px 20px;
  background: white;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #909399;
  flex-wrap: wrap;
  gap: 8px;
}

/* ==================== 响应式适配 ==================== */
@media (max-width: 768px) {
  .marketing-dashboard {
    padding: 12px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-right {
    width: 100%;
  }

  .header-right .el-button-group {
    width: 100%;
    display: flex;
  }

  .header-right .el-button-group .el-button {
    flex: 1;
  }

  .quick-actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stat-card .stat-value {
    font-size: 20px;
  }

  .chart-container {
    height: 200px;
  }

  .bar {
    width: 12px;
  }
}

@media (max-width: 480px) {
  .quick-actions-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .quick-action {
    padding: 12px 4px;
  }

  .action-icon {
    width: 36px;
    height: 36px;
  }

  .action-label {
    font-size: 12px;
  }

  .stat-card {
    padding: 12px 16px;
  }

  .stat-card .stat-icon {
    width: 40px;
    height: 40px;
  }

  .stat-value {
    font-size: 18px;
  }
}

/* ==================== 打印样式 ==================== */
@media print {
  .marketing-dashboard {
    background: white;
    padding: 16px;
  }

  .stat-card:hover {
    transform: none !important;
  }

  .quick-action:hover {
    transform: none !important;
  }

  .header-right .el-button,
  .quick-actions-card,
  .notification-card .el-button {
    display: none !important;
  }

  .dashboard-footer {
    border-top: 1px solid #dcdfe6;
  }
}
</style>