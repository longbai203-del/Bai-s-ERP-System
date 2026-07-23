<template>
  <div class="orders-detail">
    <el-card class="detail-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-button type="default" @click="handleBack">
              <el-icon><ArrowLeft /></el-icon> 返回列表
            </el-button>
            <span class="header-title">订单详情</span>
            <el-tag :type="getStatusTag(detailData.status)" size="large" effect="dark">
              {{ getStatusLabel(detailData.status) }}
            </el-tag>
            <el-tag v-if="detailData.priority === 'high'" type="danger" size="large" effect="dark">
              <el-icon><Warning /></el-icon> 紧急
            </el-tag>
          </div>
          <div class="header-actions">
            <el-button type="warning" @click="handleEdit">
              <el-icon><Edit /></el-icon> 编辑
            </el-button>
            <el-button type="danger" @click="handleDelete">
              <el-icon><Delete /></el-icon> 删除
            </el-button>
            <el-button type="primary" @click="handleExport">
              <el-icon><Download /></el-icon> 导出
            </el-button>
            <el-button type="success" @click="handlePrint">
              <el-icon><Printer /></el-icon> 打印
            </el-button>
            <el-dropdown @command="handleMoreAction">
              <el-button type="info">
                更多 <el-icon><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="duplicate">复制订单</el-dropdown-item>
                  <el-dropdown-item command="invoice">生成发票</el-dropdown-item>
                  <el-dropdown-item command="shipment">创建发货单</el-dropdown-item>
                  <el-dropdown-item command="refund" divided>申请退款</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </template>

      <div v-loading="loading" class="detail-content">
        <!-- 顶部概览 -->
        <div class="detail-overview">
          <el-row :gutter="24">
            <el-col :xs="24" :sm="12" :lg="6">
              <div class="overview-item">
                <div class="overview-label">订单编号</div>
                <div class="overview-value">{{ detailData.orderNo }}</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="6">
              <div class="overview-item">
                <div class="overview-label">客户名称</div>
                <div class="overview-value">{{ detailData.customer }}</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="6">
              <div class="overview-item">
                <div class="overview-label">订单金额</div>
                <div class="overview-value amount">
                  ¥{{ formatNumber(detailData.totalAmount) }}
                </div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="6">
              <div class="overview-item">
                <div class="overview-label">下单日期</div>
                <div class="overview-value">{{ detailData.orderDate }}</div>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 进度条 -->
        <div class="order-progress">
          <el-steps :active="currentStep" finish-status="success" align-center>
            <el-step title="创建订单" description="已创建" />
            <el-step title="审核" :description="detailData.status === 'pending' ? '审核中...' : '已通过'" />
            <el-step title="处理" :description="detailData.status === 'processing' ? '处理中...' : '已处理'" />
            <el-step title="完成" :description="detailData.status === 'completed' ? '已完成' : '等待完成'" />
          </el-steps>
        </div>

        <el-divider />

        <!-- 详细信息 -->
        <el-row :gutter="32">
          <el-col :xs="24" :lg="16">
            <!-- 基本信息 -->
            <div class="info-section">
              <div class="section-title">
                <span class="section-indicator"></span>
                基本信息
                <span class="section-actions">
                  <el-button size="small" type="primary" link @click="handleEdit">
                    <el-icon><Edit /></el-icon> 编辑
                  </el-button>
                </span>
              </div>
              <el-descriptions :column="2" border size="default">
                <el-descriptions-item label="订单编号">
                  <strong>{{ detailData.orderNo }}</strong>
                </el-descriptions-item>
                <el-descriptions-item label="订单状态">
                  <el-tag :type="getStatusTag(detailData.status)" size="large">
                    {{ getStatusLabel(detailData.status) }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="客户名称">
                  <el-link type="primary" @click="handleViewCustomer">{{ detailData.customer }}</el-link>
                </el-descriptions-item>
                <el-descriptions-item label="联系电话">
                  {{ detailData.phone || '-' }}
                </el-descriptions-item>
                <el-descriptions-item label="支付方式">
                  <el-tag :type="getPaymentTag(detailData.paymentMethod)" size="small">
                    {{ detailData.paymentMethod || '-' }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="下单日期">
                  {{ detailData.orderDate }}
                </el-descriptions-item>
                <el-descriptions-item label="创建时间">
                  {{ detailData.createdAt || detailData.orderDate + ' 00:00:00' }}
                </el-descriptions-item>
                <el-descriptions-item label="最后更新">
                  {{ detailData.updatedAt || detailData.orderDate + ' 00:00:00' }}
                </el-descriptions-item>
                <el-descriptions-item label="客户地址" :span="2">
                  {{ detailData.address || '暂无地址信息' }}
                </el-descriptions-item>
                <el-descriptions-item label="备注" :span="2">
                  <div class="description-text">{{ detailData.remark || '暂无备注' }}</div>
                </el-descriptions-item>
              </el-descriptions>
            </div>

            <!-- 订单明细 -->
            <div class="info-section" style="margin-top: 24px;">
              <div class="section-title">
                <span class="section-indicator"></span>
                订单明细
                <span class="section-tip">共 {{ detailData.items.length }} 项商品</span>
              </div>
              <el-table :data="detailData.items" border style="width: 100%" stripe>
                <el-table-column type="index" label="#" width="50" align="center" />
                <el-table-column prop="name" label="项目名称" min-width="180">
                  <template #default="{ row }">
                    <div class="product-info">
                      <div class="product-name">{{ row.name }}</div>
                      <div class="product-spec">{{ row.spec || '标准' }}</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="spec" label="规格/型号" width="130" align="center" v-if="false" />
                <el-table-column prop="quantity" label="数量" width="100" align="center">
                  <template #default="{ row }">
                    <el-tag size="small" type="info">×{{ row.quantity }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="price" label="单价" width="140" align="right">
                  <template #default="{ row }">
                    ¥{{ formatNumber(row.price) }}
                  </template>
                </el-table-column>
                <el-table-column label="小计" width="150" align="right">
                  <template #default="{ row }">
                    <span style="font-weight: 600; color: #409eff;">
                      ¥{{ formatNumber(row.quantity * row.price) }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="折扣" width="100" align="center">
                  <template #default="{ row }">
                    {{ row.discount || 0 }}%
                  </template>
                </el-table-column>
              </el-table>

              <!-- 订单合计 -->
              <div class="order-total">
                <div class="total-row">
                  <span class="total-label">商品数量：</span>
                  <span class="total-value">{{ totalItems }} 件</span>
                </div>
                <div class="total-row">
                  <span class="total-label">小计：</span>
                  <span class="total-value">¥{{ formatNumber(subtotal) }}</span>
                </div>
                <div class="total-row" v-if="detailData.discount > 0">
                  <span class="total-label">折扣 ({{ detailData.discount }}%)：</span>
                  <span class="total-value" style="color: #e6a23c;">
                    -¥{{ formatNumber(discountAmount) }}
                  </span>
                </div>
                <div class="total-row" v-if="detailData.couponDiscount > 0">
                  <span class="total-label">优惠券抵扣：</span>
                  <span class="total-value" style="color: #e6a23c;">
                    -¥{{ formatNumber(detailData.couponDiscount) }}
                  </span>
                </div>
                <div class="total-row" v-if="detailData.shippingFee > 0">
                  <span class="total-label">运费：</span>
                  <span class="total-value">¥{{ formatNumber(detailData.shippingFee) }}</span>
                </div>
                <div class="total-row grand-total">
                  <span class="total-label">订单总额：</span>
                  <span class="total-value">¥{{ formatNumber(totalAmount) }}</span>
                </div>
                <div class="total-row" v-if="detailData.paidAmount > 0">
                  <span class="total-label">已支付：</span>
                  <span class="total-value" style="color: #67c23a;">
                    ¥{{ formatNumber(detailData.paidAmount) }}
                  </span>
                </div>
                <div class="total-row" v-if="detailData.balance > 0">
                  <span class="total-label">待支付：</span>
                  <span class="total-value" style="color: #f56c6c;">
                    ¥{{ formatNumber(detailData.balance) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 物流信息 -->
            <div class="info-section" style="margin-top: 24px;" v-if="detailData.shippingInfo">
              <div class="section-title">
                <span class="section-indicator"></span>
                物流信息
              </div>
              <el-descriptions :column="2" border size="small">
                <el-descriptions-item label="物流公司">
                  {{ detailData.shippingInfo.company || '-' }}
                </el-descriptions-item>
                <el-descriptions-item label="物流单号">
                  <el-link type="primary">{{ detailData.shippingInfo.trackingNo || '-' }}</el-link>
                </el-descriptions-item>
                <el-descriptions-item label="发货时间">
                  {{ detailData.shippingInfo.shipDate || '-' }}
                </el-descriptions-item>
                <el-descriptions-item label="预计送达">
                  {{ detailData.shippingInfo.expectedDate || '-' }}
                </el-descriptions-item>
                <el-descriptions-item label="物流状态" :span="2">
                  <el-tag :type="getShippingTag(detailData.shippingInfo.status)" size="small">
                    {{ detailData.shippingInfo.statusLabel || '待发货' }}
                  </el-tag>
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </el-col>

          <el-col :xs="24" :lg="8">
            <!-- 操作日志 -->
            <div class="info-section">
              <div class="section-title">
                <span class="section-indicator"></span>
                操作日志
                <span class="section-tip">共 {{ logs.length }} 条</span>
              </div>
              <div class="timeline-wrapper">
                <el-timeline>
                  <el-timeline-item
                    v-for="(log, index) in logs"
                    :key="index"
                    :timestamp="log.time"
                    :type="log.type"
                    :icon="log.icon"
                    size="large"
                    :hollow="true"
                  >
                    <div class="log-content">
                      <div class="log-action">{{ log.action }}</div>
                      <div class="log-user">
                        <el-icon><User /></el-icon>
                        {{ log.user }}
                      </div>
                      <div v-if="log.remark" class="log-remark">
                        <el-icon><ChatDotRound /></el-icon>
                        {{ log.remark }}
                      </div>
                    </div>
                  </el-timeline-item>
                </el-timeline>
              </div>
            </div>

            <!-- 审批信息 -->
            <div class="info-section" style="margin-top: 24px;">
              <div class="section-title">
                <span class="section-indicator"></span>
                审批信息
              </div>
              <div v-if="detailData.status === 'pending'" class="approval-status pending">
                <el-icon class="status-icon"><Clock /></el-icon>
                <span>等待审批中...</span>
                <div class="approval-actions">
                  <el-button type="success" size="small" @click="handleApprove">
                    <el-icon><Select /></el-icon> 通过
                  </el-button>
                  <el-button type="danger" size="small" @click="handleReject">
                    <el-icon><Close /></el-icon> 驳回
                  </el-button>
                  <el-button type="info" size="small" @click="handleTransfer">
                    <el-icon><Share /></el-icon> 转审
                  </el-button>
                </div>
              </div>
              <div v-else-if="detailData.status === 'completed'" class="approval-status approved">
                <el-icon class="status-icon"><SuccessFilled /></el-icon>
                <span>已审批通过</span>
                <div class="approval-meta">
                  <div class="meta-item">
                    <el-icon><User /></el-icon>
                    审批人：{{ detailData.approver || '系统管理员' }}
                  </div>
                  <div class="meta-item">
                    <el-icon><Clock /></el-icon>
                    审批时间：{{ detailData.approvalTime || '2026-07-20 14:30:00' }}
                  </div>
                  <div class="meta-item" v-if="detailData.approvalComment">
                    <el-icon><ChatDotRound /></el-icon>
                    审批意见：{{ detailData.approvalComment }}
                  </div>
                </div>
              </div>
              <div v-else-if="detailData.status === 'cancelled'" class="approval-status rejected">
                <el-icon class="status-icon"><CircleCloseFilled /></el-icon>
                <span>已取消</span>
                <div class="approval-meta">
                  <div class="meta-item">
                    <el-icon><User /></el-icon>
                    取消人：{{ detailData.cancelBy || '系统' }}
                  </div>
                  <div class="meta-item">
                    <el-icon><ChatDotRound /></el-icon>
                    取消原因：{{ detailData.cancelReason || '客户取消订单' }}
                  </div>
                </div>
              </div>
              <div v-else-if="detailData.status === 'processing'" class="approval-status processing">
                <el-icon class="status-icon"><Loading /></el-icon>
                <span>处理中...</span>
                <div class="approval-meta">
                  <div class="meta-item">当前环节：订单处理</div>
                  <div class="meta-item">预计完成：{{ getEstimatedComplete() }}</div>
                </div>
              </div>
              <div v-else class="approval-status draft">
                <el-icon class="status-icon"><Document /></el-icon>
                <span>草稿状态</span>
                <div class="approval-meta">
                  <div class="meta-item">尚未提交审批</div>
                </div>
              </div>
            </div>

            <!-- 客户信息 -->
            <div class="info-section" style="margin-top: 24px;">
              <div class="section-title">
                <span class="section-indicator"></span>
                客户信息
              </div>
              <el-descriptions :column="1" border size="small">
                <el-descriptions-item label="客户等级">
                  <el-tag :type="getCustomerLevelTag(detailData.customerLevel)" size="small">
                    {{ detailData.customerLevel || '普通' }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="累计消费">
                  ¥{{ formatNumber(detailData.totalSpent || 0) }}
                </el-descriptions-item>
                <el-descriptions-item label="订单数量">
                  {{ detailData.orderCount || 0 }} 单
                </el-descriptions-item>
                <el-descriptions-item label="注册时间">
                  {{ detailData.registerTime || '-' }}
                </el-descriptions-item>
              </el-descriptions>
            </div>

            <!-- 快捷操作 -->
            <div class="info-section" style="margin-top: 24px;">
              <div class="section-title">
                <span class="section-indicator"></span>
                快捷操作
              </div>
              <div class="quick-actions">
                <el-button type="primary" plain size="small" @click="handleSendMessage">
                  <el-icon><ChatDotRound /></el-icon> 发送消息
                </el-button>
                <el-button type="success" plain size="small" @click="handleCreateInvoice">
                  <el-icon><Document /></el-icon> 生成发票
                </el-button>
                <el-button type="warning" plain size="small" @click="handleCreateShipment">
                  <el-icon><Box /></el-icon> 创建发货单
                </el-button>
                <el-button type="danger" plain size="small" @click="handleCreateRefund">
                  <el-icon><Money /></el-icon> 申请退款
                </el-button>
              </div>
            </div>
          </el-col>
        </el-row>

        <!-- 底部操作 -->
        <el-divider />
        <div class="detail-footer">
          <div class="footer-left">
            <el-button @click="handleBack">
              <el-icon><ArrowLeft /></el-icon> 返回
            </el-button>
            <el-button type="primary" plain @click="handlePrevious" :disabled="!hasPrevious">
              <el-icon><ArrowLeft /></el-icon> 上一条
            </el-button>
            <el-button type="primary" plain @click="handleNext" :disabled="!hasNext">
              下一条 <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
          <div class="footer-right">
            <el-button type="warning" @click="handleEdit">
              <el-icon><Edit /></el-icon> 编辑
            </el-button>
            <el-button type="primary" @click="handlePrint">
              <el-icon><Printer /></el-icon> 打印
            </el-button>
            <el-button type="success" @click="handleExport">
              <el-icon><Download /></el-icon> 导出PDF
            </el-button>
            <el-button type="danger" @click="handleDelete">
              <el-icon><Delete /></el-icon> 删除
            </el-button>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 删除确认对话框 -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="确认删除"
      width="420px"
      :close-on-click-modal="false"
    >
      <div class="delete-confirm">
        <el-icon color="#f56c6c" size="56"><WarningFilled /></el-icon>
        <p>确定要删除该订单吗？</p>
        <p class="delete-hint">订单编号：<strong>{{ detailData.orderNo }}</strong></p>
        <p class="delete-hint">此操作不可恢复，请谨慎操作！</p>
      </div>
      <template #footer>
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="danger" :loading="deleteLoading" @click="confirmDelete">
          确定删除
        </el-button>
      </template>
    </el-dialog>

    <!-- 导出对话框 -->
    <el-dialog
      v-model="exportDialogVisible"
      title="导出选项"
      width="420px"
    >
      <el-form label-width="100px">
        <el-form-item label="导出格式">
          <el-radio-group v-model="exportFormat">
            <el-radio label="pdf">PDF</el-radio>
            <el-radio label="excel">Excel</el-radio>
            <el-radio label="print">打印</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="包含明细">
          <el-switch v-model="exportIncludeItems" />
        </el-form-item>
        <el-form-item label="包含日志">
          <el-switch v-model="exportIncludeLogs" />
        </el-form-item>
        <el-form-item label="纸张方向">
          <el-radio-group v-model="exportOrientation">
            <el-radio label="portrait">纵向</el-radio>
            <el-radio label="landscape">横向</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="exportDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="exportLoading" @click="confirmExport">
          确认导出
        </el-button>
      </template>
    </el-dialog>

    <!-- 转审对话框 -->
    <el-dialog
      v-model="transferDialogVisible"
      title="转审订单"
      width="450px"
      :close-on-click-modal="false"
    >
      <el-form :model="transferForm" label-width="100px">
        <el-form-item label="转审人" required>
          <el-select v-model="transferForm.targetUser" placeholder="请选择转审人" style="width: 100%">
            <el-option label="李四 (部门经理)" value="李四" />
            <el-option label="王五 (总监)" value="王五" />
            <el-option label="赵六 (CEO)" value="赵六" />
          </el-select>
        </el-form-item>
        <el-form-item label="转审原因">
          <el-input
            v-model="transferForm.reason"
            type="textarea"
            :rows="3"
            placeholder="请输入转审原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="transferDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="transferLoading" @click="confirmTransfer">
          确定转审
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft,
  Edit,
  Delete,
  Download,
  Document,
  Clock,
  Select,
  Close,
  SuccessFilled,
  CircleCloseFilled,
  WarningFilled,
  Printer,
  Loading,
  User,
  ChatDotRound,
  Share,
  ArrowDown,
  ArrowRight,
  Warning,
  Money,
  Box
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// ========== 响应式数据 ==========
const loading = ref(false)
const deleteLoading = ref(false)
const exportLoading = ref(false)
const transferLoading = ref(false)
const deleteDialogVisible = ref(false)
const exportDialogVisible = ref(false)
const transferDialogVisible = ref(false)
const exportFormat = ref('pdf')
const exportIncludeItems = ref(true)
const exportIncludeLogs = ref(true)
const exportOrientation = ref('portrait')
const currentStep = ref(0)
const hasPrevious = ref(false)
const hasNext = ref(false)

// 详情数据
const detailData = reactive({
  id: 0,
  orderNo: '',
  customer: '',
  phone: '',
  totalAmount: 0,
  status: '',
  orderDate: '',
  paymentMethod: '',
  remark: '',
  discount: 0,
  couponDiscount: 0,
  shippingFee: 0,
  paidAmount: 0,
  balance: 0,
  createdAt: '',
  updatedAt: '',
  approver: '',
  approvalTime: '',
  approvalComment: '',
  cancelReason: '',
  cancelBy: '',
  priority: '',
  address: '',
  customerLevel: '',
  totalSpent: 0,
  orderCount: 0,
  registerTime: '',
  items: [] as Array<{ name: string; spec: string; quantity: number; price: number; discount?: number }>,
  shippingInfo: {
    company: '',
    trackingNo: '',
    shipDate: '',
    expectedDate: '',
    status: '',
    statusLabel: ''
  }
})

// 操作日志
const logs = ref([
  {
    time: '2026-07-01 10:30:00',
    type: 'primary',
    icon: 'plus',
    action: '创建订单',
    user: '张三',
    remark: '新建订单'
  },
  {
    time: '2026-07-01 14:20:00',
    type: 'warning',
    icon: 'edit',
    action: '编辑订单',
    user: '张三',
    remark: '更新订单信息'
  },
  {
    time: '2026-07-02 09:15:00',
    type: 'success',
    icon: 'check',
    action: '提交审核',
    user: '张三',
    remark: '提交审批流程'
  },
  {
    time: '2026-07-02 14:30:00',
    type: 'info',
    icon: 'user',
    action: '审批中',
    user: '李四',
    remark: '部门经理审核中'
  }
])

// 转审表单
const transferForm = reactive({
  targetUser: '',
  reason: ''
})

// ========== 计算属性 ==========
const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const getStatusTag = (status: string) => {
  const map: Record<string, string> = {
    pending: 'warning',
    processing: 'primary',
    completed: 'success',
    cancelled: 'danger'
  }
  return map[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    pending: '待处理',
    processing: '处理中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return map[status] || status
}

const getPaymentTag = (method: string) => {
  const map: Record<string, string> = {
    '微信支付': 'success',
    '支付宝': 'primary',
    '银行转账': 'warning',
    '现金': 'info',
    '信用卡': 'danger'
  }
  return map[method] || 'info'
}

const getShippingTag = (status: string) => {
  const map: Record<string, string> = {
    pending: 'info',
    shipping: 'warning',
    delivered: 'success',
    returned: 'danger'
  }
  return map[status] || 'info'
}

const getCustomerLevelTag = (level: string) => {
  const map: Record<string, string> = {
    VIP: 'success',
    '黄金': 'warning',
    '白银': 'info',
    '普通': ''
  }
  return map[level] || ''
}

const totalItems = computed(() => {
  return detailData.items.reduce((sum, item) => sum + item.quantity, 0)
})

const subtotal = computed(() => {
  return detailData.items.reduce((sum, item) => sum + item.quantity * item.price, 0)
})

const discountAmount = computed(() => {
  return subtotal.value * (detailData.discount / 100)
})

const totalAmount = computed(() => {
  return subtotal.value - discountAmount - detailData.couponDiscount + detailData.shippingFee
})

const getEstimatedComplete = () => {
  const now = new Date()
  now.setDate(now.getDate() + 3)
  return now.toISOString().split('T')[0]
}

// ========== 获取详情数据 ==========
const fetchDetail = async () => {
  const id = route.params.id as string
  if (!id) {
    ElMessage.error('无效的订单ID')
    router.push('/orders')
    return
  }

  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 600))

    const mockItems = [
      { name: 'iPhone 15 Pro Max', spec: '256GB 黑色', quantity: 2, price: 8999, discount: 0 },
      { name: 'AirPods Pro 2', spec: 'USB-C版', quantity: 1, price: 1899, discount: 0 },
      { name: '钢化膜', spec: 'iPhone 15 Pro Max', quantity: 3, price: 89, discount: 10 }
    ]

    const total = mockItems.reduce((sum, item) => sum + item.quantity * item.price, 0)

    const mockData = {
      id: parseInt(id),
      orderNo: `ORD-${String(id).padStart(6, '0')}`,
      customer: '张三',
      phone: '13800001001',
      totalAmount: total,
      status: 'pending',
      orderDate: '2026-07-22',
      paymentMethod: '微信支付',
      remark: '请尽快发货，客户急需',
      discount: 0,
      couponDiscount: 0,
      shippingFee: 0,
      paidAmount: total * 0.3,
      balance: total * 0.7,
      createdAt: '2026-07-22 09:00:00',
      updatedAt: '2026-07-22 10:30:00',
      approver: '',
      approvalTime: '',
      approvalComment: '',
      cancelReason: '',
      cancelBy: '',
      priority: 'high',
      address: '北京市朝阳区建国路88号SOHO现代城A座1201室',
      customerLevel: 'VIP',
      totalSpent: 28560,
      orderCount: 15,
      registerTime: '2024-01-15 14:30:00',
      items: mockItems,
      shippingInfo: {
        company: '顺丰速运',
        trackingNo: 'SF1234567890',
        shipDate: '2026-07-23',
        expectedDate: '2026-07-25',
        status: 'shipping',
        statusLabel: '运输中'
      }
    }

    Object.assign(detailData, mockData)
    updateStep()
    checkNavigation()
  } catch (error) {
    ElMessage.error('加载详情失败，请重试')
  } finally {
    loading.value = false
  }
}

// ========== 更新步骤 ==========
const updateStep = () => {
  const statusMap: Record<string, number> = {
    pending: 1,
    processing: 2,
    completed: 3,
    cancelled: 0
  }
  currentStep.value = statusMap[detailData.status] || 0
}

// ========== 导航检查 ==========
const checkNavigation = () => {
  const currentId = detailData.id
  hasPrevious.value = currentId > 1
  hasNext.value = currentId < 100
}

// ========== 事件处理 ==========
const handleBack = () => {
  router.push('/orders')
}

const handleEdit = () => {
  router.push(`/orders/edit/${detailData.id}`)
}

const handleDelete = () => {
  deleteDialogVisible.value = true
}

const confirmDelete = async () => {
  deleteLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    ElMessage.success('删除成功！')
    deleteDialogVisible.value = false
    router.push('/orders')
  } catch (error) {
    ElMessage.error('删除失败，请重试')
  } finally {
    deleteLoading.value = false
  }
}

const handleExport = () => {
  exportDialogVisible.value = true
}

const confirmExport = async () => {
  exportLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    ElMessage.success(`导出${exportFormat.value.toUpperCase()}格式成功！`)
    exportDialogVisible.value = false
  } catch (error) {
    ElMessage.error('导出失败，请重试')
  } finally {
    exportLoading.value = false
  }
}

const handlePrint = () => {
  window.print()
}

const handleApprove = () => {
  ElMessageBox.confirm('确定要通过该审批吗？', '审批确认', {
    confirmButtonText: '通过',
    cancelButtonText: '取消',
    type: 'success'
  }).then(() => {
    detailData.status = 'completed'
    detailData.approver = '当前用户'
    detailData.approvalTime = new Date().toLocaleString()
    detailData.approvalComment = '审批通过，同意执行'
    logs.value.unshift({
      time: new Date().toLocaleString(),
      type: 'success',
      icon: 'check',
      action: '审批通过',
      user: '当前用户',
      remark: '审批通过'
    })
    updateStep()
    ElMessage.success('审批通过！')
  }).catch(() => {})
}

const handleReject = () => {
  ElMessageBox.prompt('请输入驳回原因', '驳回审批', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputType: 'textarea',
    inputPlaceholder: '请填写驳回原因...',
    inputValidator: (value) => {
      if (!value || value.trim() === '') {
        return '驳回原因不能为空'
      }
      return true
    }
  }).then(({ value }) => {
    detailData.status = 'cancelled'
    detailData.cancelReason = value
    detailData.cancelBy = '当前用户'
    logs.value.unshift({
      time: new Date().toLocaleString(),
      type: 'danger',
      icon: 'close',
      action: '审批驳回',
      user: '当前用户',
      remark: `驳回原因：${value}`
    })
    updateStep()
    ElMessage.warning('已驳回！')
  }).catch(() => {})
}

const handleTransfer = () => {
  transferForm.targetUser = ''
  transferForm.reason = ''
  transferDialogVisible.value = true
}

const confirmTransfer = async () => {
  if (!transferForm.targetUser) {
    ElMessage.warning('请选择转审人')
    return
  }
  transferLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    logs.value.unshift({
      time: new Date().toLocaleString(),
      type: 'warning',
      icon: 'share',
      action: '转审',
      user: '当前用户',
      remark: `转审给 ${transferForm.targetUser}${transferForm.reason ? '，原因：' + transferForm.reason : ''}`
    })
    ElMessage.success(`已转审给 ${transferForm.targetUser}`)
    transferDialogVisible.value = false
  } finally {
    transferLoading.value = false
  }
}

const handleMoreAction = (command: string) => {
  const actions: Record<string, string> = {
    duplicate: '复制订单',
    invoice: '生成发票',
    shipment: '创建发货单',
    refund: '申请退款'
  }
  ElMessage.info(`${actions[command] || command}功能开发中`)
}

const handleViewCustomer = () => {
  ElMessage.info(`查看客户 ${detailData.customer} 详情`)
}

const handleSendMessage = () => {
  ElMessage.info('发送消息功能开发中')
}

const handleCreateInvoice = () => {
  ElMessage.info('生成发票功能开发中')
}

const handleCreateShipment = () => {
  ElMessage.info('创建发货单功能开发中')
}

const handleCreateRefund = () => {
  ElMessage.info('申请退款功能开发中')
}

const handlePrevious = () => {
  if (detailData.id > 1) {
    router.push(`/orders/detail/${detailData.id - 1}`)
  }
}

const handleNext = () => {
  router.push(`/orders/detail/${detailData.id + 1}`)
}

// ========== 生命周期 ==========
onMounted(() => {
  fetchDetail()
})

watch(() => route.params.id, () => {
  fetchDetail()
})
</script>

<style scoped>
.orders-detail {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.detail-card {
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

.detail-content {
  padding: 8px 0;
}

.detail-overview {
  background: linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);
  border-radius: 8px;
  padding: 24px 20px;
  margin-bottom: 16px;
}

.overview-item {
  padding: 4px 0;
}

.overview-label {
  font-size: 13px;
  color: #909399;
  margin-bottom: 4px;
}

.overview-value {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.overview-value.amount {
  font-size: 20px;
  font-weight: 700;
  color: #409eff;
}

.order-progress {
  margin: 16px 0 24px 0;
  padding: 16px 20px;
  background: #fafbfc;
  border-radius: 8px;
}

.info-section {
  background: #fafbfc;
  border-radius: 8px;
  padding: 16px 20px;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 8px;
}

.section-indicator {
  display: inline-block;
  width: 4px;
  height: 18px;
  background: linear-gradient(135deg, #409eff, #66b1ff);
  border-radius: 2px;
  margin-right: 10px;
}

.section-tip {
  font-size: 12px;
  font-weight: 400;
  color: #909399;
  margin-left: 8px;
}

.section-actions {
  margin-left: auto;
}

.description-text {
  line-height: 1.8;
  color: #606266;
  word-break: break-all;
}

.product-info {
  display: flex;
  flex-direction: column;
}

.product-name {
  font-weight: 500;
  color: #303133;
}

.product-spec {
  font-size: 12px;
  color: #909399;
}

.order-total {
  margin-top: 16px;
  padding: 16px 20px;
  background: #f5f7fa;
  border-radius: 8px;
  border: 1px solid #ebeef5;
}

.total-row {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 4px 0;
  font-size: 14px;
}

.total-label {
  color: #909399;
  margin-right: 8px;
  min-width: 100px;
  text-align: right;
}

.total-value {
  font-weight: 500;
  min-width: 120px;
  text-align: right;
}

.grand-total {
  padding-top: 8px;
  margin-top: 8px;
  border-top: 2px solid #dcdfe6;
}

.grand-total .total-label {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.grand-total .total-value {
  font-size: 22px;
  font-weight: 700;
  color: #409eff;
}

.timeline-wrapper {
  padding: 4px 0;
  max-height: 350px;
  overflow-y: auto;
}

.timeline-wrapper::-webkit-scrollbar {
  width: 4px;
}

.timeline-wrapper::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 2px;
}

.timeline-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.log-content {
  padding: 2px 0;
}

.log-action {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.log-user {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.log-remark {
  font-size: 13px;
  color: #606266;
  margin-top: 4px;
  padding: 4px 8px;
  background: #f0f2f5;
  border-radius: 4px;
  display: flex;
  align-items: flex-start;
  gap: 4px;
}

.approval-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  gap: 8px;
}

.approval-status .status-icon {
  font-size: 48px;
}

.approval-status.pending .status-icon {
  color: #e6a23c;
}
.approval-status.approved .status-icon {
  color: #67c23a;
}
.approval-status.rejected .status-icon {
  color: #f56c6c;
}
.approval-status.processing .status-icon {
  color: #409eff;
}
.approval-status.draft .status-icon {
  color: #909399;
}

.approval-status span {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.approval-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.approval-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  color: #909399;
  text-align: left;
  width: 100%;
  padding: 0 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 0;
  border-bottom: 1px solid #f0f2f5;
}

.meta-item:last-child {
  border-bottom: none;
}

.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.quick-actions .el-button {
  width: 100%;
}

.detail-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 4px 0;
}

.footer-left,
.footer-right {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.delete-confirm {
  text-align: center;
  padding: 20px 0;
}

.delete-confirm p {
  margin: 12px 0 0;
  font-size: 16px;
  color: #606266;
}

.delete-confirm .delete-hint {
  font-size: 14px;
  color: #909399;
  margin-top: 6px;
}

.delete-confirm .delete-hint strong {
  color: #303133;
}

@media (max-width: 768px) {
  .orders-detail {
    padding: 12px;
  }

  .card-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-left {
    flex-wrap: wrap;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .header-actions .el-button {
    font-size: 12px;
    padding: 8px 12px;
  }

  .detail-overview {
    padding: 16px;
  }

  .overview-value.amount {
    font-size: 18px;
  }

  .detail-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .footer-left,
  .footer-right {
    justify-content: stretch;
  }

  .footer-left .el-button,
  .footer-right .el-button {
    flex: 1;
  }

  .order-total {
    padding: 12px 16px;
  }

  .total-row {
    justify-content: space-between;
  }

  .total-label {
    min-width: auto;
    text-align: left;
  }

  .total-value {
    min-width: auto;
  }

  .quick-actions {
    grid-template-columns: 1fr;
  }

  .order-progress {
    padding: 12px;
    overflow-x: auto;
  }

  .order-progress :deep(.el-step) {
    min-width: 80px;
  }

  .approval-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .approval-actions .el-button {
    width: 100%;
  }

  .section-actions {
    margin-left: 0;
    width: 100%;
  }
}

@media print {
  .header-actions,
  .detail-footer .el-button,
  .approval-actions,
  .quick-actions .el-button,
  .section-actions {
    display: none !important;
  }

  .orders-detail {
    background: white;
    padding: 0;
  }

  .detail-card {
    box-shadow: none !important;
    border: none !important;
  }

  .detail-card :deep(.el-card__body) {
    padding: 16px;
  }

  .info-section {
    background: transparent;
    padding: 8px 0;
  }

  .detail-overview {
    background: transparent;
    padding: 12px 0;
  }

  .order-progress {
    background: transparent;
    padding: 12px 0;
  }

  .order-total {
    background: transparent;
    border: 1px solid #dcdfe6;
  }
}
</style>