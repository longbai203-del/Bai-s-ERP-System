<!--
  文件路径: frontend/src/modules/inventory/pages/Detail.vue
  功能: 库存详情 - 查看完整的库存产品信息
  包含: 产品概览、库存信息、批次信息、序列号、出入库记录、操作日志
-->

<template>
  <div class="inventory-detail-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="handleBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon> 返回
        </el-button>
        <div class="header-info">
          <h1 class="page-title">📦 库存详情</h1>
          <p class="page-subtitle">查看完整的产品库存信息</p>
        </div>
      </div>
      <div class="header-right">
        <el-button type="warning" @click="handleEdit">
          <el-icon><Edit /></el-icon> 编辑
        </el-button>
        <el-button type="danger" @click="handleDelete">
          <el-icon><Delete /></el-icon> 删除
        </el-button>
        <el-button type="primary" @click="handleExport">
          <el-icon><Download /></el-icon> 导出PDF
        </el-button>
        <el-button @click="handlePrint">
          <el-icon><Printer /></el-icon> 打印
        </el-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>

    <template v-else>
      <!-- 产品概览卡片 -->
      <el-card class="product-overview-card" shadow="hover">
        <div class="overview-header">
          <div class="overview-info">
            <div class="product-name-wrapper">
              <h2 class="product-name">{{ productData.product }}</h2>
              <el-tag :type="productData.status === 'active' ? 'success' : 'info'" size="large" effect="dark">
                {{ productData.status === 'active' ? '正常' : '停用' }}
              </el-tag>
            </div>
            <div class="product-tags">
              <el-tag type="primary" size="large">{{ productData.sku }}</el-tag>
              <el-tag type="success" size="large">{{ productData.category }}</el-tag>
              <el-tag type="warning" size="large">{{ productData.brand || '无品牌' }}</el-tag>
              <el-tag type="info" size="large" v-if="productData.unit">{{ productData.unit }}</el-tag>
            </div>
            <div class="product-meta">
              <span><el-icon><Box /></el-icon> 库存: {{ productData.quantity }} {{ productData.unit }}</span>
              <span><el-icon><Money /></el-icon> 单价: {{ formatCurrency(productData.price) }}</span>
              <span><el-icon><Location /></el-icon> {{ productData.warehouse }}</span>
              <span><el-icon><Calendar /></el-icon> 最后更新: {{ productData.lastUpdated }}</span>
            </div>
          </div>
          <div class="overview-actions">
            <el-button type="primary" @click="handleStockIn">
              <el-icon><Upload /></el-icon> 入库
            </el-button>
            <el-button type="warning" @click="handleStockOut">
              <el-icon><Download /></el-icon> 出库
            </el-button>
            <el-dropdown @command="handleMoreAction">
              <el-button>
                更多 <el-icon><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="adjust">库存调整</el-dropdown-item>
                  <el-dropdown-item command="transfer">调拨</el-dropdown-item>
                  <el-dropdown-item command="count">盘点</el-dropdown-item>
                  <el-dropdown-item command="freeze" divided>冻结</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-card>

      <!-- 统计卡片 -->
      <el-row :gutter="20" class="stat-row">
        <el-col :xs="12" :sm="6" v-for="stat in detailStats" :key="stat.label">
          <el-card class="stat-card" :class="stat.type" shadow="hover">
            <div class="stat-label">{{ stat.label }}</div>
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-unit">{{ stat.unit }}</div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 详细信息标签页 -->
      <el-card class="detail-card" shadow="hover">
        <el-tabs v-model="activeTab" class="detail-tabs">
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="basic">
            <el-descriptions :column="3" border>
              <el-descriptions-item label="产品名称">{{ productData.product }}</el-descriptions-item>
              <el-descriptions-item label="SKU编码">{{ productData.sku }}</el-descriptions-item>
              <el-descriptions-item label="产品分类">{{ productData.category }}</el-descriptions-item>
              <el-descriptions-item label="品牌">{{ productData.brand || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="型号">{{ productData.model || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="规格">{{ productData.specification || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="单位">{{ productData.unit }}</el-descriptions-item>
              <el-descriptions-item label="单价">{{ formatCurrency(productData.price) }}</el-descriptions-item>
              <el-descriptions-item label="成本价">{{ formatCurrency(productData.cost) }}</el-descriptions-item>
              <el-descriptions-item label="产品描述" :span="3">{{ productData.description || '无描述' }}</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>

          <!-- 库存信息 -->
          <el-tab-pane label="库存信息" name="stock">
            <el-descriptions :column="3" border>
              <el-descriptions-item label="当前库存">{{ productData.quantity }} {{ productData.unit }}</el-descriptions-item>
              <el-descriptions-item label="安全库存">{{ productData.safetyStock || 50 }}</el-descriptions-item>
              <el-descriptions-item label="最大库存">{{ productData.maxStock || 200 }}</el-descriptions-item>
              <el-descriptions-item label="仓库">{{ productData.warehouse }}</el-descriptions-item>
              <el-descriptions-item label="货位">{{ productData.location || '未分配' }}</el-descriptions-item>
              <el-descriptions-item label="库存状态">
                <el-tag :type="getStockStatusType(productData.quantity, productData.safetyStock)">
                  {{ getStockStatusLabel(productData.quantity, productData.safetyStock) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="库存金额">{{ formatCurrency(productData.quantity * productData.price) }}</el-descriptions-item>
              <el-descriptions-item label="库存周转率">{{ productData.turnover || '8.6' }} 次/年</el-descriptions-item>
              <el-descriptions-item label="库存天数">{{ productData.daysInStock || '42' }} 天</el-descriptions-item>
              <el-descriptions-item label="入库日期" :span="3">{{ productData.stockDate || '未记录' }}</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>

          <!-- 批次信息 -->
          <el-tab-pane label="批次信息" name="batch">
            <div v-if="productData.batches && productData.batches.length > 0">
              <el-table :data="productData.batches" border style="width: 100%">
                <el-table-column prop="batchNo" label="批次号" width="160" />
                <el-table-column prop="quantity" label="数量" align="center" width="100" />
                <el-table-column prop="productionDate" label="生产日期" width="120" />
                <el-table-column prop="expiryDate" label="有效期至" width="120">
                  <template #default="{ row }">
                    <span :style="{ color: isExpiring(row.expiryDate) ? '#F56C6C' : '#303133' }">
                      {{ row.expiryDate }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="状态" align="center" width="100">
                  <template #default="{ row }">
                    <el-tag :type="getBatchStatusType(row.expiryDate)">
                      {{ getBatchStatusLabel(row.expiryDate) }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="剩余天数" align="center" width="100">
                  <template #default="{ row }">
                    <el-tag :type="getDaysRemainingType(row.expiryDate)">
                      {{ getDaysRemaining(row.expiryDate) }}
                    </el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-empty v-else description="暂无批次信息" />
          </el-tab-pane>

          <!-- 序列号 -->
          <el-tab-pane label="序列号" name="serial">
            <div class="serial-summary">
              <el-row :gutter="16" class="serial-stats">
                <el-col :span="6">
                  <div class="serial-stat">
                    <div class="serial-stat-value">{{ productData.serialNumbers?.length || 0 }}</div>
                    <div class="serial-stat-label">总序列号</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="serial-stat">
                    <div class="serial-stat-value" style="color: #67C23A;">{{ getSerialStatusCount('在库') }}</div>
                    <div class="serial-stat-label">在库</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="serial-stat">
                    <div class="serial-stat-value" style="color: #409EFF;">{{ getSerialStatusCount('已售') }}</div>
                    <div class="serial-stat-label">已售</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="serial-stat">
                    <div class="serial-stat-value" style="color: #E6A23C;">{{ getSerialStatusCount('维修中') }}</div>
                    <div class="serial-stat-label">维修中</div>
                  </div>
                </el-col>
              </el-row>
            </div>
            <el-table :data="productData.serialNumbers || []" border style="width: 100%">
              <el-table-column prop="serialNo" label="序列号" width="180" />
              <el-table-column prop="status" label="状态" width="120" align="center">
                <template #default="{ row }">
                  <el-tag :type="row.status === '在库' ? 'success' : row.status === '已售' ? 'info' : row.status === '维修中' ? 'warning' : 'danger'">
                    {{ row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="batchNo" label="批次号" width="140" />
              <el-table-column prop="location" label="位置" width="100" />
              <el-table-column prop="updatedAt" label="最后更新" width="160" />
            </el-table>
          </el-tab-pane>

          <!-- 出入库记录 -->
          <el-tab-pane label="出入库记录" name="transactions">
            <el-table :data="transactionRecords" border style="width: 100%">
              <el-table-column prop="id" label="单据号" width="140" />
              <el-table-column prop="type" label="类型" width="100" align="center">
                <template #default="{ row }">
                  <el-tag :type="row.type === '入库' ? 'success' : 'danger'">
                    {{ row.type }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="quantity" label="数量" width="100" align="center">
                <template #default="{ row }">
                  <span :style="{ color: row.type === '入库' ? '#67C23A' : '#F56C6C', fontWeight: 600 }">
                    {{ row.type === '入库' ? '+' : '-' }}{{ row.quantity }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="beforeQty" label="变动前" width="100" align="center" />
              <el-table-column prop="afterQty" label="变动后" width="100" align="center" />
              <el-table-column prop="reference" label="参考单据" width="140" />
              <el-table-column prop="operator" label="操作人" width="100" />
              <el-table-column prop="createdAt" label="操作时间" width="160" />
            </el-table>
            <div class="table-footer">
              <el-pagination
                v-model:current-page="transactionPage"
                v-model:page-size="transactionPageSize"
                :total="transactionTotal"
                size="small"
                layout="total, prev, pager, next"
              />
            </div>
          </el-tab-pane>

          <!-- 操作日志 -->
          <el-tab-pane label="操作日志" name="logs">
            <el-timeline v-if="operationLogs.length > 0">
              <el-timeline-item
                v-for="(log, index) in operationLogs"
                :key="index"
                :timestamp="log.time"
                :type="log.type"
                size="large"
              >
                <div class="log-content">
                  <span class="log-user">{{ log.user }}</span>
                  <span class="log-action">{{ log.action }}</span>
                  <span class="log-detail">{{ log.detail }}</span>
                </div>
              </el-timeline-item>
            </el-timeline>
            <el-empty v-else description="暂无操作日志" :image-size="60" />
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <!-- 相关产品 -->
      <el-card class="related-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span><el-icon><Grid /></el-icon> 相关产品</span>
            <el-button size="small" @click="handleViewRelated">查看更多</el-button>
          </div>
        </template>
        <el-row :gutter="16">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="(item, index) in relatedProducts" :key="index">
            <div class="related-item" @click="handleRelatedClick(item)">
              <div class="related-name">{{ item.product }}</div>
              <div class="related-sku">{{ item.sku }}</div>
              <div class="related-stock">
                库存: <span :style="{ color: item.quantity < 50 ? '#F56C6C' : '#303133' }">{{ item.quantity }}</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </template>

    <!-- 删除确认对话框 -->
    <el-dialog v-model="showDeleteDialog" title="⚠️ 确认删除" width="440px">
      <div class="delete-content">
        <el-icon class="delete-icon" :size="48"><WarningFilled /></el-icon>
        <p>您确定要删除产品 <strong>{{ productData.product }}</strong> 的全部库存记录吗？</p>
        <p class="delete-warning">此操作不可恢复，将删除所有相关数据</p>
        <el-input
          v-model="deleteConfirmText"
          placeholder="请输入产品名称以确认删除"
          style="margin-top: 12px"
        />
      </div>
      <template #footer>
        <el-button @click="showDeleteDialog = false">取消</el-button>
        <el-button
          type="danger"
          :disabled="deleteConfirmText !== productData.product"
          @click="confirmDelete"
        >
          确认删除
        </el-button>
      </template>
    </el-dialog>

    <!-- 入库/出库对话框 -->
    <el-dialog
      v-model="showTransactionDialog"
      :title="transactionType === 'in' ? '📥 产品入库' : '📤 产品出库'"
      width="500px"
      destroy-on-close
    >
      <el-form :model="transactionForm" label-width="100px">
        <el-form-item label="产品名称">{{ productData.product }}</el-form-item>
        <el-form-item label="当前库存">{{ productData.quantity }} {{ productData.unit }}</el-form-item>
        <el-form-item label="数量" required>
          <el-input-number
            v-model="transactionForm.quantity"
            :min="1"
            controls-position="right"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="原因">
          <el-input
            v-model="transactionForm.reason"
            type="textarea"
            :rows="2"
            placeholder="请输入操作原因"
          />
        </el-form-item>
        <el-form-item label="参考单据">
          <el-input v-model="transactionForm.reference" placeholder="请输入参考单据号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showTransactionDialog = false">取消</el-button>
        <el-button
          :type="transactionType === 'in' ? 'success' : 'warning'"
          @click="confirmTransaction"
          :loading="transactionSubmitting"
        >
          {{ transactionType === 'in' ? '确认入库' : '确认出库' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft, ArrowDown, Edit, Delete, Download, Printer,
  Calendar, Clock, Phone, Message, Location, Upload, Download as DownloadIcon,
  Box, Money, Grid, WarningFilled, Search, Plus, Refresh,
  Check, Close, CircleCheck, CircleClose, Files, Setting,
  Collection, HomeFilled, OfficeBuilding, Briefcase, Goods,
  List, FolderOpened, User, Document, ShoppingCart
} from '@element-plus/icons-vue'

// ==================== Router ====================
const route = useRoute()
const router = useRouter()

// ==================== 状态变量 ====================
const loading = ref(true)
const activeTab = ref('basic')
const showDeleteDialog = ref(false)
const showTransactionDialog = ref(false)
const deleteConfirmText = ref('')
const transactionType = ref<'in' | 'out'>('in')
const transactionSubmitting = ref(false)
const transactionPage = ref(1)
const transactionPageSize = ref(5)
const transactionTotal = ref(15)

// ==================== 产品数据 ====================
const productData = ref({
  id: '1',
  product: 'iPhone 15 Pro Max 256GB',
  sku: 'IPH-15-PM-256',
  category: '电子产品',
  brand: 'Apple',
  model: 'A2849',
  specification: '256GB / 8GB RAM',
  unit: '件',
  price: 5299,
  cost: 4200,
  description: 'iPhone 15 Pro Max 采用钛金属边框，配备 A17 Pro 芯片，支持 USB-C 接口。',
  quantity: 156,
  safetyStock: 50,
  maxStock: 200,
  warehouse: '利雅得仓库',
  location: 'A-01-01',
  status: 'active',
  stockDate: '2024-11-20',
  lastUpdated: '2026-07-22 10:30',
  turnover: 8.6,
  daysInStock: 42,
  batches: [
    { batchNo: 'BATCH-2024-001', quantity: 100, productionDate: '2024-10-15', expiryDate: '2026-10-15' },
    { batchNo: 'BATCH-2024-002', quantity: 56, productionDate: '2024-11-01', expiryDate: '2026-11-01' }
  ],
  serialNumbers: [
    { serialNo: 'SN-2024-0001', status: '在库', batchNo: 'BATCH-2024-001', location: 'A-01-01', updatedAt: '2026-07-22 10:30' },
    { serialNo: 'SN-2024-0002', status: '在库', batchNo: 'BATCH-2024-001', location: 'A-01-01', updatedAt: '2026-07-22 10:30' },
    { serialNo: 'SN-2024-0003', status: '已售', batchNo: 'BATCH-2024-001', location: '-', updatedAt: '2026-07-20 14:20' },
    { serialNo: 'SN-2024-0004', status: '维修中', batchNo: 'BATCH-2024-002', location: '维修中心', updatedAt: '2026-07-18 09:00' }
  ]
})

// ==================== 统计数据 ====================
const detailStats = ref([
  { label: '当前库存', value: '156', unit: '件', type: 'primary' },
  { label: '库存金额', value: 'SAR 826,644', unit: '', type: 'success' },
  { label: '库存周转率', value: '8.6', unit: '次/年', type: 'warning' },
  { label: '安全库存', value: '50', unit: '件', type: 'info' }
])

// ==================== 出入库记录 ====================
const transactionRecords = ref([
  { id: 'TR-2026-001', type: '入库', quantity: 50, beforeQty: 106, afterQty: 156, reference: 'PO-2026-001', operator: 'Ahmed', createdAt: '2026-07-22 10:30' },
  { id: 'TR-2026-002', type: '出库', quantity: 25, beforeQty: 131, afterQty: 106, reference: 'SO-2026-003', operator: 'Mohammed', createdAt: '2026-07-21 14:20' },
  { id: 'TR-2026-003', type: '入库', quantity: 30, beforeQty: 101, afterQty: 131, reference: 'RT-2026-001', operator: 'Saud', createdAt: '2026-07-20 09:00' },
  { id: 'TR-2026-004', type: '出库', quantity: 15, beforeQty: 116, afterQty: 101, reference: 'SO-2026-002', operator: 'Ahmed', createdAt: '2026-07-19 16:30' },
  { id: 'TR-2026-005', type: '入库', quantity: 20, beforeQty: 96, afterQty: 116, reference: 'PO-2026-002', operator: 'Faisal', createdAt: '2026-07-18 11:00' }
])

// ==================== 操作日志 ====================
const operationLogs = ref([
  { time: '2026-07-22 10:30', user: 'Admin', action: '查看详情', detail: '浏览产品详细信息', type: 'info' },
  { time: '2026-07-21 14:20', user: 'Mohammed', action: '出库操作', detail: '出库 25 件，订单号 SO-2026-003', type: 'primary' },
  { time: '2026-07-20 09:00', user: 'Saud', action: '入库操作', detail: '入库 30 件，退货单号 RT-2026-001', type: 'success' },
  { time: '2026-07-19 16:30', user: 'Ahmed', action: '出库操作', detail: '出库 15 件，订单号 SO-2026-002', type: 'primary' },
  { time: '2026-07-18 11:00', user: 'Faisal', action: '入库操作', detail: '入库 20 件，采购单号 PO-2026-002', type: 'success' },
  { time: '2026-07-17 08:30', user: 'Admin', action: '编辑信息', detail: '更新了安全库存值从 30 到 50', type: 'warning' }
])

// ==================== 相关产品 ====================
const relatedProducts = ref([
  { id: 2, product: 'iPhone 15 Pro 128GB', sku: 'IPH-15-P-128', quantity: 89, category: '电子产品' },
  { id: 3, product: 'iPhone 15 256GB', sku: 'IPH-15-256', quantity: 45, category: '电子产品' },
  { id: 4, product: 'iPad Pro 12.9" M2', sku: 'IPP-129-M2-256', quantity: 12, category: '电子产品' },
  { id: 5, product: 'MacBook Pro 16" M3', sku: 'MBP-16-M3-512', quantity: 34, category: '电子产品' }
])

// ==================== 交易表单 ====================
const transactionForm = reactive({
  quantity: 1,
  reason: '',
  reference: ''
})

// ==================== 方法 ====================
// 格式化货币
const formatCurrency = (value: number) => {
  if (!value) return 'SAR 0'
  return new Intl.NumberFormat('en-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 0
  }).format(value)
}

// 计算剩余天数
const getDaysRemaining = (expiryDate: string) => {
  if (!expiryDate) return '无'
  const now = new Date()
  const expiry = new Date(expiryDate)
  const diffTime = expiry.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return '已过期'
  return `${diffDays}天`
}

// 获取批次状态类型
const getBatchStatusType = (expiryDate: string) => {
  if (!expiryDate) return 'info'
  const days = getDaysRemaining(expiryDate)
  if (days === '已过期' || days === '无') return 'danger'
  const num = parseInt(days)
  if (num < 0) return 'danger'
  if (num < 30) return 'warning'
  return 'success'
}

// 获取批次状态标签
const getBatchStatusLabel = (expiryDate: string) => {
  if (!expiryDate) return '未知'
  const days = getDaysRemaining(expiryDate)
  if (days === '已过期') return '已过期'
  if (days === '无') return '未知'
  const num = parseInt(days)
  if (num < 0) return '已过期'
  if (num < 30) return '临期'
  return '正常'
}

// 获取剩余天数类型
const getDaysRemainingType = (expiryDate: string) => {
  if (!expiryDate) return 'info'
  const days = getDaysRemaining(expiryDate)
  if (days === '已过期' || days === '无') return 'danger'
  const num = parseInt(days)
  if (num < 0) return 'danger'
  if (num < 30) return 'warning'
  return 'success'
}

// 判断是否临期
const isExpiring = (expiryDate: string) => {
  if (!expiryDate) return false
  const now = new Date()
  const expiry = new Date(expiryDate)
  const diffTime = expiry.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays < 30 && diffDays > 0
}

// 获取库存状态类型
const getStockStatusType = (quantity: number, safetyStock: number) => {
  if (!safetyStock) return 'info'
  if (quantity < safetyStock) return 'danger'
  if (quantity < safetyStock * 2) return 'warning'
  return 'success'
}

// 获取库存状态标签
const getStockStatusLabel = (quantity: number, safetyStock: number) => {
  if (!safetyStock) return '未知'
  if (quantity < safetyStock) return '紧缺'
  if (quantity < safetyStock * 2) return '正常'
  return '充足'
}

// 获取序列号状态数量
const getSerialStatusCount = (status: string) => {
  const sns = productData.value.serialNumbers || []
  return sns.filter(s => s.status === status).length
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const id = route.params.id as string
    await new Promise(resolve => setTimeout(resolve, 500))
    // 如果有ID，可以根据ID加载不同数据
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 返回
const handleBack = () => {
  router.push('/inventory')
}

// 编辑
const handleEdit = () => {
  const id = route.params.id as string || '1'
  router.push(`/inventory/edit/${id}`)
}

// 删除
const handleDelete = () => {
  showDeleteDialog.value = true
}

// 确认删除
const confirmDelete = () => {
  if (deleteConfirmText.value === productData.value.product) {
    ElMessage.success('产品已删除')
    showDeleteDialog.value = false
    router.push('/inventory')
  } else {
    ElMessage.warning('请输入正确的产品名称')
  }
}

// 导出PDF
const handleExport = () => {
  ElMessage.success('正在生成PDF报告...')
  setTimeout(() => {
    ElMessage.success('PDF报告已导出')
  }, 1500)
}

// 打印
const handlePrint = () => {
  window.print()
}

// 入库
const handleStockIn = () => {
  transactionType.value = 'in'
  transactionForm.quantity = 1
  transactionForm.reason = ''
  transactionForm.reference = ''
  showTransactionDialog.value = true
}

// 出库
const handleStockOut = () => {
  transactionType.value = 'out'
  transactionForm.quantity = 1
  transactionForm.reason = ''
  transactionForm.reference = ''
  showTransactionDialog.value = true
}

// 确认交易
const confirmTransaction = async () => {
  transactionSubmitting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    const qty = transactionForm.quantity
    if (transactionType.value === 'in') {
      productData.value.quantity += qty
      ElMessage.success(`成功入库 ${qty} 件`)
    } else {
      if (productData.value.quantity < qty) {
        ElMessage.warning('库存不足，无法出库')
        transactionSubmitting.value = false
        return
      }
      productData.value.quantity -= qty
      ElMessage.success(`成功出库 ${qty} 件`)
    }
    showTransactionDialog.value = false
  } catch (error) {
    ElMessage.error('操作失败')
  } finally {
    transactionSubmitting.value = false
  }
}

// 更多操作
const handleMoreAction = (command: string) => {
  const actions: Record<string, string> = {
    adjust: '库存调整',
    transfer: '调拨',
    count: '盘点',
    freeze: '冻结'
  }
  ElMessage.info(`${actions[command] || '操作'} ${productData.value.product}`)
}

// 查看相关产品
const handleViewRelated = () => {
  ElMessage.info('查看所有相关产品')
}

// 相关产品点击
const handleRelatedClick = (item: any) => {
  router.push(`/inventory/detail/${item.id}`)
}

// ==================== 生命周期 ====================
onMounted(() => {
  loadData()
})
</script>

<style scoped>
/* ==================== 全局容器 ==================== */
.inventory-detail-page {
  padding: 20px;
  background: #f0f2f5;
  min-height: 100vh;
}

/* ==================== 页面头部 ==================== */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-info {
  display: flex;
  flex-direction: column;
}

.page-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #1a1a2e;
}

.page-subtitle {
  margin: 2px 0 0 0;
  color: #909399;
  font-size: 13px;
}

.header-right {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* ==================== 加载状态 ==================== */
.loading-container {
  padding: 40px;
  background: white;
  border-radius: 12px;
}

/* ==================== 产品概览卡片 ==================== */
.product-overview-card {
  border-radius: 12px;
  margin-bottom: 20px;
}

.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.overview-info {
  flex: 1;
  min-width: 200px;
}

.product-name-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.product-name {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #1a1a2e;
}

.product-tags {
  margin: 8px 0;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.product-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  color: #606266;
  font-size: 14px;
}

.product-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.overview-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* ==================== 统计卡片 ==================== */
.stat-row {
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
  border-radius: 12px;
  padding: 12px 8px;
}

.stat-card.primary { border-left: 4px solid #409EFF; }
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-card.info { border-left: 4px solid #909399; }

.stat-label {
  font-size: 13px;
  color: #909399;
}

.stat-value {
  font-size: 26px;
  font-weight: 700;
  color: #303133;
}

.stat-unit {
  font-size: 12px;
  color: #909399;
}

/* ==================== 详情卡片 ==================== */
.detail-card {
  border-radius: 12px;
  margin-bottom: 20px;
}

.detail-tabs :deep(.el-tabs__content) {
  padding-top: 16px;
}

/* ==================== 序列号统计 ==================== */
.serial-summary {
  margin-bottom: 16px;
}

.serial-stats {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 16px;
}

.serial-stat {
  text-align: center;
}

.serial-stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
}

.serial-stat-label {
  font-size: 13px;
  color: #909399;
}

/* ==================== 表格底部 ==================== */
.table-footer {
  padding-top: 12px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #ebeef5;
  margin-top: 12px;
}

/* ==================== 操作日志 ==================== */
.log-content {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.log-user {
  font-weight: 600;
  color: #409EFF;
}

.log-action {
  color: #303133;
}

.log-detail {
  color: #909399;
}

/* ==================== 相关产品 ==================== */
.related-card {
  border-radius: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.related-item {
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 12px;
}

.related-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.related-name {
  font-weight: 500;
  color: #303133;
}

.related-sku {
  font-size: 12px;
  color: #909399;
}

.related-stock {
  font-size: 13px;
  color: #606266;
  margin-top: 4px;
}

/* ==================== 删除对话框 ==================== */
.delete-content {
  text-align: center;
}

.delete-icon {
  color: #F56C6C;
  margin-bottom: 12px;
}

.delete-warning {
  color: #F56C6C;
  font-size: 13px;
}

/* ==================== 响应式适配 ==================== */
@media (max-width: 768px) {
  .inventory-detail-page {
    padding: 12px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-right {
    width: 100%;
  }

  .header-right .el-button {
    flex: 1;
    font-size: 12px;
    padding: 8px 12px;
  }

  .overview-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .overview-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .overview-actions .el-button {
    flex: 1;
  }

  .product-name {
    font-size: 20px;
  }

  .product-meta {
    font-size: 12px;
    gap: 8px;
  }

  .stat-card .stat-value {
    font-size: 20px;
  }

  .detail-tabs :deep(.el-tabs__item) {
    font-size: 13px;
    padding: 0 12px;
  }

  .serial-stats .el-col {
    margin-bottom: 8px;
  }

  .related-item {
    padding: 10px 12px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 18px;
  }

  .product-tags .el-tag {
    font-size: 12px;
  }

  .stat-card .stat-value {
    font-size: 18px;
  }

  .detail-tabs :deep(.el-tabs__item) {
    font-size: 12px;
    padding: 0 8px;
  }

  .log-content {
    font-size: 13px;
  }
}

/* ==================== 打印样式 ==================== */
@media print {
  .inventory-detail-page {
    background: white;
    padding: 16px;
  }

  .page-header .header-right,
  .overview-actions,
  .related-card,
  .back-btn {
    display: none !important;
  }

  .stat-card {
    border: 1px solid #dcdfe6 !important;
  }

  .product-overview-card {
    padding: 16px 0;
  }

  .detail-card {
    box-shadow: none !important;
    border: 1px solid #dcdfe6;
  }

  .related-item {
    border: 1px solid #dcdfe6;
  }
}
</style>