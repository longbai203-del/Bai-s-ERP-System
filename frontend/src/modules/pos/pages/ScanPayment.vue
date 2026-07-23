<template>
  <div class="scan-payment-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h1>
          <el-icon :size="28" color="#4F46E5"><Camera /></el-icon>
          扫码支付
        </h1>
        <span class="subtitle">支持微信支付、支付宝、银行卡扫码</span>
      </div>
      <div class="header-actions">
        <el-tag type="success" size="large">
          <span class="scanner-dot"></span> 扫码设备已连接
        </el-tag>
        <el-button @click="handleTestScanner">
          <el-icon><Tools /></el-icon> 测试设备
        </el-button>
      </div>
    </div>

    <!-- 扫码支付主体 -->
    <el-row :gutter="20" class="scan-grid">
      <!-- 左侧：扫码区域 -->
      <el-col :xs="24" :lg="12">
        <el-card class="scanner-card" shadow="hover">
          <template #header>
            <span class="card-title">
              <el-icon><Scan /></el-icon> 扫码支付
            </span>
          </template>

          <div class="scanner-area">
            <!-- 扫码框 -->
            <div class="scanner-frame" :class="{ 'scanning': isScanning }">
              <div class="scan-overlay">
                <div class="scan-corner tl"></div>
                <div class="scan-corner tr"></div>
                <div class="scan-corner bl"></div>
                <div class="scan-corner br"></div>
                <div class="scan-line" v-if="isScanning"></div>
              </div>
              <div class="scan-placeholder" v-if="!isScanning">
                <el-icon :size="64" color="#c0c4cc"><Camera /></el-icon>
                <p>将二维码放入扫描框</p>
              </div>
            </div>

            <div class="scanner-actions">
              <el-button type="primary" size="large" @click="handleStartScan" :loading="isScanning">
                <el-icon><VideoCamera /></el-icon> {{ isScanning ? '扫描中...' : '开始扫描' }}
              </el-button>
              <el-button size="large" @click="handleManualInput">
                <el-icon><Edit /></el-icon> 手动输入
              </el-button>
              <el-button size="large" @click="handleUploadQR">
                <el-icon><Upload /></el-icon> 上传二维码
              </el-button>
            </div>

            <!-- 扫描历史 -->
            <div class="scan-history" v-if="scanHistory.length > 0">
              <el-divider>
                <span style="color: #909399; font-size: 13px;">扫描历史</span>
              </el-divider>
              <el-tag
                v-for="(item, index) in scanHistory"
                :key="index"
                closable
                @close="handleRemoveHistory(index)"
                style="margin: 4px; cursor: pointer;"
                @click="handleLoadScanResult(item)"
              >
                {{ item.orderNo || item.amount ? '¥' + formatNumber(item.amount) : item.code }}
              </el-tag>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：支付信息 -->
      <el-col :xs="24" :lg="12">
        <el-card class="payment-card" shadow="hover">
          <template #header>
            <span class="card-title">
              <el-icon><Money /></el-icon> 支付信息
            </span>
          </template>

          <div v-if="paymentInfo" class="payment-info">
            <div class="info-row merchant">
              <span class="info-label">商户名称</span>
              <span class="info-value">{{ paymentInfo.merchant }}</span>
            </div>
            <div class="info-row amount">
              <span class="info-label">交易金额</span>
              <span class="info-value amount-value">¥{{ formatNumber(paymentInfo.amount) }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">订单号</span>
              <span class="info-value">{{ paymentInfo.orderNo }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">交易时间</span>
              <span class="info-value">{{ paymentInfo.time || currentTime }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">支付方式</span>
              <span class="info-value">
                <el-radio-group v-model="paymentInfo.method" size="large">
                  <el-radio-button label="alipay">
                    <span style="display: flex; align-items: center; gap: 4px;">
                      <span style="font-size: 18px;">💳</span> 支付宝
                    </span>
                  </el-radio-button>
                  <el-radio-button label="wechat">
                    <span style="display: flex; align-items: center; gap: 4px;">
                      <span style="font-size: 18px;">💬</span> 微信支付
                    </span>
                  </el-radio-button>
                  <el-radio-button label="card">
                    <span style="display: flex; align-items: center; gap: 4px;">
                      <span style="font-size: 18px;">🏦</span> 银行卡
                    </span>
                  </el-radio-button>
                </el-radio-group>
              </span>
            </div>

            <!-- 银行卡选择 -->
            <div class="info-row" v-if="paymentInfo.method === 'card'">
              <span class="info-label">选择银行</span>
              <span class="info-value">
                <el-select v-model="paymentInfo.bank" placeholder="请选择银行" style="width: 200px;">
                  <el-option label="沙特国家银行" value="sab" />
                  <el-option label="阿尔拉吉银行" value="alrajhi" />
                  <el-option label="利雅得银行" value="riyad" />
                  <el-option label="沙特法国银行" value="bsf" />
                </el-select>
              </span>
            </div>

            <!-- 支付按钮 -->
            <el-button
              type="success"
              size="large"
              style="width: 100%; margin-top: 16px; height: 56px; font-size: 18px;"
              :loading="paying"
              @click="handlePay"
              :disabled="paymentInfo.amount <= 0"
            >
              <el-icon><Money /></el-icon>
              确认支付 ¥{{ formatNumber(paymentInfo.amount) }}
            </el-button>

            <div class="payment-tips" v-if="paymentInfo.amount <= 0">
              <el-alert
                title="请先扫描或输入订单"
                type="info"
                :closable="false"
                show-icon
              />
            </div>
          </div>

          <div v-else class="empty-payment">
            <el-empty description="请扫描或输入订单" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 手动输入对话框 -->
    <el-dialog
      v-model="manualDialogVisible"
      title="手动输入订单"
      width="450px"
      :close-on-click-modal="false"
    >
      <el-form :model="manualForm" :rules="manualRules" ref="manualFormRef" label-width="100px">
        <el-form-item label="订单号" prop="orderNo">
          <el-input v-model="manualForm.orderNo" placeholder="请输入订单号" />
        </el-form-item>
        <el-form-item label="金额" prop="amount">
          <el-input-number
            v-model="manualForm.amount"
            :min="0.01"
            :precision="2"
            :max="999999.99"
            controls-position="right"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="客户姓名">
          <el-input v-model="manualForm.customer" placeholder="请输入客户姓名（可选）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="manualDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmManualInput" :loading="manualLoading">
          确认加载
        </el-button>
      </template>
    </el-dialog>

    <!-- 支付结果对话框 -->
    <el-dialog
      v-model="resultDialogVisible"
      :title="paymentResult?.success ? '支付成功' : '支付失败'"
      width="420px"
      :close-on-click-modal="false"
    >
      <div class="payment-result" :class="{ 'success': paymentResult?.success, 'failed': !paymentResult?.success }">
        <el-icon :size="64" :color="paymentResult?.success ? '#67c23a' : '#f56c6c'">
          <component :is="paymentResult?.success ? 'CircleCheckFilled' : 'CircleCloseFilled'" />
        </el-icon>
        <p class="result-title">{{ paymentResult?.success ? '支付成功！' : '支付失败' }}</p>
        <p class="result-desc">{{ paymentResult?.message }}</p>
        <div class="result-details" v-if="paymentResult?.success">
          <div class="result-row">
            <span>订单号</span>
            <span>{{ paymentResult.orderNo }}</span>
          </div>
          <div class="result-row">
            <span>金额</span>
            <span>¥{{ formatNumber(paymentResult.amount) }}</span>
          </div>
          <div class="result-row">
            <span>支付方式</span>
            <span>{{ paymentResult.method }}</span>
          </div>
          <div class="result-row">
            <span>支付时间</span>
            <span>{{ paymentResult.time }}</span>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button
          type="primary"
          @click="resultDialogVisible = false"
          v-if="paymentResult?.success"
        >
          完成
        </el-button>
        <el-button
          type="danger"
          @click="resultDialogVisible = false"
          v-else
        >
          重新尝试
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  Camera,
  Tools,
  Scan,
  VideoCamera,
  Edit,
  Upload,
  Money,
  CircleCheckFilled,
  CircleCloseFilled,
  Warning
} from '@element-plus/icons-vue'

// ========== 响应式数据 ==========
const isScanning = ref(false)
const paying = ref(false)
const manualLoading = ref(false)
const manualDialogVisible = ref(false)
const resultDialogVisible = ref(false)
const currentTime = ref('')
const manualFormRef = ref<FormInstance>()
const scanTimer = ref<number | null>(null)

// 支付信息
const paymentInfo = ref<{
  merchant: string;
  amount: number;
  orderNo: string;
  method: string;
  bank: string;
  time: string;
} | null>(null)

// 手动输入表单
const manualForm = reactive({
  orderNo: '',
  amount: 0,
  customer: ''
})

// 支付结果
const paymentResult = ref<{
  success: boolean;
  message: string;
  orderNo: string;
  amount: number;
  method: string;
  time: string;
} | null>(null)

// 扫描历史
const scanHistory = ref<Array<{ code: string; orderNo?: string; amount: number; time: string }>>([])

// ========== 表单验证规则 ==========
const manualRules: FormRules = {
  orderNo: [{ required: true, message: '请输入订单号', trigger: 'blur' }],
  amount: [
    { required: true, message: '请输入金额', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '金额必须大于0', trigger: 'blur' }
  ]
}

// ========== 计算属性 ==========
const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// ========== 时钟更新 ==========
const updateClock = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN', { hour12: false })
}

let clockInterval: number | null = null

// ========== 扫码功能 ==========
const handleStartScan = () => {
  if (isScanning.value) {
    // 停止扫描
    stopScan()
    return
  }

  isScanning.value = true
  ElMessage.info('正在扫描二维码...')

  // 模拟扫描过程
  scanTimer.value = window.setTimeout(() => {
    // 模拟扫描成功
    const mockOrder = {
      merchant: "Bai's ERP 旗舰店",
      amount: Math.round((Math.random() * 2000 + 100) * 100) / 100,
      orderNo: `SCAN-${Date.now().toString().slice(-6)}`,
      method: 'alipay',
      bank: '',
      time: currentTime.value
    }

    paymentInfo.value = mockOrder
    scanHistory.value.unshift({
      code: mockOrder.orderNo,
      orderNo: mockOrder.orderNo,
      amount: mockOrder.amount,
      time: currentTime.value
    })

    stopScan()
    ElMessage.success('扫码成功！')
  }, 2000)
}

const stopScan = () => {
  isScanning.value = false
  if (scanTimer.value) {
    clearTimeout(scanTimer.value)
    scanTimer.value = null
  }
}

// ========== 手动输入 ==========
const handleManualInput = () => {
  manualForm.orderNo = ''
  manualForm.amount = 0
  manualForm.customer = ''
  manualDialogVisible.value = true
}

const confirmManualInput = async () => {
  if (!manualFormRef.value) return
  try {
    await manualFormRef.value.validate()
  } catch {
    return
  }

  manualLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))

    paymentInfo.value = {
      merchant: "Bai's ERP 旗舰店",
      amount: manualForm.amount,
      orderNo: manualForm.orderNo,
      method: 'alipay',
      bank: '',
      time: currentTime.value
    }

    scanHistory.value.unshift({
      code: manualForm.orderNo,
      orderNo: manualForm.orderNo,
      amount: manualForm.amount,
      time: currentTime.value
    })

    manualDialogVisible.value = false
    ElMessage.success('订单已加载')
  } finally {
    manualLoading.value = false
  }
}

// ========== 上传二维码 ==========
const handleUploadQR = () => {
  ElMessage.info('请选择二维码图片（功能开发中）')
}

// ========== 支付功能 ==========
const handlePay = () => {
  if (!paymentInfo.value || paymentInfo.value.amount <= 0) {
    ElMessage.warning('请先加载订单')
    return
  }

  paying.value = true
  setTimeout(() => {
    paying.value = false

    // 模拟支付结果
    const success = Math.random() > 0.1 // 90% 成功率
    const methodMap: Record<string, string> = {
      alipay: '支付宝',
      wechat: '微信支付',
      card: '银行卡'
    }

    paymentResult.value = {
      success: success,
      message: success ? '支付已成功完成' : '支付失败，请重试',
      orderNo: paymentInfo.value!.orderNo,
      amount: paymentInfo.value!.amount,
      method: methodMap[paymentInfo.value!.method] || paymentInfo.value!.method,
      time: currentTime.value
    }

    resultDialogVisible.value = true

    if (success) {
      ElMessage.success('支付成功！')
      // 清空支付信息
      setTimeout(() => {
        paymentInfo.value = null
      }, 1000)
    } else {
      ElMessage.error('支付失败，请重试')
    }
  }, 2000)
}

// ========== 扫描历史 ==========
const handleLoadScanResult = (item: any) => {
  if (paymentInfo.value) {
    ElMessageBox.confirm('当前有未完成的支付，确定要加载新的订单吗？', '确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      paymentInfo.value = {
        merchant: "Bai's ERP 旗舰店",
        amount: item.amount,
        orderNo: item.orderNo || item.code,
        method: 'alipay',
        bank: '',
        time: currentTime.value
      }
      ElMessage.success('已加载历史订单')
    }).catch(() => {})
  } else {
    paymentInfo.value = {
      merchant: "Bai's ERP 旗舰店",
      amount: item.amount,
      orderNo: item.orderNo || item.code,
      method: 'alipay',
      bank: '',
      time: currentTime.value
    }
    ElMessage.success('已加载历史订单')
  }
}

const handleRemoveHistory = (index: number) => {
  scanHistory.value.splice(index, 1)
}

// ========== 测试设备 ==========
const handleTestScanner = () => {
  ElMessage.loading('正在测试扫码设备...', { duration: 1500 })
  setTimeout(() => {
    ElMessage.success('扫码设备测试通过 ✅')
  }, 1500)
}

// ========== 生命周期 ==========
onMounted(() => {
  updateClock()
  clockInterval = window.setInterval(updateClock, 1000)

  // 模拟初始扫描历史
  scanHistory.value = [
    { code: 'ORD-2026-001', orderNo: 'ORD-2026-001', amount: 1250, time: new Date().toISOString().replace('T', ' ').slice(0, 16) },
    { code: 'ORD-2026-002', orderNo: 'ORD-2026-002', amount: 2300, time: new Date().toISOString().replace('T', ' ').slice(0, 16) }
  ]
})

onUnmounted(() => {
  if (clockInterval) {
    clearInterval(clockInterval)
  }
  stopScan()
})
</script>

<style scoped>
.scan-payment-page {
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

.subtitle {
  color: #909399;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.scanner-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #67c23a;
  margin-right: 6px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

.scan-grid {
  min-height: calc(100vh - 180px);
}

.scanner-card {
  border-radius: 12px;
  overflow: hidden;
  height: 100%;
}

.card-title {
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.scanner-area {
  text-align: center;
}

.scanner-frame {
  width: 100%;
  max-width: 380px;
  aspect-ratio: 1;
  margin: 0 auto 20px;
  border: 3px dashed #dcdfe6;
  border-radius: 16px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafbfc;
  transition: all 0.3s ease;
  overflow: hidden;
}

.scanner-frame.scanning {
  border-color: #409eff;
  border-style: solid;
  box-shadow: 0 0 30px rgba(64, 158, 255, 0.15);
}

.scan-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.scan-corner {
  position: absolute;
  width: 30px;
  height: 30px;
  border-color: #409eff;
  border-style: solid;
  border-width: 0;
}

.scan-corner.tl {
  top: 12px;
  left: 12px;
  border-top-width: 4px;
  border-left-width: 4px;
  border-radius: 4px 0 0 0;
}

.scan-corner.tr {
  top: 12px;
  right: 12px;
  border-top-width: 4px;
  border-right-width: 4px;
  border-radius: 0 4px 0 0;
}

.scan-corner.bl {
  bottom: 12px;
  left: 12px;
  border-bottom-width: 4px;
  border-left-width: 4px;
  border-radius: 0 0 0 4px;
}

.scan-corner.br {
  bottom: 12px;
  right: 12px;
  border-bottom-width: 4px;
  border-right-width: 4px;
  border-radius: 0 0 4px 0;
}

.scan-line {
  position: absolute;
  left: 10%;
  right: 10%;
  height: 3px;
  background: linear-gradient(to right, transparent, #409eff, transparent);
  animation: scanMove 2s ease-in-out infinite;
  border-radius: 2px;
}

@keyframes scanMove {
  0% { top: 10%; opacity: 0; }
  50% { top: 85%; opacity: 1; }
  100% { top: 10%; opacity: 0; }
}

.scan-placeholder {
  text-align: center;
  color: #909399;
}

.scan-placeholder p {
  margin: 8px 0 0;
}

.scanner-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.scanner-actions .el-button {
  min-width: 120px;
}

.scan-history {
  margin-top: 16px;
}

.payment-card {
  border-radius: 12px;
  overflow: hidden;
  height: 100%;
}

.payment-info {
  padding: 8px 0;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f2f5;
}

.info-row:last-child {
  border-bottom: none;
}

.info-row.merchant .info-value {
  font-weight: 600;
}

.info-row.amount {
  padding: 16px 0;
}

.info-label {
  color: #909399;
  font-size: 14px;
}

.info-value {
  font-weight: 500;
  color: #303133;
}

.info-value.amount-value {
  font-size: 28px;
  font-weight: 700;
  color: #409eff;
}

.empty-payment {
  padding: 40px 0;
}

.payment-tips {
  margin-top: 12px;
}

.payment-result {
  text-align: center;
  padding: 16px 0;
}

.payment-result .result-title {
  font-size: 22px;
  font-weight: 600;
  margin: 12px 0 4px;
}

.payment-result.success .result-title {
  color: #67c23a;
}

.payment-result.failed .result-title {
  color: #f56c6c;
}

.payment-result .result-desc {
  color: #909399;
  margin-bottom: 16px;
}

.result-details {
  text-align: left;
  background: #f5f7fa;
  border-radius: 8px;
  padding: 12px 16px;
}

.result-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 14px;
  color: #606266;
}

.result-row:last-child {
  border-bottom: none;
}

@media (max-width: 992px) {
  .scan-grid {
    flex-direction: column;
  }

  .scanner-card,
  .payment-card {
    height: auto;
  }

  .scanner-frame {
    max-width: 300px;
  }
}

@media (max-width: 768px) {
  .scan-payment-page {
    padding: 12px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .el-tag,
  .header-actions .el-button {
    font-size: 12px;
  }

  .scanner-frame {
    max-width: 250px;
  }

  .scanner-actions .el-button {
    min-width: 100px;
    font-size: 13px;
  }

  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .info-value.amount-value {
    font-size: 22px;
  }

  .payment-info .el-radio-group {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .payment-info .el-radio-button {
    flex: 1;
    min-width: 60px;
  }
}

@media (max-width: 480px) {
  .scanner-frame {
    max-width: 200px;
  }

  .scanner-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .scanner-actions .el-button {
    width: 100%;
  }

  .info-value.amount-value {
    font-size: 18px;
  }
}
</style>