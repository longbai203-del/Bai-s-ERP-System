<template>
  <div class="receipt-page">
    <!-- 页面标题 -->
    <div class="page-header no-print">
      <div class="header-left">
        <el-button @click="handleBack">
          <el-icon><ArrowLeft /></el-icon> 返回
        </el-button>
        <h1>
          <el-icon :size="28" color="#4F46E5"><Printer /></el-icon>
          小票打印
        </h1>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handlePrint">
          <el-icon><Printer /></el-icon> 打印小票
        </el-button>
        <el-button type="success" @click="handleSave">
          <el-icon><Document /></el-icon> 保存
        </el-button>
        <el-button @click="handleShare">
          <el-icon><Share /></el-icon> 分享
        </el-button>
      </div>
    </div>

    <!-- 小票预览 -->
    <div class="receipt-paper" id="receiptPaper" ref="receiptPaperRef">
      <!-- 小票头部 -->
      <div class="receipt-header">
        <div class="store-logo">🚗</div>
        <div class="store-name">Carwash Pro</div>
        <div class="store-info">
          智能洗车连锁 · 旗舰店<br>
          地址: 北京市朝阳区建国路88号<br>
          电话: 010-8888-6666<br>
          统一社会信用代码: 91110000XXXXXXXXXX
        </div>
      </div>

      <div class="receipt-divider">─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─</div>

      <!-- 小票主体 -->
      <div class="receipt-body">
        <div class="receipt-row header-row">
          <span>商品</span>
          <span>数量</span>
          <span>单价</span>
          <span>小计</span>
        </div>

        <div
          v-for="(item, index) in orderData.items"
          :key="index"
          class="receipt-row item-row"
        >
          <span class="item-name">{{ item.name }}</span>
          <span class="item-qty">×{{ item.qty }}</span>
          <span class="item-price">¥{{ formatNumber(item.price) }}</span>
          <span class="item-total">¥{{ formatNumber(item.price * item.qty) }}</span>
        </div>

        <div class="receipt-divider">─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─</div>

        <!-- 金额汇总 -->
        <div class="receipt-total">
          <div class="total-row">
            <span>小计</span>
            <span>¥{{ formatNumber(subtotal) }}</span>
          </div>
          <div class="total-row" v-if="orderData.discount > 0">
            <span>折扣 ({{ orderData.discount }}%)</span>
            <span style="color: #e6a23c;">-¥{{ formatNumber(discountAmount) }}</span>
          </div>
          <div class="total-row grand-total">
            <span>合计</span>
            <span class="total-amount">¥{{ formatNumber(totalAmount) }}</span>
          </div>
          <div class="total-row" v-if="orderData.paidAmount > 0">
            <span>已支付</span>
            <span style="color: #67c23a;">¥{{ formatNumber(orderData.paidAmount) }}</span>
          </div>
          <div class="total-row" v-if="orderData.changeAmount > 0">
            <span>找零</span>
            <span style="color: #909399;">¥{{ formatNumber(orderData.changeAmount) }}</span>
          </div>
        </div>

        <div class="receipt-divider">─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─</div>

        <!-- 支付信息 -->
        <div class="receipt-payment">
          <div class="payment-row">
            <span>支付方式</span>
            <span>{{ orderData.paymentMethod || '现金' }}</span>
          </div>
          <div class="payment-row">
            <span>支付时间</span>
            <span>{{ orderData.paymentTime || currentTime }}</span>
          </div>
          <div class="payment-row" v-if="orderData.customer">
            <span>客户</span>
            <span>{{ orderData.customer }}</span>
          </div>
        </div>

        <div class="receipt-divider">─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─</div>

        <!-- 小票底部 -->
        <div class="receipt-footer">
          <div class="order-info">
            订单号: <strong>{{ orderData.orderNo }}</strong>
          </div>
          <div class="thanks">感谢您的光临！</div>
          <div class="footer-note">
            本小票为电子凭证，请妥善保管<br>
            如有疑问请致电客服: 400-888-6666
          </div>
          <div class="footer-barcode">
            <div class="barcode">||| ||| ||| ||| ||| ||| ||| ||| |||</div>
            <div class="barcode-text">{{ orderData.orderNo }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 打印设置 -->
    <div class="print-settings no-print">
      <el-card shadow="hover">
        <el-form :model="printSettings" inline>
          <el-form-item label="纸张尺寸">
            <el-select v-model="printSettings.paperSize" style="width: 140px;">
              <el-option label="80mm" value="80mm" />
              <el-option label="58mm" value="58mm" />
              <el-option label="A4" value="A4" />
            </el-select>
          </el-form-item>
          <el-form-item label="打印份数">
            <el-input-number
              v-model="printSettings.copies"
              :min="1"
              :max="10"
              controls-position="right"
              style="width: 100px;"
            />
          </el-form-item>
          <el-form-item>
            <el-switch v-model="printSettings.showLogo" active-text="显示Logo" />
          </el-form-item>
          <el-form-item>
            <el-switch v-model="printSettings.showBarcode" active-text="显示条码" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handlePrint">
              <el-icon><Printer /></el-icon> 打印 (Ctrl+P)
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 保存对话框 -->
    <el-dialog
      v-model="saveDialogVisible"
      title="保存小票"
      width="400px"
    >
      <el-form :model="saveForm" label-width="100px">
        <el-form-item label="文件名">
          <el-input v-model="saveForm.filename" />
        </el-form-item>
        <el-form-item label="保存格式">
          <el-radio-group v-model="saveForm.format">
            <el-radio label="pdf">PDF</el-radio>
            <el-radio label="png">PNG</el-radio>
            <el-radio label="html">HTML</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="saveDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saveLoading" @click="confirmSave">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft,
  Printer,
  Document,
  Share,
  Warning
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// ========== 响应式数据 ==========
const saveLoading = ref(false)
const saveDialogVisible = ref(false)
const receiptPaperRef = ref<HTMLElement>()
const currentTime = ref('')

// 订单数据
const orderData = reactive({
  orderNo: '',
  customer: '',
  items: [] as Array<{ name: string; price: number; qty: number }>,
  discount: 0,
  paidAmount: 0,
  changeAmount: 0,
  paymentMethod: '',
  paymentTime: ''
})

// 打印设置
const printSettings = reactive({
  paperSize: '80mm',
  copies: 1,
  showLogo: true,
  showBarcode: true
})

// 保存表单
const saveForm = reactive({
  filename: '',
  format: 'pdf'
})

// ========== 计算属性 ==========
const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const subtotal = computed(() => {
  return orderData.items.reduce((sum, item) => sum + item.price * item.qty, 0)
})

const discountAmount = computed(() => {
  return subtotal.value * (orderData.discount / 100)
})

const totalAmount = computed(() => {
  return Math.max(0, subtotal.value - discountAmount.value)
})

// ========== 加载订单数据 ==========
const loadOrderData = () => {
  // 从路由参数或本地存储获取订单数据
  const orderId = route.params.id as string
  if (orderId) {
    // 模拟从API获取数据
    orderData.orderNo = `POS-${String(orderId).padStart(6, '0')}`
    orderData.customer = '张三'
    orderData.items = [
      { name: '标准洗车', price: 89, qty: 2 },
      { name: '内饰清洁', price: 299, qty: 1 },
      { name: '轮胎护理', price: 120, qty: 1 }
    ]
    orderData.discount = 0
    orderData.paidAmount = 597
    orderData.changeAmount = 0
    orderData.paymentMethod = '微信支付'
    orderData.paymentTime = new Date().toLocaleString()
  } else {
    // 默认示例数据
    orderData.orderNo = `POS-${Date.now().toString().slice(-6)}`
    orderData.customer = '散客'
    orderData.items = [
      { name: '精致洗车', price: 159, qty: 1 },
      { name: '全车镀晶', price: 899, qty: 1 }
    ]
    orderData.discount = 5
    orderData.paidAmount = 1005.05
    orderData.changeAmount = 0
    orderData.paymentMethod = '会员卡'
    orderData.paymentTime = new Date().toLocaleString()
  }

  saveForm.filename = `小票_${orderData.orderNo}`
}

// ========== 时钟更新 ==========
const updateClock = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN', { hour12: false })
}

let clockInterval: number | null = null

// ========== 打印功能 ==========
const handlePrint = () => {
  window.print()
}

// ========== 保存功能 ==========
const handleSave = () => {
  saveDialogVisible.value = true
}

const confirmSave = async () => {
  saveLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success(`小票已保存为 ${saveForm.filename}.${saveForm.format}`)
    saveDialogVisible.value = false
  } finally {
    saveLoading.value = false
  }
}

// ========== 分享功能 ==========
const handleShare = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: '洗车小票 - Carwash Pro',
        text: `订单 ${orderData.orderNo} 金额 ¥${formatNumber(totalAmount.value)}`,
        url: window.location.href
      })
    } catch {
      // 用户取消分享
    }
  } else {
    // 复制订单信息
    const text = `Carwash Pro 洗车小票\n` +
      `订单号: ${orderData.orderNo}\n` +
      `金额: ¥${formatNumber(totalAmount.value)}\n` +
      `时间: ${orderData.paymentTime || currentTime.value}\n` +
      `支付方式: ${orderData.paymentMethod || '现金'}`

    try {
      await navigator.clipboard.writeText(text)
      ElMessage.success('订单信息已复制到剪贴板')
    } catch {
      ElMessage.info(`订单信息:\n${text}`)
    }
  }
}

// ========== 返回 ==========
const handleBack = () => {
  router.push('/pos')
}

// ========== 键盘快捷键 ==========
const handleKeydown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
    e.preventDefault()
    handlePrint()
  }
}

// ========== 生命周期 ==========
onMounted(() => {
  loadOrderData()
  updateClock()
  clockInterval = window.setInterval(updateClock, 1000)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  if (clockInterval) {
    clearInterval(clockInterval)
  }
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.receipt-page {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

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
  gap: 12px;
}

.header-left h1 {
  margin: 0;
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

/* 小票样式 */
.receipt-paper {
  width: 320px;
  margin: 0 auto 20px;
  background: #ffffff;
  padding: 20px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #1f2937;
  transition: all 0.3s ease;
}

.receipt-paper:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.receipt-header {
  text-align: center;
  padding-bottom: 8px;
}

.store-logo {
  font-size: 32px;
  margin-bottom: 4px;
}

.store-name {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
}

.store-info {
  font-size: 10px;
  color: #6b7280;
  line-height: 1.6;
  margin-top: 4px;
}

.receipt-divider {
  text-align: center;
  color: #9ca3af;
  font-size: 10px;
  padding: 4px 0;
  letter-spacing: 2px;
}

.receipt-body {
  padding: 4px 0;
}

.receipt-row {
  display: grid;
  grid-template-columns: 2fr 0.8fr 1fr 1.2fr;
  gap: 4px;
  padding: 3px 0;
  font-size: 11px;
}

.header-row {
  font-weight: 700;
  color: #4b5563;
  border-bottom: 1px dashed #e5e7eb;
  padding-bottom: 6px;
  margin-bottom: 4px;
}

.item-row {
  border-bottom: 1px dotted #f3f4f6;
}

.item-name {
  word-break: break-word;
}

.item-qty {
  text-align: center;
}

.item-price {
  text-align: right;
}

.item-total {
  text-align: right;
  font-weight: 500;
}

.receipt-total {
  padding: 4px 0;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 2px 0;
  font-size: 12px;
}

.total-row.grand-total {
  font-size: 16px;
  font-weight: 700;
  border-top: 2px solid #1f2937;
  padding-top: 8px;
  margin-top: 4px;
}

.total-amount {
  color: #409eff;
}

.receipt-payment {
  padding: 4px 0;
}

.payment-row {
  display: flex;
  justify-content: space-between;
  padding: 2px 0;
  font-size: 11px;
}

.receipt-footer {
  text-align: center;
  padding-top: 8px;
}

.order-info {
  font-size: 11px;
  color: #4b5563;
  margin-bottom: 6px;
}

.thanks {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin: 8px 0;
}

.footer-note {
  font-size: 9px;
  color: #9ca3af;
  line-height: 1.6;
}

.footer-barcode {
  margin-top: 12px;
}

.barcode {
  font-family: 'Courier New', monospace;
  font-size: 18px;
  letter-spacing: 2px;
  color: #1f2937;
  font-weight: 700;
}

.barcode-text {
  font-size: 10px;
  color: #6b7280;
  margin-top: 2px;
}

/* 打印设置 */
.print-settings {
  max-width: 800px;
  margin: 0 auto;
}

.print-settings .el-card {
  border-radius: 12px;
}

.print-settings .el-form {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  align-items: center;
}

/* 打印样式 */
@media print {
  .no-print {
    display: none !important;
  }

  .receipt-page {
    padding: 0 !important;
    background: white !important;
  }

  .receipt-paper {
    width: 100% !important;
    margin: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    padding: 16px !important;
    font-size: 10px !important;
  }

  .receipt-paper:hover {
    box-shadow: none !important;
  }

  .store-name {
    font-size: 16px !important;
  }

  .receipt-row {
    font-size: 10px !important;
    padding: 2px 0 !important;
  }

  .total-row.grand-total {
    font-size: 14px !important;
  }

  .barcode {
    font-size: 14px !important;
  }

  .thanks {
    font-size: 12px !important;
  }

  .page-header {
    display: none !important;
  }

  .print-settings {
    display: none !important;
  }
}

/* 响应式 */
@media (max-width: 480px) {
  .receipt-paper {
    width: 100%;
    padding: 16px 12px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .el-button {
    flex: 1;
    font-size: 12px;
  }

  .print-settings .el-form {
    flex-direction: column;
    align-items: stretch;
  }

  .print-settings .el-form-item {
    margin-right: 0;
    margin-bottom: 8px;
  }

  .print-settings .el-form-item:last-child {
    margin-bottom: 0;
  }

  .print-settings .el-select,
  .print-settings .el-input-number {
    width: 100% !important;
  }
}
</style>