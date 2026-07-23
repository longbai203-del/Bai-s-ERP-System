<!--
  文件路径: frontend/src/modules/inventory/pages/Index.vue
  功能: 库存仪表盘 - 库存总览与控制面板
  包含: 统计卡片、库存趋势图、分类分布、库存列表、预警通知、快捷操作
-->

<template>
  <div class="inventory-dashboard">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">📦 库存仪表盘</h1>
        <p class="page-subtitle">实时库存数据总览与智能分析</p>
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

    <!-- 统计卡片 -->
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

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :lg="16">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span><el-icon><TrendCharts /></el-icon> 库存趋势分析</span>
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
                    <div class="bar bar-in" :style="{ height: item.inPercent + '%' }">
                      <span class="bar-value">{{ item.in }}</span>
                    </div>
                    <div class="bar bar-out" :style="{ height: item.outPercent + '%' }">
                      <span class="bar-value">{{ item.out }}</span>
                    </div>
                  </div>
                  <div class="bar-label">{{ item.label }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="chart-legend">
            <span class="legend-item"><span class="legend-dot in-dot"></span>入库</span>
            <span class="legend-item"><span class="legend-dot out-dot"></span>出库</span>
            <span class="legend-item"><span class="legend-dot net-dot"></span>净变化</span>
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

    <!-- 库存列表和预警区域 -->
    <el-row :gutter="20" class="list-row">
      <el-col :xs="24" :lg="16">
        <el-card class="inventory-list-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span><el-icon><List /></el-icon> 库存列表</span>
              <div class="header-actions">
                <el-input v-model="searchKeyword" placeholder="搜索产品..." size="small" style="width: 180px" clearable>
                  <template #prefix><el-icon><Search /></el-icon></template>
                </el-input>
                <el-button size="small" type="primary" @click="handleViewAll">查看全部</el-button>
              </div>
            </div>
          </template>
          <el-table :data="filteredInventoryList" style="width: 100%" stripe max-height="400">
            <el-table-column prop="sku" label="SKU" width="120" />
            <el-table-column prop="product" label="产品名称" min-width="150">
              <template #default="{ row }">
                <div class="product-name">
                  <span class="name-text">{{ row.product }}</span>
                  <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
                    {{ row.status === 'active' ? '正常' : '停用' }}
                  </el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="category" label="分类" width="100" />
            <el-table-column prop="quantity" label="库存" width="100" align="center">
              <template #default="{ row }">
                <el-tag :type="row.quantity < row.safetyStock ? 'danger' : row.quantity < row.safetyStock * 2 ? 'warning' : 'success'" size="small">
                  {{ row.quantity }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="单价" width="120" align="right">
              <template #default="{ row }">{{ formatCurrency(row.price) }}</template>
            </el-table-column>
            <el-table-column prop="warehouse" label="仓库" width="100" />
            <el-table-column label="操作" width="100" align="center" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" size="small" link @click="handleViewProduct(row)">
                  查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="table-footer">
            <el-pagination
              v-model:current-page="inventoryPage"
              v-model:page-size="inventoryPageSize"
              :total="inventoryTotal"
              :page-sizes="[5, 10, 20]"
              size="small"
              layout="total, prev, pager, next"
              @current-change="handleInventoryPageChange"
            />
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="8">
        <el-card class="alert-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span><el-icon><Warning /></el-icon> 库存预警</span>
              <el-badge :value="alertCount" :hidden="alertCount === 0" type="danger">
                <el-button size="small" @click="handleViewAllAlerts">全部</el-button>
              </el-badge>
            </div>
          </template>
          <div class="alert-list">
            <div class="alert-item" v-for="(alert, index) in alerts" :key="index" @click="handleAlertClick(alert)">
              <div class="alert-icon" :class="alert.level">
                <el-icon><component :is="alert.icon" /></el-icon>
              </div>
              <div class="alert-content">
                <div class="alert-title">{{ alert.product }}</div>
                <div class="alert-desc">{{ alert.desc }}</div>
                <div class="alert-time">{{ alert.time }}</div>
              </div>
              <div class="alert-badge" v-if="!alert.read">
                <el-badge value="新" type="danger" />
              </div>
            </div>
          </div>
          <div class="alert-footer">
            <el-button type="primary" link @click="handleViewAllAlerts">查看所有预警 →</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 分类分布 -->
    <el-card class="category-card" shadow="hover" style="margin-top: 20px;">
      <template #header>
        <div class="card-header">
          <span><el-icon><Grid /></el-icon> 库存分类分布</span>
          <el-button size="small" @click="handleViewCategories">管理分类</el-button>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" :lg="4" v-for="cat in categoryStats" :key="cat.name">
          <div class="category-item" @click="handleCategoryClick(cat)">
            <div class="cat-icon" :style="{ background: cat.color }">
              <el-icon :size="20"><component :is="cat.icon" /></el-icon>
            </div>
            <div class="cat-info">
              <div class="cat-name">{{ cat.name }}</div>
              <div class="cat-count">{{ cat.count }} 件</div>
              <div class="cat-progress">
                <el-progress :percentage="cat.percentage" :color="cat.color" :stroke-width="6" />
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 底部版权 -->
    <div class="dashboard-footer">
      <span>© {{ currentYear }} 库存管理系统 v3.0 - 数据实时更新</span>
      <span>最后更新: {{ lastUpdateTime }}</span>
    </div>

    <!-- 产品详情对话框 -->
    <el-dialog v-model="showProductDialog" title="产品详情" width="600px" destroy-on-close>
      <div v-if="selectedProduct" class="product-dialog-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="SKU">{{ selectedProduct.sku }}</el-descriptions-item>
          <el-descriptions-item label="产品名称">{{ selectedProduct.product }}</el-descriptions-item>
          <el-descriptions-item label="分类">{{ selectedProduct.category }}</el-descriptions-item>
          <el-descriptions-item label="仓库">{{ selectedProduct.warehouse }}</el-descriptions-item>
          <el-descriptions-item label="库存数量">
            <span :style="{ color: selectedProduct.quantity < (selectedProduct.safetyStock || 50) ? '#F56C6C' : '#303133', fontWeight: 700 }">
              {{ selectedProduct.quantity }}
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="安全库存">{{ selectedProduct.safetyStock || 50 }}</el-descriptions-item>
          <el-descriptions-item label="单价">{{ formatCurrency(selectedProduct.price) }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="selectedProduct.status === 'active' ? 'success' : 'info'">
              {{ selectedProduct.status === 'active' ? '正常' : '停用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="最后更新" :span="2">{{ selectedProduct.lastUpdated || '2026-07-22 10:30' }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="showProductDialog = false">关闭</el-button>
        <el-button type="primary" @click="handleEditProduct(selectedProduct)">编辑库存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Refresh, Download, Printer, TrendCharts, Odometer, List, Search,
  Warning, Grid, CaretTop, CaretBottom, Setting, Document, Money,
  UserFilled, Plus, Edit, Delete, View, Calendar, Clock, Check,
  Close, CircleCheck, CircleClose, DataLine, PieChart, Promotion,
  Files, Tickets, HomeFilled, OfficeBuilding, Briefcase, Location,
  Phone, Message, ArrowRight, ArrowLeft, ShoppingCart, Box,
  Goods, Collection, Tickets as TicketIcon, Monitor, Upload,
  Download as DownloadIcon, Sort, Filter, RefreshRight
} from '@element-plus/icons-vue'

// ==================== Router ====================
const router = useRouter()

// ==================== 状态变量 ====================
const refreshing = ref(false)
const searchKeyword = ref('')
const trendPeriod = ref('month')
const inventoryPage = ref(1)
const inventoryPageSize = ref(5)
const inventoryTotal = ref(0)
const alertCount = ref(12)
const showProductDialog = ref(false)
const selectedProduct = ref<any>(null)
const lastUpdateTime = ref('')
const currentYear = new Date().getFullYear()
const trendChartRef = ref(null)

// ==================== 仪表盘统计数据 ====================
const dashboardStats = ref([
  {
    label: '库存总数',
    value: '285,600',
    change: 3.2,
    trend: 'up',
    compare: '增加 8,850 件',
    type: 'primary',
    icon: 'Box',
    iconBg: 'linear-gradient(135deg, #409EFF, #66b1ff)',
    key: 'total'
  },
  {
    label: '库存金额',
    value: 'SAR 8.56M',
    change: 5.8,
    trend: 'up',
    compare: '增加 468K SAR',
    type: 'success',
    icon: 'Money',
    iconBg: 'linear-gradient(135deg, #67C23A, #85ce61)',
    key: 'amount'
  },
  {
    label: 'SKU总数',
    value: '1,286',
    change: 2.1,
    trend: 'up',
    compare: '增加 26 个',
    type: 'warning',
    icon: 'Collection',
    iconBg: 'linear-gradient(135deg, #E6A23C, #ebb563)',
    key: 'sku'
  },
  {
    label: '库存预警',
    value: '45',
    change: -8.5,
    trend: 'down',
    compare: '减少 4 个',
    type: 'danger',
    icon: 'Warning',
    iconBg: 'linear-gradient(135deg, #F56C6C, #f78989)',
    key: 'alert'
  },
  {
    label: '库存周转率',
    value: '8.6',
    change: 2.3,
    trend: 'up',
    compare: '增加 0.8 次',
    type: 'primary',
    icon: 'Refresh',
    iconBg: 'linear-gradient(135deg, #409EFF, #66b1ff)',
    key: 'turnover'
  },
  {
    label: '呆滞库存',
    value: '86',
    change: -12.5,
    trend: 'down',
    compare: '减少 12 件',
    type: 'info',
    icon: 'Clock',
    iconBg: 'linear-gradient(135deg, #909399, #b1b3b8)',
    key: 'deadstock'
  }
])

// ==================== 趋势数据 ====================
const trendData = ref([
  { label: '1月', in: 1200, out: 980, inPercent: 60, outPercent: 49 },
  { label: '2月', in: 1350, out: 1020, inPercent: 68, outPercent: 51 },
  { label: '3月', in: 1500, out: 1100, inPercent: 75, outPercent: 55 },
  { label: '4月', in: 1280, out: 1150, inPercent: 64, outPercent: 58 },
  { label: '5月', in: 1600, out: 1200, inPercent: 80, outPercent: 60 },
  { label: '6月', in: 1400, out: 1180, inPercent: 70, outPercent: 59 },
  { label: '7月', in: 1550, out: 1050, inPercent: 78, outPercent: 53 },
  { label: '8月', in: 1700, out: 1300, inPercent: 85, outPercent: 65 },
  { label: '9月', in: 1450, out: 1250, inPercent: 73, outPercent: 63 },
  { label: '10月', in: 1650, out: 1100, inPercent: 83, outPercent: 55 },
  { label: '11月', in: 1800, out: 1400, inPercent: 90, outPercent: 70 },
  { label: '12月', in: 1900, out: 1500, inPercent: 95, outPercent: 75 }
])

// ==================== 快捷操作 ====================
const quickActions = ref([
  { label: '入库登记', icon: 'Upload', color: '#409EFF', desc: '产品入库', route: '/inventory/stock-in' },
  { label: '出库登记', icon: 'Download', color: '#67C23A', desc: '产品出库', route: '/inventory/stock-out' },
  { label: '库存盘点', icon: 'Search', color: '#E6A23C', desc: '创建盘点计划', route: '/inventory/count' },
  { label: '调拨管理', icon: 'Refresh', color: '#F56C6C', desc: '仓库间调拨', route: '/inventory/transfer' },
  { label: '库存预警', icon: 'Warning', color: '#8B5CF6', desc: '查看预警信息', route: '/inventory/alerts' },
  { label: '批次管理', icon: 'Files', color: '#3B82F6', desc: '管理产品批次', route: '/inventory/batch' },
  { label: '序列号管理', icon: 'Tickets', color: '#F59E0B', desc: '序列号追踪', route: '/inventory/serial' },
  { label: '安全库存', icon: 'Setting', color: '#10B981', desc: '设置安全库存', route: '/inventory/safety' }
])

// ==================== 库存列表数据 ====================
const inventoryList = ref([
  {
    id: 1,
    sku: 'IPH-15-PM-256',
    product: 'iPhone 15 Pro Max 256GB',
    category: '电子产品',
    quantity: 156,
    safetyStock: 50,
    price: 5299,
    warehouse: '利雅得仓库',
    status: 'active',
    lastUpdated: '2026-07-22 10:30'
  },
  {
    id: 2,
    sku: 'SGS-S24-U-512',
    product: '三星 Galaxy S24 Ultra',
    category: '电子产品',
    quantity: 89,
    safetyStock: 40,
    price: 4599,
    warehouse: '利雅得仓库',
    status: 'active',
    lastUpdated: '2026-07-22 10:25'
  },
  {
    id: 3,
    sku: 'MBP-16-M3-512',
    product: 'MacBook Pro 16" M3',
    category: '电子产品',
    quantity: 34,
    safetyStock: 30,
    price: 12999,
    warehouse: '吉达仓库',
    status: 'active',
    lastUpdated: '2026-07-22 10:20'
  },
  {
    id: 4,
    sku: 'IPP-129-M2-256',
    product: 'iPad Pro 12.9" M2',
    category: '电子产品',
    quantity: 12,
    safetyStock: 25,
    price: 5499,
    warehouse: '利雅得仓库',
    status: 'active',
    lastUpdated: '2026-07-22 10:15'
  },
  {
    id: 5,
    sku: 'APP-2-WH',
    product: 'AirPods Pro 2',
    category: '电子产品',
    quantity: 8,
    safetyStock: 30,
    price: 1899,
    warehouse: '达曼仓库',
    status: 'active',
    lastUpdated: '2026-07-22 10:10'
  },
  {
    id: 6,
    sku: 'AWU-2-49',
    product: 'Apple Watch Ultra 2',
    category: '电子产品',
    quantity: 18,
    safetyStock: 20,
    price: 3499,
    warehouse: '吉达仓库',
    status: 'active',
    lastUpdated: '2026-07-22 10:05'
  },
  {
    id: 7,
    sku: 'SWT-001-BLK',
    product: '黑色运动鞋',
    category: '服装鞋帽',
    quantity: 200,
    safetyStock: 80,
    price: 299,
    warehouse: '利雅得仓库',
    status: 'active',
    lastUpdated: '2026-07-22 10:00'
  },
  {
    id: 8,
    sku: 'JKT-001-M',
    product: '防风夹克 M码',
    category: '服装鞋帽',
    quantity: 45,
    safetyStock: 30,
    price: 459,
    warehouse: '达曼仓库',
    status: 'inactive',
    lastUpdated: '2026-07-21 16:30'
  }
])

// ==================== 预警数据 ====================
const alerts = ref([
  {
    product: 'AirPods Pro 2',
    desc: '库存低于安全库存，当前8件，安全库存30件',
    time: '5分钟前',
    level: 'critical',
    icon: 'Warning',
    read: false
  },
  {
    product: 'iPad Pro 12.9"',
    desc: '库存低于安全库存，当前12件，安全库存25件',
    time: '15分钟前',
    level: 'critical',
    icon: 'Warning',
    read: false
  },
  {
    product: 'Apple Watch Ultra 2',
    desc: '库存接近安全库存，当前18件，安全库存20件',
    time: '1小时前',
    level: 'warning',
    icon: 'Bell',
    read: false
  },
  {
    product: 'iPhone 15 Pro Max',
    desc: '库存充足，当前156件，安全库存50件',
    time: '2小时前',
    level: 'info',
    icon: 'Check',
    read: true
  },
  {
    product: 'MacBook Pro 16"',
    desc: '库存正常，当前34件，安全库存30件',
    time: '3小时前',
    level: 'info',
    icon: 'Check',
    read: true
  }
])

// ==================== 分类统计 ====================
const categoryStats = ref([
  { name: '电子产品', count: 586, percentage: 45.6, color: '#409EFF', icon: 'Monitor' },
  { name: '服装鞋帽', count: 320, percentage: 24.9, color: '#67C23A', icon: 'Goods' },
  { name: '食品饮料', count: 180, percentage: 14.0, color: '#E6A23C', icon: 'Food' },
  { name: '家居用品', count: 120, percentage: 9.3, color: '#F56C6C', icon: 'HomeFilled' },
  { name: '美妆护肤', count: 50, percentage: 3.9, color: '#8B5CF6', icon: 'Collection' },
  { name: '运动户外', count: 30, percentage: 2.3, color: '#3B82F6', icon: 'Medal' }
])

// ==================== 计算属性 ====================
const filteredInventoryList = computed(() => {
  if (!searchKeyword.value) {
    inventoryTotal.value = inventoryList.value.length
    return inventoryList.value.slice(
      (inventoryPage.value - 1) * inventoryPageSize.value,
      inventoryPage.value * inventoryPageSize.value
    )
  }
  const filtered = inventoryList.value.filter(item =>
    item.product.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
    item.category.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
  inventoryTotal.value = filtered.length
  return filtered.slice(
    (inventoryPage.value - 1) * inventoryPageSize.value,
    inventoryPage.value * inventoryPageSize.value
  )
})

// ==================== 方法 ====================
// 格式化货币
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 0
  }).format(value)
}

// 刷新数据
const handleRefresh = async () => {
  refreshing.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    dashboardStats.value[0].value = (285600 + Math.floor(Math.random() * 2000)).toLocaleString()
    ElMessage.success('数据已刷新')
    updateLastUpdateTime()
  } catch (error) {
    ElMessage.error('刷新失败，请重试')
  } finally {
    refreshing.value = false
  }
}

// 更新最后更新时间
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

// 导出报告
const handleExportReport = () => {
  ElMessageBox.confirm('确认导出完整库存报告？', '导出确认', {
    confirmButtonText: '确认导出',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    ElMessage.success('报告导出成功，文件已保存至下载目录')
  }).catch(() => {})
}

// 打印
const handlePrint = () => {
  window.print()
}

// 统计卡片点击
const handleStatClick = (stat: any) => {
  ElMessage.info(`查看 ${stat.label} 详情`)
  const routeMap: Record<string, string> = {
    total: '/inventory/query',
    amount: '/inventory/query',
    sku: '/inventory/query',
    alert: '/inventory/alerts',
    turnover: '/inventory/analysis',
    deadstock: '/inventory/dead-stock'
  }
  if (routeMap[stat.key]) {
    router.push(routeMap[stat.key])
  }
}

// 趋势周期切换
const handleTrendChange = (val: string) => {
  ElMessage.info(`切换到 ${val === 'week' ? '本周' : val === 'month' ? '本月' : val === 'quarter' ? '本季' : '本年'} 趋势`)
}

// 快捷操作点击
const handleQuickAction = (action: any) => {
  if (action.route) {
    router.push(action.route)
  } else {
    ElMessage.info(`执行: ${action.label}`)
  }
}

// 查看所有库存
const handleViewAll = () => {
  router.push('/inventory/query')
}

// 查看产品详情
const handleViewProduct = (row: any) => {
  selectedProduct.value = row
  showProductDialog.value = true
}

// 编辑产品
const handleEditProduct = (row: any) => {
  showProductDialog.value = false
  router.push(`/inventory/edit/${row.id}`)
}

// 库存分页
const handleInventoryPageChange = (val: number) => {
  inventoryPage.value = val
}

// 查看所有预警
const handleViewAllAlerts = () => {
  ElMessage.info('查看所有库存预警')
  alerts.value.forEach(a => a.read = true)
  alertCount.value = 0
  router.push('/inventory/alerts')
}

// 预警点击
const handleAlertClick = (alert: any) => {
  alert.read = true
  alertCount.value = alerts.value.filter(a => !a.read).length
  ElMessage.info(`查看: ${alert.product}`)
}

// 分类点击
const handleCategoryClick = (cat: any) => {
  ElMessage.info(`查看 ${cat.name} 分类详情`)
}

// 管理分类
const handleViewCategories = () => {
  ElMessage.info('管理产品分类')
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
.inventory-dashboard {
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

.bar-in {
  background: linear-gradient(180deg, #409EFF, #66b1ff);
}

.bar-out {
  background: linear-gradient(180deg, #F56C6C, #f78989);
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

.in-dot { background: #409EFF; }
.out-dot { background: #F56C6C; }
.net-dot { background: #67C23A; }

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

/* ==================== 库存列表 ==================== */
.list-row {
  margin-bottom: 20px;
}

.inventory-list-card {
  border-radius: 12px;
}

.product-name {
  display: flex;
  align-items: center;
  gap: 8px;
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

/* ==================== 预警列表 ==================== */
.alert-card {
  border-radius: 12px;
  height: 100%;
}

.alert-list {
  max-height: 360px;
  overflow-y: auto;
}

.alert-list::-webkit-scrollbar {
  width: 4px;
}

.alert-list::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 2px;
}

.alert-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f2f5;
  cursor: pointer;
  transition: background 0.2s ease;
  position: relative;
}

.alert-item:hover {
  background: #f8f9fa;
  margin: 0 -16px;
  padding-left: 16px;
  padding-right: 16px;
}

.alert-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
}

.alert-icon.critical { background: #F56C6C; }
.alert-icon.warning { background: #E6A23C; }
.alert-icon.info { background: #409EFF; }

.alert-content {
  flex: 1;
  min-width: 0;
}

.alert-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.alert-desc {
  font-size: 13px;
  color: #606266;
  margin-top: 2px;
}

.alert-time {
  font-size: 11px;
  color: #c0c4cc;
  margin-top: 4px;
}

.alert-badge {
  flex-shrink: 0;
  padding-top: 4px;
}

.alert-footer {
  padding-top: 12px;
  text-align: center;
  border-top: 1px solid #ebeef5;
}

/* ==================== 分类分布 ==================== */
.category-card {
  border-radius: 12px;
}

.category-item {
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

.category-item:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  background: #f0f2f5;
}

.cat-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.cat-info {
  flex: 1;
  min-width: 0;
}

.cat-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.cat-count {
  font-size: 12px;
  color: #909399;
}

.cat-progress {
  margin-top: 2px;
}

/* ==================== 产品对话框 ==================== */
.product-dialog-content {
  padding: 8px 0;
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
  .inventory-dashboard {
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
  .inventory-dashboard {
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
  .alert-card .el-button {
    display: none !important;
  }

  .dashboard-footer {
    border-top: 1px solid #dcdfe6;
  }
}
</style>