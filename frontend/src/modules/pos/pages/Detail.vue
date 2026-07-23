<template>
  <div class="pos-detail">
    <el-card class="detail-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-button type="default" @click="handleBack">
              <el-icon><ArrowLeft /></el-icon> 返回列表
            </el-button>
            <span class="header-title">POS 订单详情</span>
            <el-tag :type="getStatusTag(detailData.status)" size="large" effect="dark">
              {{ getStatusLabel(detailData.status) }}
            </el-tag>
          </div>
          <div class="header-actions">
            <el-button type="warning" @click="handleEdit">
              <el-icon><Edit /></el-icon> 编辑
            </el-button>
            <el-button type="danger" @click="handleDelete">
              <el-icon><Delete /></el-icon> 删除
            </el-button>
            <el-button type="primary" @click="handlePrint">
              <el-icon><Printer /></el-icon> 打印小票
            </el-button>
            <el-button type="success" @click="handleExport">
              <el-icon><Download /></el-icon> 导出
            </el-button>
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
                <div class="overview-value">{{ detailData.customer || '散客' }}</div>
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
                <div class="overview-label">下单时间</div>
                <div class="overview-value">{{ detailData.orderDate }}</div>
              </div>
            </el-col>
          </el-row>
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
              </div>
              <el-descriptions :column="2" border size="default">
                <el-descriptions-item label="订单编号">
                  {{ detailData.orderNo }}
                </el-descriptions-item>
                <el-descriptions-item label="订单状态">
                  <el-tag :type="getStatusTag(detailData.status)">
                    {{ getStatusLabel(detailData.status) }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="客户名称">
                  {{ detailData.customer || '散客' }}
                </el-descriptions-item>
                <el-descriptions-item label="联系电话">
                  {{ detailData.phone || '-' }}
                </el-descriptions-item>
                <el-descriptions-item label="车牌号">
                  {{ detailData.plateNumber || '-' }}
                </el-descriptions-item>
                <el-descriptions-item label="支付方式">
                  <el-tag :type="getPaymentTag(detailData.paymentMethod)">
                    {{ detailData.paymentMethod || '-' }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="收银员">
                  {{ detailData.cashier || '-' }}
                </el-descriptions-item>
                <el-descriptions-item label="下单时间">
                  {{ detailData.orderDate }}
                </el-descriptions-item>
                <el-descriptions-item label="备注" :span="2">
                  <div class="description-text">{{ detailData.remark || '暂无备注' }}</div>
                </el-descriptions-item>
              </el-descriptions>
            </div>

            <!-- 商品明细 -->
            <div class="info-section" style="margin-top: 24px;">
              <div class="section-title">
                <span class="section-indicator"></span>
                商品明细
              </div>
              <el-table :data="detailData.items" border style="width: 100%">
                <el-table-column type="index" label="#" width="50" align="center" />
                <el-table-column prop="name" label="商品名称" min-width="150" />
                <el-table-column prop="category" label="分类" width="100" align="center" />
                <el-table-column prop="qty" label="数量" width="100" align="center" />
                <el-table-column prop="price" label="单价" width="140" align="right">
                  <template #default="{ row }">
                    ¥{{ formatNumber(row.price) }}
                  </template>
                </el-table-column>
                <el-table-column label="小计" width="150" align="right">
                  <template #default="{ row }">
                    <span style="font-weight: 600; color: #409eff;">
                      ¥{{ formatNumber(row.price * row.qty) }}
                    </span>
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
                <div class="total-row grand-total">
                  <span class="total-label">订单总额：</span>
                  <span class="total-value">¥{{ formatNumber(totalAmount) }}</span>
                </div>
              </div>
            </div>
          </el-col>

          <el-col :xs="24" :lg="8">
            <!-- 操作日志 -->
            <div class="info-section">
              <div class="section-title">
                <span class="section-indicator"></span>
                操作日志
              </div>
              <div class="timeline-wrapper">
                <el-timeline>
                  <el-timeline-item
                    v-for="(log, index) in logs"
                    :key="index"
                    :timestamp="log.time"
                    :type="log.type"
                    size="large"
                  >
                    <div class="log-content">
                      <div class="log-action">{{ log.action }}</div>
                      <div class="log-user">{{ log.user }}</div>
                      <div v-if="log.remark" class="log-remark">{{ log.remark }}</div>
                    </div>
                  </el-timeline-item>
                </el-timeline>
              </div>
            </div>

            <!-- 支付信息 -->
            <div class="info-section" style="margin-top: 24px;">
              <div class="section-title">
                <span class="section-indicator"></span>
                支付信息
              </div>
              <el-descriptions :column="1" border size="small">
                <el-descriptions-item label="支付方式">
                  <el-tag :type="getPaymentTag(detailData.paymentMethod)">
                    {{ detailData.paymentMethod || '未选择' }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="支付金额">
                  <span style="font-weight: 700; color: #409eff;">
                    ¥{{ formatNumber(totalAmount) }}
                  </span>
                </el-descriptions-item>
                <el-descriptions-item label="支付状态">
                  <el-tag :type="detailData.paymentStatus === 'paid' ? 'success' : 'warning'">
                    {{ detailData.paymentStatus === 'paid' ? '已支付' : '待支付' }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="支付时间">
                  {{ detailData.paymentTime || '-' }}
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
                <el-button type="primary" plain size="small" @click="handlePrint">
                  <el-icon><Printer /></el-icon> 打印小票
                </el-button>
                <el-button type="success" plain size="small" @click="handleRefund">
                  <el-icon><Money /></el-icon> 退款
                </el-button>
                <el-button type="warning" plain size="small" @click="handleSendReceipt">
                  <el-icon><Message /></el-icon> 发送电子小票
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
          </div>
          <div class="footer-right">
            <el-button type="warning" @click="handleEdit">
              <el-icon><Edit /></el-icon> 编辑
            </el-button>
            <el-button type="primary" @click="handlePrint">
              <el-icon><Printer /></el-icon> 打印小票
            </el-button>
            <el-button type="success" @click="handleExport">
              <el-icon><Download /></el-icon> 导出PDF
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

    <!-- 退款对话框 -->
    <el-dialog
      v-model="refundDialogVisible"
      title="退款"
      width="450px"
      :close-on-click-modal="false"
    >
      <el-form :model="refundForm" label-width="100px">
        <el-form-item label="退款金额">
          <el-input-number
            v-model="refundForm.amount"
            :min="0.01"
            :precision="2"
            :max="totalAmount"
            controls-position="right"
            style="width: 100%"
          />
          <span style="margin-left: 8px; color: #909399; font-size: 13px;">
            最大可退 ¥{{ formatNumber(totalAmount) }}
          </span>
        </el-form-item>
        <el-form-item label="退款方式">
          <el-radio-group v-model="refundForm.method">
            <el-radio label="original">原路返回</el-radio>
            <el-radio label="cash">现金退款</el-radio>
            <el-radio label="transfer">银行转账</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="退款原因">
          <el-input
            v-model="refundForm.reason"
            type="textarea"
            :rows="3"
            placeholder="请输入退款原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="refundDialogVisible = false">取消</el-button>
        <el-button type="danger" :loading="refundLoading" @click="confirmRefund">
          确认退款
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft,
  Edit,
  Delete,
  Download,
  Printer,
  WarningFilled,
  Money,
  Message
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// ========== 响应式数据 ==========
const loading = ref(false)
const deleteLoading = ref(false)
const refundLoading = ref(false)
const deleteDialogVisible = ref(false)
const refundDialogVisible = ref(false)

// 详情数据
const detailData = reactive({
  id: 0,
  orderNo: '',
  customer: '',
  phone: '',
  plateNumber: '',
  totalAmount: 0,
  status: '',
  orderDate: '',
  paymentMethod: '',
  paymentStatus: '',
  paymentTime: '',
  cashier: '',
  remark: '',
  discount: 0,
  items: [] as Array<{ name: string; category: string; price: number; qty: number }>
})

// 操作日志
const logs = ref([
  {
    time: '2026-07-22 09:00:00',
    type: 'primary',
    action: '创建订单',
    user: '张伟',
    remark: 'POS 收银创建'
  },
  {
    time: '2026-07-22 09:05:00',
    type: 'success',
    action: '支付完成',
    user: '张伟',
    remark: '微信支付 ¥299.00'
  },
  {
    time: '2026-07-22 09:10:00',
    type: 'info',
    action: '订单处理中',
    user: '系统',
    remark: '已分配到工位'
  }
])

// 退款表单
const refundForm = reactive({
  amount: 0,
  method: 'original',
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
    '现金': 'success',
    '微信支付': 'primary',
    '支付宝': 'warning',
    '信用卡': 'danger',
    '会员卡': 'info'
  }
  return map[method] || 'info'
}

const totalItems = computed(() => {
  return detailData.items.reduce((sum, item) => sum + item.qty, 0)
})

const subtotal = computed(() => {
  return detailData.items.reduce((sum, item) => sum + item.price * item.qty, 0)
})

const discountAmount = computed(() => {
  return subtotal.value * (detailData.discount / 100)
})

const totalAmount = computed(() => {
  return Math.max(0, subtotal.value - discountAmount.value)
})

// ========== 获取详情数据 ==========
const fetchDetail = async () => {
  const id = route.params.id as string
  if (!id) {
    ElMessage.error('无效的订单ID')
    router.push('/pos')
    return
  }

  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 600))

    const mockItems = [
      { name: '标准洗车', category: '洗车', price: 89, qty: 2 },
      { name: '内饰清洁', category: '美容', price: 299, qty: 1 },
      { name: '轮胎护理', category: '保养', price: 120, qty: 1 }
    ]
    const total = mockItems.reduce((sum, item) => sum + item.price * item.qty, 0)

    const mockData = {
      id: parseInt(id),
      orderNo: `POS-${String(id).padStart(6, '0')}`,
      customer: '张三',
      phone: '13800001001',
      plateNumber: '京A12345',
      totalAmount: total,
      status: 'completed',
      orderDate: '2026-07-22 09:00:00',
      paymentMethod: '微信支付',
      paymentStatus: 'paid',
      paymentTime: '2026-07-22 09:05:00',
      cashier: '张伟',
      remark: '客户要求尽快处理',
      discount: 0,
      items: mockItems
    }

    Object.assign(detailData, mockData)
  } catch (error) {
    ElMessage.error('加载详情失败，请重试')
  } finally {
    loading.value = false
  }
}

// ========== 事件处理 ==========
const handleBack = () => {
  router.push('/pos')
}

const handleEdit = () => {
  router.push(`/pos/edit/${detailData.id}`)
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
    router.push('/pos')
  } catch (error) {
    ElMessage.error('删除失败，请重试')
  } finally {
    deleteLoading.value = false
  }
}

const handlePrint = () => {
  window.print()
}

const handleExport = () => {
  ElMessage.success('导出任务已提交')
}

const handleRefund = () => {
  if (detailData.status === 'cancelled') {
    ElMessage.warning('该订单已取消，无法退款')
    return
  }
  refundForm.amount = totalAmount.value
  refundForm.method = 'original'
  refundForm.reason = ''
  refundDialogVisible.value = true
}

const confirmRefund = async () => {
  if (refundForm.amount <= 0) {
    ElMessage.warning('请输入有效的退款金额')
    return
  }
  if (refundForm.amount > totalAmount.value) {
    ElMessage.warning('退款金额不能超过订单总额')
    return
  }

  refundLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success(`退款成功！退款金额 ¥${formatNumber(refundForm.amount)}`)
    refundDialogVisible.value = false
  } finally {
    refundLoading.value = false
  }
}

const handleSendReceipt = () => {
  ElMessage.info('电子小票已发送到客户手机')
}

// ========== 生命周期 ==========
onMounted(() => {
  fetchDetail()
})
</script>

<style scoped>
.pos-detail {
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
}

.detail-content {
  padding: 8px 0;
}

.detail-overview {
  background: linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);
  border-radius: 8px;
  padding: 24px 20px;
  margin-bottom: 8px;
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
}

.section-indicator {
  display: inline-block;
  width: 4px;
  height: 18px;
  background: linear-gradient(135deg, #409eff, #66b1ff);
  border-radius: 2px;
  margin-right: 10px;
}

.description-text {
  line-height: 1.8;
  color: #606266;
  word-break: break-all;
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
  max-height: 300px;
  overflow-y: auto;
}

.timeline-wrapper::-webkit-scrollbar {
  width: 4px;
}

.timeline-wrapper::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 2px;
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
}

.log-remark {
  font-size: 13px;
  color: #606266;
  margin-top: 4px;
  padding: 4px 8px;
  background: #f0f2f5;
  border-radius: 4px;
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
  .pos-detail {
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
}

@media print {
  .header-actions,
  .detail-footer .el-button,
  .quick-actions .el-button {
    display: none !important;
  }

  .pos-detail {
    background: white;
    padding: 0;
  }

  .detail-card {
    box-shadow: none !important;
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

  .order-total {
    background: transparent;
    border: 1px solid #dcdfe6;
  }
}
</style>